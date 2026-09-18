import mongoose from 'mongoose'
import moment from 'moment'
import List from '@abserve/Module/Listing/Model/Listings'
import ListingPricing from '@abserve/Module/Listing/Model/ListingPricing'
import Booking from '@abserve/Module/Listing/Model/Booking'
import User from '@abserve/Module/Auth/Model/User'
import UserBank from '@abserve/Module/PaymentGateway/Model/userBank'
import PayoutHistory from '@abserve/Module/PaymentGateway/Model/payoutHistory'
import CustomError from '@abserve/errors/index'
import { Response } from 'express'
import { EmailController as Mail } from '@abserve/MailGateway/SendMail'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { ListValidator } from '@abserve/Module/Listing/Validators/ListValidator'
import { BaseController } from '@abserve/Module/BaseControllers'
import { Config } from '@abserve/Config/AppConfig'
import { Constants } from '@abserve/Config/Constants'
import { StripeController as stripe } from '@abserve/Module/PaymentGateway/Controller/StripeController'
import { FareCalculationController as fare } from '@abserve/Module/Listing/Controller/FareCalculation'
import { WalletController as wallet } from '@abserve/Module/PaymentGateway/Controller/WalletController'
import { NotificationController } from '@abserve/Module/Notification/NotificationController'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'

class BookingController extends BaseController {
  constructor() {
    super()
  }

  static readonly bookingEstimation = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const query: any = req.query
      const listingId = req.params.listingId || ''
      const queryData = { est: query, listingId }

      let validation = await ListValidator.validateData(query , "estimateListing")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }
        
      let est: any = await fare.estimation(queryData)
      let data = {
        listingId: est.listingId,
        bookingType: est.bookingType,
        nights: est.nights,
        hours: est.hours,
        startDate: est.startDate,
        endDate: est.endDate,
        Adult: est.Adult,
        Children: est.Children,
        extraGuestCount: est.extraGuest,
        extraGuestAmount: est.extraGuestAfterAmount,
        Pets: est.Pets,
        perHour: est.perHour,
        perDay: est.perDay,
        dayFare: est.dayFare,
        hourFare: est.hourFare,
        discountPercentage: est.discountPercentage,
        discountedPrice: est.discountedPrice,
        totalAmountBeforeTax: est.totalAmountBeforeTax,
        taxAmount: est.taxAmount,
        taxPercentage: est.taxPercentage,
        commissionAmount: est.commissionAmount,
        commissionPercentage: est.commissionPercentage,
        fareAmount: est.fareAmount,
        discountData: est.discountData
      }
      const selectedCurrency: any = (req.query.currency) || null
      const exchangeData: { exchangeRate: any; toCode: any; toSymbol: any } = await helper.getExchangeRate(selectedCurrency)  


      // RESPONSE
      response.message = 'BOOKING_ESTIMATION'
      response.status = true
      response.statusCode = 200
      response.data = { multipleCurrency: exchangeData, estimation: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  //update booking status by provider
  static readonly confirmBooking = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const bookingId = req.params.bookingId
      let auth = req.auth;

      let providerData: any = await User.findOne({ _id: auth.userId }).lean().exec()
      if(!providerData) throw new CustomError.BadRequestError('USER_NOT_FOUND')

      let statusCheck: any = await Booking.find({ _id: new mongoose.Types.ObjectId(bookingId), status: 'booked' }).lean().exec()
      if (statusCheck != 0) throw new CustomError.BadRequestError('BOOKING_CONFIRMED_ALREADY')

      let bookingData: any = await Booking.findOne({
          _id: new mongoose.Types.ObjectId(bookingId),
          providerId: new mongoose.Types.ObjectId(auth.userId),
          status: 'pending'
      }).exec()

      if (!bookingData) throw new CustomError.BadRequestError('BOOKING_NOT_FOUND')


      let listingPricing: any = await ListingPricing.findOne({ listingId: bookingData.listingId }).lean().exec();
      if (!listingPricing) throw new CustomError.BadRequestError('LISTING_PRICING_NOT_FOUND');

      const listingId = bookingData.listingId;
      const startDate = bookingData.bookedDates.start;
      const endDate = bookingData.bookedDates.end;

      let bookedData = await Booking.aggregate([
        {
          $match: {
            listingId: new mongoose.Types.ObjectId(listingId),
            status: { $in: ["pending", "booked"] }
          }
        },
        {
          $match: {
            $or: [
              {
                $or: [
                  { 'bookedDates.start': { $lte: new Date(endDate), $gte: new Date(startDate) } },
                  { 'bookedDates.end': { $lte: new Date(endDate), $gte: new Date(startDate) } }
                ]
              },
              {
                $or: [
                  { 'bookedDates.start': { $lte: new Date(startDate), $gte: new Date(endDate) } },
                  { 'bookedDates.end': { $gte: new Date(endDate), $lte: new Date(startDate) } }
                ]
              }
            ]
          }
        },
        {
          $count: 'totalBookings'
        }
      ]);
      
      // if (bookedData && bookedData.length > 0 && bookedData[0].totalBookings >= listingPricing.availableCount) {
      //   throw new CustomError.BadRequestError('BOOKING_LIMIT_EXCEEDED');
      // }
      
      let updateDoc: any = await Booking.findById(bookingId).exec()
      updateDoc.status = 'booked'
      updateDoc.confirmedDate = Date.now()
      const data: any = await updateDoc.save()
      if (!data) {
        throw new CustomError.BadRequestError('DATA_NOT_FOUND')
      } else {
        if( providerData.instantBooking){
        if ((bookedData[0]?.totalBookings || 0) == listingPricing.availableCount){
        // update booked dates
        let update = {
          start: data.bookedDates.start,
          end: data.bookedDates.end,
          desc: 'bookedDates'
        }

         await ListingPricing.findOneAndUpdate({ listingId: data.listingId }, { $push: { blockedDates: update } }).lean().exec()
      }
    }

        let userData = await User.findById(data.userId).lean().exec()
        const formattedDate = new Date(data.confirmedDate).toLocaleString()
        // let guest = Number(listData[0].guest.adults || 0) + Number(listData[0].guest.children || 0) + Number(listData[0].guest.pets || 0);
        let mailData = {
          userName: userData.firstname,
          bookingId: bookingId,
          // listing: listData[0].propertyName,
          checkInDate: data.bookedDates.start,
          checkOutDate: data.bookedDates.end,
          // PropertyCategory: listData[0].category,
          // guest: guest,
          confirmedDate: formattedDate
        }
         await Mail.sendMail(userData.email, mailData, 'BOOKINGCONFIRM')

        let notifiData = {
          forWhom: data.userId,
          message: 'Your BookingNo (' + data.bookingNo + ') confirmed',
          fromWhom: 'PROVIDER',
          userType: 'USER',
          title: 'Confirm Booking',
          link: '',
          image: ''
        }
        await NotificationController.notification(notifiData)
      }
      if (data.discountAmount != 0) {
        let transactionData = {
          amount: data.discountAmount,
          type: 'credit',
          desc: 'discount amount',
          userType: 'PROVIDER',
          userId: data.providerId
        }
        await wallet.updateWallet(transactionData)
      }


      // RESPONSE
      response.message = 'BOOKING_CONFIRMED'
      response.status = true
      response.statusCode = 200
      response.data = { booking: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly completeBooking = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const bookingId = req.params.bookingId;
      let auth = req.auth, data: any;
      let bookingData = await Booking.findOne({
          _id: new mongoose.Types.ObjectId(bookingId),
          providerId: new mongoose.Types.ObjectId(auth.userId)
        }).lean().exec()
      if (!bookingData) throw new CustomError.BadRequestError('BOOKING_NOT_FOUND')

      let statusCheck: any = await Booking.find({ _id: new mongoose.Types.ObjectId(bookingId), status: 'checkOut' }).lean().exec()
      if (statusCheck != 0) throw new CustomError.BadRequestError('BOOKING_CHECKOUT_ALREADY')

      if (bookingData.paymentMode == 'cash') {
        data = await Booking.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(bookingId),
              providerId: auth.userId,
              status: 'booked',
              paymentMode: 'cash'
            },
            {
              status: 'checkOut',
              checkOutDate: Date.now(),
              paidDate: Date.now(),
              paidAmount: bookingData.fareAmount
            },
            { new: true }
          ).exec()
        if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')
      }
      if (bookingData.paymentMode == 'card') {
        data = await Booking.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(bookingId), providerId: auth.userId, status: 'booked' },
            { status: 'checkOut', checkOutDate: Date.now() },
            { new: true }
          ).exec()
        if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')
      }

      if (data) {
        //debit amount to provider wallet
        if (bookingData.paymentMode == 'card') {
          // let transactionData = {
          //   orderId: bookingId,
          //   amount: data.hostAmount,
          //   type: 'credit',
          //   description: 'Admin to Host',
          //   userType: Constants.userRole.PROVIDER,
          //   userId: data.providerId
          // }
          // let completeWallet: any = await wallet.updateWallet(transactionData)
          // let payoutId = completeWallet[0]._id

          // await Booking.findOneAndUpdate(
          //   { _id: bookingId },
          //   { payoutId: payoutId },
          //   { new: true }
          // )
        if(Config.hiddenSettings.autoPayout === '1'){
          const hostBank = await UserBank.findOne({
             userId: data.providerId,
             paymentMethod: 'stripe',
             stripeAcctId: { $ne: null }
          }).lean()

            if (hostBank) {
          try {
            const payoutData = await stripe.payout({
              amount: Math.round(data.hostAmount * 100),
              currency: bookingData.currency,
              acctId: hostBank.stripeAcctId
            })

            // const triggerPayoutData = await stripe.triggerPayout({
            //   amount: Math.round(data.hostAmount * 100),
            //   acctId: hostBank.stripeAcctId
            // })

            await PayoutHistory.create({
              userId: data.providerId,
              userType: 'PROVIDER',
              transferId: payoutData.id,
              objectType: payoutData.object,
              amount: payoutData.amount,
              amountReversed: payoutData.amount_reversed,
              balanceTransaction: payoutData.balance_transaction,
              createdAt: new Date(payoutData.created * 1000),
              currency: payoutData.currency,
              description: payoutData.description,
              destination: payoutData.destination,
              destination_payment: payoutData.destination_payment,
              livemode: payoutData.livemode,
              source_type: payoutData.source_type
            })

            await Booking.findByIdAndUpdate(bookingId, {
              payoutDone: true
            })
          } catch (err) {
            console.error('Auto Stripe payout failed:', err.message)
          }
        }
        }
        }
        //Notification user
        let userData = await User.findById(data.userId).lean().exec()
        const CheckInDate = new Date(data.bookedDates.start).toLocaleString()
        const CheckOutDate = new Date(data.bookedDates.end).toLocaleString()
        let listData = await List.findOne({ _id: new mongoose.Types.ObjectId(data.listingId) }).exec()
        let mailData = {
          user: userData.firstname,
          company: 'Airstar',
          roomType: listData.propertyCategory,
          checkInDate: CheckInDate,
          CheckOutDate: CheckOutDate,
          nights: data.bookedHours.nights,
          Amount: data.fareAmount,
          propertyName: listData.propertyName
        }
        let otpMail = await Mail.sendMail(userData.email, mailData, 'CHECKOUT')
        console.log(mailData, otpMail)

        let notifiData = {
          forWhom: data.userId,
          message: 'Checked Out',
          fromWhom: 'PROVIDER',
          userType: 'USER',
          title: 'CheckingOut',
          link: '',
          image: ''
        }
        await NotificationController.notification(notifiData)
      }


      // RESPONSE
      response.message = 'BOOKING_CLOSED'
      response.status = true
      response.statusCode = 200
      response.data = { booking: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly cancelBooking = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const bookingId = req.params.bookingId;
      let auth = req.auth, data: any, notifiData: any;

      let checkBooking = await Booking.findOne({ _id: new mongoose.Types.ObjectId(bookingId) }).lean().exec()
      if (!checkBooking) throw new CustomError.BadRequestError('BOOKING_NOT_FOUND')

      let listData = await List.findOne({ _id: new mongoose.Types.ObjectId(checkBooking.listingId) }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      let bookingData = await Booking.find({ _id: new mongoose.Types.ObjectId(bookingId), status: 'cancelled' }).lean().exec()
      if (bookingData.length !== 0) throw new CustomError.BadRequestError('BOOKING_CANCELLED_ALREADY')

      let providerData = await User.findOne({ _id: new mongoose.Types.ObjectId(checkBooking.providerId) }).lean().exec()
      if(!providerData) throw new CustomError.BadRequestError('PROVIDER_NOT_FOUND')

      let userData = await User.findOne({ _id: new mongoose.Types.ObjectId(auth.userId) }).lean().exec()
      if(!userData) throw new CustomError.BadRequestError('USER_NOT_FOUND')

      if (auth.role == Constants.userRole.USER && req.body.type == 'provider') {
        data = await Booking.findOneAndUpdate(
            {
              _id: bookingId,
              providerId: new mongoose.Types.ObjectId(auth.userId),
              status: { $in: ['pending', 'booked'] }
            },
            {
              status: 'cancelled',
              'cancellation.Reason': req.body.reason,
              'cancellation.cancledBy': 'PROVIDER',
              'cancellation.cancleDate': Date.now(),
              paymentStatus: 'refund'
            },
            { new: true, upsert: true }
          ).exec()
        if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')
        notifiData = {
          forWhom: data.userId,
          message: 'Your Booking (' + data._id + ') cancelled By Host',
          fromWhom: 'PROVIDER',
          userType: 'USER',
          title: 'Booking Cancelled',
          link: '',
          image: ''
        }
        await NotificationController.notification(notifiData)

      }
      if (auth.role == Constants.userRole.USER && req.body.type == 'user') {
        data = await Booking.findOneAndUpdate(
            { _id: bookingId, userId: auth.userId, status: { $in: ['pending', 'booked'] } },
            {
              status: 'cancelled',
              'cancellation.Reason': req.body.reason,
              'cancellation.cancledBy': 'USER',
              'cancellation.cancleDate': Date.now(),
              paymentStatus: 'refund'
            },
            { new: true, upsert: true }
          ).exec()
        if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')
        notifiData = {
          forWhom: data.providerId,
          message: 'Booking (' + data._id + ') cancelled',
          fromWhom: 'USER',
          userType: 'PROVIDER',
          title: 'Booking Cancelled',
          link: '',
          image: ''
        }
        await NotificationController.notification(notifiData)

      }
      if (data) {
        //cancel from listing price model
        let update = {
          start: data.bookedDates.start,
          end: data.bookedDates.end,
          desc: 'bookedDates'
        }
        await ListingPricing.findOneAndUpdate({ listingId: data.listingId }, { $pull: { blockedDates: update } }).lean().exec()

        let userData = await User.findById(data.userId).lean().exec()
        const formattedDate = new Date(data.cancellation.cancleDate).toLocaleString()
        let mailData = { ListingId: data.listingId, date: formattedDate, bookingId: bookingId }
        await Mail.sendMail(userData.email, mailData, 'cancelBooking')

        await this.sendCancelPushNotifications({
                     userFcmId: userData.fcmId,
                     hostFcmId: providerData.fcmId,
                     templateData: {
                        userName: userData.firstname,
                        listingName: listData.propertyName,
                        fareAmount: checkBooking.paidAmount,
                        cancelDate: new Date(checkBooking.cancellation.cancleDate).toLocaleDateString('en-GB'),
                        bookingId: `${Config.bookingPrefix}${checkBooking.bookingNo}`,
                     },
          })

        // notifiData = {
        //   forWhom: data.userId,
        //   message: 'Your BookingId (' + data._id + ') cancelled',
        //   fromWhom: 'PROVIDER',
        //   userType: 'USER',
        //   title: 'Booking Cancelled',
        //   link: '',
        //   image: ''
        // }
        // await NotificationController.notification(notifiData)
      }


      // RESPONSE
      response.message = 'CANCELLED_LISTING'
      response.status = true
      response.statusCode = 200
      response.data = { booking: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

   static readonly sendCancelPushNotifications = async ({ userFcmId, hostFcmId, templateData }) => {
    try {
      const notifications = []
  
      if (userFcmId) {
        notifications.push(
          NotificationController.createPushNotification({
            data: {
              pushToken: userFcmId,
              key: 'bookingCancel',
              title: 'Booking Cancelled',
              body: 'Booking Cancelled',
              templateData,
            },
          })
        )
      }
  
      if (hostFcmId) {
        notifications.push(
          NotificationController.createPushNotification({
            data: {
              pushToken: hostFcmId,
              key: 'bookingCancel',
              title: 'Booking Cancelled',
              body: 'Booking Cancelled',
              templateData,
            },
          })
        )
      }
  
      const results = await Promise.allSettled(notifications)
  
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(
            `FAILED_TO_SEND_PUSH_NOTIFICATION to ${index === 0 ? 'user' : 'host'}:`,
            result.reason
          )
        }
      })
    } catch (err) {
      console.log('FAILED_TO_SEND_PUSH_NOTIFICATION', err)
    }
  }


  static readonly refund = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body;
      let mssg: any, update: any, data: any, refundData: any, refundAmount = 0;

      let booking= await Booking.findOne({ _id: req.params.bookingId })
      if(!booking) throw new CustomError.BadRequestError('BOOKING_NOT_FOUND')

      let bookingData = await Booking.findOne({
          _id: req.params.bookingId,
          paymentMode: 'card',
          status: 'cancelled',
          paymentStatus: 'refund',
          'cancellation.cancledBy': 'USER'
      }).lean().exec()
      let bookingData1 = await Booking.findOne({
          _id: req.params.bookingId,
          paymentMode: 'card',
          status: 'cancelled',
          paymentStatus: 'refund',
          'cancellation.cancledBy': 'PROVIDER'
      }).lean().exec()

      if (bookingData) {
        let diffInDay = commFunc(bookingData)
        if (body.cancellationPolicyId == 0 || body.cancellationPolicyId == 3) {
          mssg = 'NON-REFUNDABLE'
          response.data = {}
        } else {
          if (body.cancellationPolicyId == 1 && diffInDay < 5) {
            refundAmount = bookingData.hostAmount
            data = {
              fareAmount: refundAmount,
              payment_intent: bookingData.paymentId
            }
            mssg = 'FULL REFUNDABLE'
          }
          if (body.cancellationPolicyId == 2 && diffInDay < 3) {
            refundAmount = bookingData.fareAmount / 2
            data = {
              fareAmount: refundAmount,
              payment_intent: bookingData.paymentId
            }
            mssg = '50% REFUNDABLE'
          }
          refundData = await stripe.refund(data)
          if (refundData) {
            response.data = { booking: refundData }
            update = await Booking.findOneAndUpdate(
                { _id: req.params.bookingId },
                { status: 'refund', refundAmount: refundAmount, refundDate: Date.now() },
                { new: true, upsert: true }
            ).exec()
            if (!update) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

            response.message = mssg
            response.status = true
            response.statusCode = 200
          }
        }
      }

      if (bookingData1) {
        let diffInDays = commFunc(bookingData1)
        if (body.cancellationPolicyId == 0 || body.cancellationPolicyId == 3) {
          refundAmount = bookingData1.fareAmount
          data = {
            fareAmount: refundAmount,
            payment_intent: bookingData1.paymentId
          }
          mssg = 'FULL REFUNDABLE'
        }
        if (body.cancellationPolicyId == 1 && diffInDays < 5) {
          refundAmount = bookingData1.fareAmount
          data = {
            fareAmount: refundAmount,
            payment_intent: bookingData1.paymentId
          }
          mssg = 'FULL REFUNDABLE'
        }
        if (body.cancellationPolicyId == 2 && diffInDays < 3) {
          refundAmount = bookingData1.fareAmount
          data = {
            fareAmount: refundAmount,
            payment_intent: bookingData1.paymentId
          }
          mssg = 'FULL REFUNDABLE'
        }
        refundData = await stripe.refund(data)
        if (refundData) {
          response.data = { booking: refundData }
          update = await Booking.findOneAndUpdate(
              { _id: req.params.bookingId },
              { status: 'refund', refundAmount: refundAmount, refundDate: Date.now() },
              { new: true, upsert: true }
          ).exec()
          if (!update) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

          response.message = mssg
          response.status = true
          response.statusCode = 200
        }
      }

      function commFunc(data: any) {
        let checkIn = moment(data.bookedDates.start)
        let cancelledDate = moment(data.cancellation.cancleDate)
        let diffIndays = cancelledDate.diff(checkIn, 'days')
        return diffIndays
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly bookingHistory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let queryData:any = req.query
      const pageQuery: any = await this.paginationBuilder(queryData)
      const startDate = moment().startOf('day').format('yyyy-MM-DD' + 'T' + 'HH:mm:ss').toString()
      const endDate = moment().endOf('day').format('yyyy-MM-DD' + 'T' + 'HH:mm:ss').toString()
      const auth = req.auth;
      const policy = Config.cancelationPolicy;
      const like = {}
      let findQuery = [], project: any, sort: any; 
      if (queryData.search) like['propertyName'] = { $regex: queryData.search, $options: 'i' };
      if (queryData.propertyName) like['propertyName'] = { $regex: queryData.propertyName, $options: 'i' };
      if (queryData.category) like['propertyCategoryName.category'] = { $regex: queryData.category, $options: 'i' };
      if (queryData.username) like['userData.fullname'] = { $regex: queryData.username, $options: 'i' };
      if (queryData.providername) like['providerData.fullname'] = { $regex: queryData.providername, $options: 'i' };
      if (queryData.useremail) like['userData.email'] = { $regex: queryData.useremail, $options: 'i' };
      if (queryData.userphone) like['userData.phone'] = { $regex: queryData.userphone, $options: 'i' };
      if (queryData.hostemail) like['providerData.email'] = { $regex: queryData.hostemail, $options: 'i' };
      if (queryData.hostphone) like['providerData.phone'] = { $regex: queryData.hostphone, $options: 'i' };
      if (queryData.checkIn) {
        const checkIn = new Date(queryData.checkIn);
        const startDay = new Date(checkIn.setHours(0, 0, 0, 0));
        const endDay = new Date(checkIn.setHours(23, 59, 59, 999));
        like['bookingdata.bookedDates.start'] = { $gte: startDay, $lte: endDay };
      }
      if (queryData.checkOut) {
        const checkOut = new Date(queryData.checkOut);
        const startDay = new Date(checkOut.setHours(0, 0, 0, 0));
        const endDay = new Date(checkOut.setHours(23, 59, 59, 999));
        like['bookingdata.bookedDates.end'] = { $gte: startDay, $lte: endDay };
      }
      if (queryData.createdAt) {
        const createdAt = new Date(queryData.createdAt);
        const startDay = new Date(createdAt.setHours(0, 0, 0, 0));
        const endDay = new Date(createdAt.setHours(23, 59, 59, 999));
        like['bookingdata.createdAt'] = { $gte: startDay, $lte: endDay };
      }

      if (auth.role == Constants.userRole.USER && req.query.type == 'user') { 
        if (req.params.list == 'history') {
          findQuery = [
            { 'bookingdata.userId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': 'checkOut' }
            // { "bookingdata.bookedDates.end": { '$lte': endDate } }
          ]
          sort = { $sort: { 'bookingdata.checkOutDate': -1 } }
        }
        if(req.params.list == 'all') {
          findQuery = [
            { 'bookingdata.userId': new mongoose.Types.ObjectId(auth.userId) },
          ]
          sort = { $sort: { 'bookingdata.createdAt': -1 }}
        }
        if (req.params.list == 'current') {
          findQuery = [
            { 'bookingdata.userId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': 'booked' },
            {
              $or: [
                { 'bookingdata.bookedDates.start': { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() } }, 
                { 'bookingdata.bookedDates.end': { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() } },
                { $and: [
                    { 'bookingdata.bookedDates.start': { $lte: moment().startOf('day').toDate() } },
                    { 'bookingdata.bookedDates.end': { $gte: moment().endOf('day').toDate() } }
                  ]
                }
              ]
            }
          ]
          sort = { $sort: { 'bookingdata.confirmedDate': -1 } }
        }
        if (req.params.list == 'upcomming') {
          findQuery = [
            { 'bookingdata.userId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': 'booked' },
            { 'bookingdata.bookedDates.start': { $gte: moment().endOf('day').toDate() } }
          ]
          sort = { $sort: { 'bookingdata.confirmedDate': -1 } }
        }
        if (req.params.list == 'cancelled') {
          findQuery = [
            { 'bookingdata.userId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': { $in: ['cancelled', 'refund'] } }
          ]
          sort = { $sort: { 'bookingdata.cancellation.cancleDate': -1 } }
        }
        if (req.params.list == 'refunds') {
          findQuery = [
            { 'bookingdata.userId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': 'refund' }
          ]
          sort = { $sort: { 'bookingdata.refundDate': -1 } }
        }
        project = {
          propertyName: 1,
          propertyCategoryName: '$propertyCategoryName.category',
          userFirstname: '$userData.firstname',
          userlastname: '$userData.lastname',
          userFullName: '$userData.fullname',
          userPhoneCode:'$userData.phoneCode',
          userPhoneNumber:'$userData.phone',
          userEmail:'$userData.email',
          providerFullName: '$providerData.fullname',
          providerPhoneCode:'$providerData.phoneCode',
          providerPhoneNumber:'$providerData.phone',
          providerEmail:'$providerData.email',
          userId: '$userData._id',
          listingImages: '$listingImages.image',
          address: 1,
          'bookingdata.status': 1,
          'bookingdata.bookedDates': 1,
          'bookingdata.bookedHours': 1,
          'bookingdata.paymentMode': 1,
          'bookingdata.adults': 1,
          'bookingdata.children': 1,
          'bookingdata.pets': 1,
          'bookingdata.currency': 1,
          'bookingdata.currencySymbol': 1,
          'bookingdata.discountCode': 1,
          'bookingdata.discountAmount': 1,
          'bookingdata.perDay': 1,
          'bookingdata.perHour': 1,
          'bookingdata.paidAmount': 1,
          'bookingdata.paymentMethod': 1,
          'bookingdata.fareAmount': 1,
          'bookingdata.paidDate': 1,
          'bookingdata.createdAt': 1,
          'bookingdata.confirmedDate': 1,
          'bookingdata.checkOutDate': 1,
          'bookingdata.cancellation': 1,
          'bookingdata.refundAmount': 1,
          'bookingdata.refundDate': 1,
          'bookingdata.bookingNo': 1,
          'bookingdata._id': 1,
          'bookingdata.cancellationPolicyId':1,
          tax: '$comisionData.tax',
          commission: '$comisionData.commission',
          'bookingdata.paymentId': 1,
          isReviewed: {
            $cond: [
              {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$reviewRating',
                        as: 'review',
                        cond: {
                          $and: [
                            { $eq: ['$$review.userId', new mongoose.Types.ObjectId(auth.userId)] },
                            { $eq: ['$$review.bookingId', '$bookingdata._id'] },
                            { $eq: ['$$review.isReviewed', true] }
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              },
              true,
              false
            ]
          }
        };
      }
      if (auth.role == Constants.userRole.USER && req.query.type == 'provider') {
        if (req.params.list == 'history') {
          findQuery = [
            { 'bookingdata.providerId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': 'checkOut' }
            // { "bookingdata.bookedDates.end": { '$lte': endDate } }
          ]
          sort = { $sort: { 'bookingdata.checkOutDate': -1 } }
        }
        if(req.params.list == 'all') {
          findQuery = [
            { 'bookingdata.userId': new mongoose.Types.ObjectId(auth.userId) },
          ]
        }
        if (req.params.list == 'current') {
          findQuery = [
            { 'bookingdata.providerId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': 'booked' },
            {
              $or: [
                { 'bookingdata.bookedDates.start': { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() } }, 
                { 'bookingdata.bookedDates.end': { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() } },
                { $and: [
                    { 'bookingdata.bookedDates.start': { $lte: moment().startOf('day').toDate() } },
                    { 'bookingdata.bookedDates.end': { $gte: moment().endOf('day').toDate() } }
                  ]
                }
              ]
            }
          ]
          sort = { $sort: { 'bookingdata.confirmedDate': -1 } }
        }
        if (req.params.list == 'upcomming') {
          findQuery = [
            { 'bookingdata.providerId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': 'booked' },
            { 'bookingdata.bookedDates.start': { $gte: moment().endOf('day').toDate()  } }
          ]
          sort = { $sort: { 'bookingdata.confirmedDate': -1 } }
        }
        if (req.params.list == 'cancelled') {
          findQuery = [
            { 'bookingdata.providerId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': { $in: ['cancelled', 'refund'] } }
          ]
          sort = { $sort: { 'bookingdata.cancellation.cancleDate': -1 } }
        }
        if (req.params.list == 'refunds') {
          findQuery = [
            { 'bookingdata.providerId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': 'refund' }
          ]
          sort = { $sort: { 'bookingdata.refundDate': -1 } }
        }
        project = {
          propertyName: 1,
          propertyCategoryName: '$propertyCategoryName.category',
          userFirstname: '$userData.firstname',
          userlastname: '$userData.lastname',
          userFullName: '$userData.fullname',
          userPhoneCode:'$userData.phoneCode',
          userPhoneNumber:'$userData.phone',
          userEmail:'$userData.email',
          providerFullName: '$providerData.fullname',
          providerPhoneCode:'$providerData.phoneCode',
          providerPhoneNumber:'$providerData.phone',
          providerEmail:'$providerData.email',
          userId: '$userData._id',
          listingImages: '$listingImages.image',
          address: 1,
          'bookingdata.status': 1,
          'bookingdata.bookedDates': 1,
          'bookingdata.bookedHours': 1,
          'bookingdata.paymentMode': 1,
          'bookingdata.adults': 1,
          'bookingdata.children': 1,
          'bookingdata.pets': 1,
          'bookingdata.currency': 1,
          'bookingdata.currencySymbol': 1,
          'bookingdata.discountCode': 1,
          'bookingdata.discountAmount': 1,
          'bookingdata.paymentMethod': 1,
          'bookingdata.perDay': 1,
          'bookingdata.perHour': 1,
          'bookingdata.hostAmount': 1,
          'bookingdata.commission': 1,
          'bookingdata.tax': 1,
          'bookingdata.paidAmount': 1,
          'bookingdata.fareAmount': 1,
          'bookingdata.paidDate': 1,
          'bookingdata.createdAt': 1,
          'bookingdata.confirmedDate': 1,
          'bookingdata.checkOutDate': 1,
          'bookingdata.cancellation': 1,
          'bookingdata.refundAmount': 1,
          'bookingdata.refundDate': 1,
          'bookingdata.bookingNo': 1,
          'bookingdata._id': 1,
          'bookingdata.cancellationPolicyId':1,
          tax: '$comisionData.tax',
          commission: '$comisionData.commission',
          'bookingdata.paymentId': 1
        }
      }
      if (auth.role == Constants.userRole.ADMIN) {
        if (req.params.list == 'history') {
          findQuery = [
            { 'bookingdata.status': 'checkOut' }
            // { "bookingdata.bookedDates.end": { '$lte': endDate } }
          ]
          sort = { $sort: { 'bookingdata.checkOutDate': -1 } }
        }
        if(req.params.list == 'all') {
          findQuery = [
            { 'bookingdata.userId': new mongoose.Types.ObjectId(auth.userId) },
          ]
        }
        if (req.params.list == 'current') {
          findQuery = [
            { 'bookingdata.status': 'booked' },
            {
              $or: [
                { 'bookingdata.bookedDates.start': { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() } }, 
                { 'bookingdata.bookedDates.end': { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() } },
                { $and: [
                    { 'bookingdata.bookedDates.start': { $lte: moment().startOf('day').toDate() } },
                    { 'bookingdata.bookedDates.end': { $gte: moment().endOf('day').toDate() } }
                  ]
                }
              ]
            }
          ]
          sort = { $sort: { 'bookingdata.confirmedDate': -1 } }
        }
        if (req.params.list == 'upcomming') {
          findQuery = [
            { 'bookingdata.providerId': new mongoose.Types.ObjectId(auth.userId) },
            { 'bookingdata.status': 'booked' },
            { 'bookingdata.bookedDates.start': { $gte: moment().endOf('day').toDate() } }
          ]
          sort = { $sort: { 'bookingdata.confirmedDate': -1 } }
        }
        if (req.params.list == 'cancelled') {
          findQuery = [{ 'bookingdata.status': { $in: ['cancelled', 'refund'] } }]
          sort = { $sort: { 'bookingdata.cancellation.cancleDate': -1 } }
        }
        if (req.params.list == 'refunds') {
          findQuery = [{ 'bookingdata.status': 'refund' }]
          sort = { $sort: { 'bookingdata.refundDate': -1 } }
        }
        project = {
          propertyName: 1,
          propertyCategoryName: '$propertyCategoryName.category',
          userFirstname: '$userData.firstname',
          userlastname: '$userData.lastname',
          userFullName: '$userData.fullname',
          userPhoneCode:'$userData.phoneCode',
          userPhoneNumber:'$userData.phone',
          userEmail:'$userData.email',
          providerFullName: '$providerData.fullname',
          providerPhoneCode:'$providerData.phoneCode',
          providerPhoneNumber:'$providerData.phone',
          providerEmail:'$providerData.email',
          userId: '$userData._id',
          listingImages: '$listingImages.image',
          address: 1,
          'bookingdata.status': 1,
          'bookingdata.bookedDates': 1,
          'bookingdata.bookedHours': 1,
          'bookingdata.paymentMode': 1,
          'bookingdata.adults': 1,
          'bookingdata.children': 1,
          'bookingdata.pets': 1,
          'bookingdata.currency': 1,
          'bookingdata.currencySymbol': 1,
          'bookingdata.discountCode': 1,
          'bookingdata.discountAmount': 1,
          'bookingdata.paymentMethod': 1,
          'bookingdata.perDay': 1,
          'bookingdata.perHour': 1,
          'bookingdata.hostAmount': 1,
          'bookingdata.commission': 1,
          'bookingdata.tax': 1,
          'bookingdata.paidAmount': 1,
          'bookingdata.fareAmount': 1,
          'bookingdata.paidDate': 1,
          'bookingdata.createdAt': 1,
          'bookingdata.confirmedDate': 1,
          'bookingdata.checkOutDate': 1,
          'bookingdata.cancellation': 1,
          'bookingdata.refundAmount': 1,
          'bookingdata.refundDate': 1,
          'bookingdata.bookingNo': 1,
          'bookingdata._id': 1,
          'bookingdata.cancellationPolicyId':1,
          tax: '$comisionData.tax',
          commission: '$comisionData.commission',
          'bookingdata.paymentId': 1
        }
      }
      let pipeline = [
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'listingId',
            as: 'bookingdata'
          }
        },
        {
          $unwind: { path: '$bookingdata', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryName'
          }
        },
        {
          $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'listingattachments',
            localField: '_id',
            foreignField: 'listingId',
            as: 'listingImages'
          }
        },
        {
          $unwind: { path: '$listingImages', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'providerData'
          }
        },
        {
          $unwind: { path: '$providerData', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'bookingdata.userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        {
          $unwind: { path: '$userData', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'commissions',
            localField: 'userId',
            foreignField: 'providerId',
            as: 'comisionData'
          }
        },
        {
          $unwind: { path: '$comisionData', preserveNullAndEmptyArrays: true }
        },
        {
          $match: { $and: findQuery }
        },
        { $match: like },
        sort,
        {
          $project: project
        },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            detail: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ]
      let bookingHistory = await List.aggregate(pipeline)


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: bookingHistory[0]?.totalCount[0]?.total,
        bookingHistory: bookingHistory[0]?.detail,
        cancellationPolicy: bookingHistory[0].detail.length != 0 ? policy : []
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly bookingApprovalHistory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const pageQuery: any = await this.paginationBuilder(req.query)
      const auth = req.auth;
      const policy = Config.cancelationPolicy;
      const like = { propertyName: { $regex: req.query.search || '', $options: 'i' } }
      let findQuery = [], sort: any, project: any;

      if (req.query.bookingStatus == 'booked') {
        findQuery = [
          { 'bookingdata.providerId': new mongoose.Types.ObjectId(auth.userId) },
          { 'bookingdata.status': 'pending' }
        ]
        project = {
          propertyName: 1,
          propertyCategoryName: '$propertyCategoryName.category',
          userFirstname: '$userData.firstname',
          userId: '$userData._id',
          userlastname: '$userData.lastname',
          address: 1,
          'bookingdata.status': 1,
          'bookingdata.bookingNo': 1,
          'bookingdata.bookedDates': 1,
          'bookingdata.bookedHours': 1,
          'bookingdata.paymentMode': 1,
          'bookingdata.adults': 1,
          'bookingdata.children': 1,
          'bookingdata.pets': 1,
          'bookingdata.currency': 1,
          'bookingdata.currencySymbol': 1,
          'bookingdata.discountCode': 1,
          'bookingdata.discountAmount': 1,
          'bookingdata.perDay': 1,
          'bookingdata.perHour': 1,
          'bookingdata.hostAmount': 1,
          'bookingdata.commission': 1,
          'bookingdata.paidAmount': 1,
          'bookingdata.fareAmount': 1,
          'bookingdata.paidDate': 1,
          'bookingdata.createdAt': 1,
          'bookingdata.checkOutDate': 1,
          'bookingdata._id': 1,
          cancellationPolicyId: '$bookingdata.cancellationPolicyId'
        }
        sort = { $sort: { 'bookingdata.createdAt': -1 } }
      }
      if (req.query.bookingStatus == 'confirmed') {
        findQuery = [
          { 'bookingdata.providerId': new mongoose.Types.ObjectId(auth.userId) },
          { 'bookingdata.status': 'booked' }
        ]
        project = {
          propertyName: 1,
          propertyCategoryName: '$propertyCategoryName.category',
          userFirstname: '$userData.firstname',
          userlastname: '$userData.lastname',
          userId: '$userData._id',
          address: 1,
          'bookingdata.status': 1,
          'bookingdata.bookingNo': 1,
          'bookingdata.bookedDates': 1,
          'bookingdata.bookedHours': 1,
          'bookingdata.paymentMode': 1,
          'bookingdata.adults': 1,
          'bookingdata.children': 1,
          'bookingdata.pets': 1,
          'bookingdata.currency': 1,
          'bookingdata.currencySymbol': 1,
          'bookingdata.discountCode': 1,
          'bookingdata.discountAmount': 1,
          'bookingdata.perDay': 1,
          'bookingdata.perHour': 1,
          'bookingdata.hostAmount': 1,
          'bookingdata.commission': 1,
          'bookingdata.paidAmount': 1,
          'bookingdata.fareAmount': 1,
          'bookingdata.paidDate': 1,
          'bookingdata.createdAt': 1,
          'bookingdata.confirmedDate': 1,
          'bookingdata.checkOutDate': 1,
          'bookingdata._id': 1,
          cancellationPolicyId: '$bookingdata.cancellationPolicyId'
        }
        sort = { $sort: { 'bookingdata.confirmedDate': -1 } }
      }

      let bookingApproval = await List.aggregate([
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'listingId',
            as: 'bookingdata'
          }
        },
        {
          $unwind: { path: '$bookingdata', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryName'
          }
        },
        {
          $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'providerData'
          }
        },
        {
          $unwind: { path: '$providerData', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'bookingdata.userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        {
          $unwind: { path: '$userData', preserveNullAndEmptyArrays: true }
        },
        {
          $match: { $and: findQuery }
        },
        sort,
        {
          $project: project
        },
        { $match: like },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            detail: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])
      if (bookingApproval[0].detail.length != 0) {
        bookingApproval.push({ cancellationPolicy: policy })
      }
      if (!bookingApproval) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.message = 'BOOKINGS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: bookingApproval[0]?.totalCount[0]?.total,
        bookingApprovalHistory: bookingApproval[0]?.detail,
        cancellationPolicy: bookingApproval[0].detail.length != 0 ? policy : []
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly pendingBookingHistory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let queryData:any = req.query
      const pageQuery: any = await this.paginationBuilder(queryData)
      const auth = req.auth;
      const policy = Config.cancelationPolicy;
      const matchCondition: any = { status: 'pending' };
      if (queryData.search) matchCondition['listData.propertyName']= { $regex: queryData.search, $options: 'i' };
      if (queryData.propertyName) matchCondition['listData.propertyName'] = { $regex: queryData.propertyName, $options: 'i' };
      if (queryData.category) matchCondition['propertyCategoryName.category'] = { $regex: queryData.category, $options: 'i' };
      if (queryData.username) matchCondition['userData.fullname'] = { $regex: queryData.username, $options: 'i' };
      if (queryData.useremail) matchCondition['userData.email'] = { $regex: queryData.useremail, $options: 'i' };
      if (queryData.userphone) matchCondition['userData.phone'] = { $regex: queryData.userphone, $options: 'i' };
      if (queryData.providername) matchCondition['providerData.fullname'] = { $regex: queryData.providername, $options: 'i' };
      if (queryData.hostemail) matchCondition['providerData.email'] = { $regex: queryData.hostemail, $options: 'i' };
      if (queryData.hostphone) matchCondition['providerData.phone'] = { $regex: queryData.hostphone, $options: 'i' };
      if (queryData.checkIn) {
        const checkIn = new Date(queryData.checkIn);
        const startDay = new Date(checkIn.setHours(0, 0, 0, 0));
        const endDay = new Date(checkIn.setHours(23, 59, 59, 999));
        matchCondition['bookedDates.start'] = { $gte: startDay, $lte: endDay };
      }
      if (queryData.checkOut) {
        const checkOut = new Date(queryData.checkOut);
        const startDay = new Date(checkOut.setHours(0, 0, 0, 0));
        const endDay = new Date(checkOut.setHours(23, 59, 59, 999));
        matchCondition['bookedDates.end'] = { $gte: startDay, $lte: endDay };
      }
      if (queryData.createdAt) {
        const createdAt = new Date(queryData.createdAt);
        const startDay = new Date(createdAt.setHours(0, 0, 0, 0));
        const endDay = new Date(createdAt.setHours(23, 59, 59, 999));
        matchCondition.createdAt = { $gte: startDay, $lte: endDay };
      }
      let findQuery = [], project: any;

      if (auth.role == Constants.userRole.ADMIN) {
        findQuery = [{ status: 'pending' }]
        project = {
          listingId: 1,
          bookingNo: 1,
          propertyName: '$listData.propertyName',
          propertyCategoryName: '$propertyCategoryName.category',
          userFirstname: '$userData.firstname',
          userlastname: '$userData.lastname',
          userFullName: '$userData.fullname',
          userPhoneCode:'$userData.phoneCode',
          userPhoneNumber:'$userData.phone',
          userEmail:'$userData.email',
          userId: '$userData._id',
          providerFirstname: '$providerData.firstname',
          providerFullName: '$providerData.fullname',
          providerPhoneCode:'$providerData.phoneCode',
          providerPhoneNumber:'$providerData.phone',
          providerEmail:'$providerData.email',
          providerId: '$providerData._id',
          bookedDates: 1,
          bookedHours: 1,
          paymentMode: 1,
          adults: 1,
          children: 1,
          pets: 1,
          currency: 1,
          currencySymbol: 1,
          discountCode: 1,
          discountAmount: 1,
          perDay: 1,
          perHour: 1,
          paidAmount: 1,
          paidDate: 1,
          status: 1,
          commission: 1,
          hostAmount: 1,
          fareAmount: 1,
          createdAt: 1,
          cancellationPolicyId: 1
        }
      }
      if (auth.role == Constants.userRole.USER) {
        findQuery = [{ userId: new mongoose.Types.ObjectId(auth.userId) }, { status: 'pending' }]
        project = {
          listingId: 1,
          bookingNo: 1,
          propertyName: '$listData.propertyName',
          propertyCategoryName: '$propertyCategoryName.category',
          userFirstname: '$userData.firstname',
          userlastname: '$userData.lastname',
          userFullName: '$userData.fullname',
          userPhoneCode:'$userData.phoneCode',
          userPhoneNumber:'$userData.phone',
          userEmail:'$userData.email',
          userId: '$userData._id',
          providerFirstname: '$providerData.firstname',
          providerFullName: '$providerData.fullname',
          providerPhoneCode:'$providerData.phoneCode',
          providerPhoneNumber:'$providerData.phone',
          providerEmail:'$providerData.email',
          providerId: '$providerData._id',
          bookedDates: 1,
          bookedHours: 1,
          paymentMode: 1,
          adults: 1,
          children: 1,
          pets: 1,
          currency: 1,
          currencySymbol: 1,
          discountCode: 1,
          discountAmount: 1,
          perDay: 1,
          perHour: 1,
          paidAmount: 1,
          paidDate: 1,
          status: 1,
          fareAmount: 1,
          createdAt: 1,
          cancellationPolicyId: 1
        }
      }
      let pending = await Booking.aggregate([
        {
          $lookup: {
            from: 'listings',
            localField: 'listingId',
            foreignField: '_id',
            as: 'listData'
          }
        },
        {
          $unwind: { path: '$listData' }
        },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'listData.propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryName'
          }
        },
        {
          $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'providerId',
            foreignField: '_id',
            as: 'providerData'
          }
        },
        {
          $unwind: { path: '$providerData', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        {
          $unwind: { path: '$userData', preserveNullAndEmptyArrays: true }
        },
        { $match: { $and: findQuery } },
        { $match: matchCondition },
        { $sort: { createdAt: -1 } },
        { $project: project },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            detail: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])


      // RESPONSE
      response.message = 'PENDING_BOOKINGS'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: pending[0]?.totalCount[0]?.total,
        pendingHistory: pending[0]?.detail,
        cancellationPolicy: pending[0].detail.length != 0 ? policy : []
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly acceptedBookingHistory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let queryData:any = req.query
      const pageQuery: any = await this.paginationBuilder(queryData)
      const auth = req.auth
      const policy = Config.cancelationPolicy
      const matchCondition: any = { status: 'booked' };
      if (queryData.search) matchCondition['listData.propertyName']= { $regex: queryData.search, $options: 'i' };
      if (queryData.propertyName) matchCondition['listData.propertyName'] = { $regex: queryData.propertyName, $options: 'i' };
      if (queryData.category) matchCondition['propertyCategoryName.category'] = { $regex: queryData.category, $options: 'i' };
      if (queryData.username) matchCondition['userData.fullname'] = { $regex: queryData.username, $options: 'i' };
      if (queryData.providername) matchCondition['providerData.fullname'] = { $regex: queryData.providername, $options: 'i' };
      if (queryData.useremail) matchCondition['userData.email'] = { $regex: queryData.useremail, $options: 'i' };
      if (queryData.userphone) matchCondition['userData.phone'] = { $regex: queryData.userphone, $options: 'i' };
      if (queryData.hostemail) matchCondition['providerData.email'] = { $regex: queryData.hostemail, $options: 'i' };
      if (queryData.hostphone) matchCondition['providerData.phone'] = { $regex: queryData.hostphone, $options: 'i' };
      if (queryData.checkIn) {
        const checkIn = new Date(queryData.checkIn);
        const startDay = new Date(checkIn.setHours(0, 0, 0, 0));
        const endDay = new Date(checkIn.setHours(23, 59, 59, 999));
        matchCondition['bookedDates.start'] = { $gte: startDay, $lte: endDay };
      }
      if (queryData.checkOut) {
        const checkOut = new Date(queryData.checkOut);
        const startDay = new Date(checkOut.setHours(0, 0, 0, 0));
        const endDay = new Date(checkOut.setHours(23, 59, 59, 999));
        matchCondition['bookedDates.end'] = { $gte: startDay, $lte: endDay };
      }
      if (queryData.createdAt) {
        const createdAt = new Date(queryData.createdAt);
        const startDay = new Date(createdAt.setHours(0, 0, 0, 0));
        const endDay = new Date(createdAt.setHours(23, 59, 59, 999));
        matchCondition.createdAt = { $gte: startDay, $lte: endDay };
      }
      let findQuery = [], project: any;

      if (auth.role == Constants.userRole.ADMIN) {
        findQuery = [{ status: 'booked' }]
        project = {
          listingId: 1,
          bookingNo: 1,
          propertyName: '$listData.propertyName',
          propertyCategoryName: '$propertyCategoryName.category',
          userFirstname: '$userData.firstname',
          userlastname: '$userData.lastname',
          userFullName: '$userData.fullname',
          userPhoneCode:'$userData.phoneCode',
          userPhoneNumber:'$userData.phone',
          userEmail:'$userData.email',
          userId: '$userData._id',
          providerFirstname: '$providerData.firstname',
          providerFullName: '$providerData.fullname',
          providerPhoneCode:'$providerData.phoneCode',
          providerPhoneNumber:'$providerData.phone',
          providerEmail:'$providerData.email',
          providerId: '$providerData._id',
          bookedDates: 1,
          bookedHours: 1,
          paymentMode: 1,
          adults: 1,
          children: 1,
          pets: 1,
          currency: 1,
          currencySymbol: 1,
          discountCode: 1,
          discountAmount: 1,
          perDay: 1,
          perHour: 1,
          paidAmount: 1,
          paidDate: 1,
          status: 1,
          commission: 1,
          hostAmount: 1,
          fareAmount: 1,
          createdAt: 1,
          confirmedDate: 1,
          cancellationPolicyId: 1
        }
      }
      if (auth.role == Constants.userRole.USER) {
        findQuery = [{ userId: new mongoose.Types.ObjectId(auth.userId) }, { status: 'booked' }]
        project = {
          listingId: 1,
          bookingNo: 1,
          propertyName: '$listData.propertyName',
          propertyCategoryName: '$propertyCategoryName.category',
          userFirstname: '$userData.firstname',
          userlastname: '$userData.lastname',
          userFullName: '$userData.fullname',
          userPhoneCode:'$userData.phoneCode',
          userPhoneNumber:'$userData.phone',
          userEmail:'$userData.email',
          userId: '$userData._id',
          providerFirstname: '$providerData.firstname',
          providerFullName: '$providerData.fullname',
          providerPhoneCode:'$providerData.phoneCode',
          providerPhoneNumber:'$providerData.phone',
          providerEmail:'$providerData.email',
          providerId: '$providerData._id',
          bookedDates: 1,
          bookedHours: 1,
          paymentMode: 1,
          adults: 1,
          children: 1,
          pets: 1,
          currency: 1,
          currencySymbol: 1,
          discountCode: 1,
          discountAmount: 1,
          perDay: 1,
          perHour: 1,
          paidAmount: 1,
          paidDate: 1,
          status: 1,
          fareAmount: 1,
          createdAt: 1,
          confirmedDate: 1,
          cancellationPolicyId: 1
        }
      }
      let acceptedBooking = await Booking.aggregate([
        {
          $lookup: {
            from: 'listings',
            localField: 'listingId',
            foreignField: '_id',
            as: 'listData'
          }
        },
        {
          $unwind: { path: '$listData' }
        },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'listData.propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryName'
          }
        },
        {
          $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        {
          $unwind: { path: '$userData', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'listData.userId',
            foreignField: '_id',
            as: 'providerData'
          }
        },
        {
          $unwind: { path: '$providerData', preserveNullAndEmptyArrays: true }
        },
        {
          $match: { $and: findQuery }
        },
        { $match: matchCondition },
        { $sort: { confirmedDate: -1, createdAt: -1 } },
        {
          $project: project
        },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            detail: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])
      if (acceptedBooking[0].detail.length != 0) {
        acceptedBooking.push({ cancellationPolicy: policy })
      }


      // RESPONSE
      response.message = 'ACCEPTED_BOOKINGS'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: acceptedBooking[0]?.totalCount[0]?.total,
        acceptedBookingHistory: acceptedBooking[0]?.detail,
        cancellationPolicy: acceptedBooking[0].detail.length != 0 ? policy : []
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  // static readonly upcomingBookingsCount = async (req: AuthenticateRequest, res: Response) => {
  //   let response = {
  //     message: 'Unprocessable Entity',
  //     statusCode: 500,
  //     status: false,
  //     data: {},
  //     validation: {}
  //   };
  
  //   try {
  //     let listingId = req.params.listingId
  //     if(!listingId) throw new CustomError.BadRequestError("LISTINGID_IS_REQUIRED")

  //     const today = new Date();
    
  //     today.setHours(0, 0, 0, 0);
  
  //     const twoWeeks = new Date(today);
  //     twoWeeks.setDate(today.getDate() + 14);
  //     twoWeeks.setHours(23, 59, 59, 999); 
  
  //     const matchCondition = {
  //       listingId: new mongoose.Types.ObjectId(listingId),
  //       'bookedDates.start': {
  //         $gte: today,  
  //         $lte: twoWeeks 
  //       },
  //       status: 'booked' 
  //     };
  
  //     const bookingDetails = await Booking.aggregate([
  //       {
  //         $match: matchCondition
  //       },
  //       {
  //         $group: {
  //           _id: {
  //             $dateToString: { format: '%Y-%m-%d', date: '$bookedDates.start' }
  //           },
  //           count: { $sum: 1 }
  //         }
  //       },
  //       {
  //         $sort: { '_id': 1 }
  //       }
  //     ]);
  //     const listingPricing = await ListingPricing.findOne({ listingId: new mongoose.Types.ObjectId(listingId) });
  //     const blockedDates = listingPricing?.blockedDates || [];

  //     const isDateBlocked = (startDate: Date) => {
  //       return blockedDates.some(block => {
  //         const blockStart = new Date(block.start);
  //         return blockStart.toISOString().split('T')[0] === startDate.toISOString().split('T')[0];
  //       });
  //     };

  //     const allDates = [];
  //     for (let date = new Date(today); date <= twoWeeks; date.setDate(date.getDate() + 1)) {
  //       allDates.push(new Date(date).toISOString().split('T')[0]);
  //     }

  //     const bookingDetailsMap = new Map(bookingDetails.map(detail => [detail._id, detail.count]));

  //     const completeDetails = allDates.map(date => {
  //       const startDate = new Date(date);
  //       return {
  //         date,
  //         count: bookingDetailsMap.get(date) || 0,
  //         blocked: isDateBlocked(startDate)
  //       };
  //     });
  
  //     response.message = 'UPCOMING_BOOKINGS_COUNT';
  //     response.status = true;
  //     response.statusCode = 200;
  //     response.data = completeDetails;
  
  //   } catch (error) {
  //     console.log('Error:', error);
  //     response.status = false;
  //     response.message = error.message || response.message;
  //     response.validation = error.reasons || {};
  //     response.statusCode = error.statusCode || response.statusCode;
  //   }
  
  //   return res.status(response.statusCode || 500).json(response).end();
  // };
  

  static readonly upcomingBookingsCount = async (req: AuthenticateRequest, res: Response) => {

  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {},
    validation: {}
  };

  try {

    const listingId = req.params.listingId;

    if (!listingId) {
      throw new CustomError.BadRequestError("LISTINGID_IS_REQUIRED");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoWeeks = new Date(today);
    twoWeeks.setDate(today.getDate() + 14);
    twoWeeks.setHours(23, 59, 59, 999);

    const matchCondition = {
      listingId: new mongoose.Types.ObjectId(listingId),
      'bookedDates.start': {
        $gte: today,
        $lte: twoWeeks
      },
      status: 'booked'
    };

    const bookingDetails = await Booking.aggregate([
      {
        $match: matchCondition
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$bookedDates.start'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const listing = await List.findById(listingId).lean();

    const weeklySchedule = listing?.weeklySchedule || [];
    const dateOverrides = listing?.dateOverrides || [];

    const listingPricing = await ListingPricing.findOne({
      listingId: new mongoose.Types.ObjectId(listingId)
    });

    const blockedDates = listingPricing?.blockedDates || [];

    const isDateBlocked = (date: Date) => {
      return blockedDates.some(block => {
        const blockStart = new Date(block.start);
        return blockStart.toISOString().split('T')[0] === date.toISOString().split('T')[0];
      });
    };

    const getSlotsForDate = (dateStr: string) => {

      const dateObj = new Date(dateStr);

      const day = dateObj
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();

      const weekly = weeklySchedule.find(d => d.day === day);

      let slots = weekly?.slots || [];

      const override = dateOverrides.find(o => o.date === dateStr);

      if (override) {

        if (override.isUnavailable) {
          return [];
        }

        if (override.blockedSlots?.length) {

          slots = slots.filter(slot =>
            !override.blockedSlots.some(
              b =>
                b.startTime === slot.startTime &&
                b.endTime === slot.endTime
            )
          );

        }

      }

      return slots;

    };

    const allDates: string[] = [];

    for (let date = new Date(today); date <= twoWeeks; date.setDate(date.getDate() + 1)) {
      allDates.push(new Date(date).toISOString().split('T')[0]);
    }

    const bookingDetailsMap = new Map(
      bookingDetails.map(detail => [detail._id, detail.count])
    );

    const completeDetails = allDates.map(date => {

      const startDate = new Date(date);

      const slots = getSlotsForDate(date);

      return {
        date,
        count: bookingDetailsMap.get(date) || 0,
        blocked: isDateBlocked(startDate),
        slots
      };

    });

    response.message = 'UPCOMING_BOOKINGS_COUNT';
    response.status = true;
    response.statusCode = 200;
    response.data = completeDetails;

  } catch (error: any) {

    console.log('Error:', error);

    response.status = false;
    response.message = error.message || response.message;
    response.validation = error.reasons || {};
    response.statusCode = error.statusCode || response.statusCode;

  }

  return res.status(response.statusCode || 500).json(response).end();
};
  
  
}

export { BookingController }