import mongoose from 'mongoose'
import List from '@abserve/Module/Listing/Model/Listings'
import moment from 'moment'
import ListingPricing from '@abserve/Module/Listing/Model/ListingPricing'
import Invoice from '@abserve/Module/Listing/Model/Invoice'
//import Merchant from '@abserve/Module/Payment/models/Merchant'
import Booking from '@abserve/Module/Listing/Model/Booking'
import User from '@abserve/Module/Auth/Model/User'
import CustomError from '@abserve/errors/index'
import { Response } from 'express'
import { EmailController as Mail } from '@abserve/MailGateway/SendMail'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { ListValidator } from '@abserve/Module/Listing/Validators/ListValidator'
import { BaseController } from '@abserve/Module/BaseControllers'
import { Config } from '@abserve/Config/AppConfig'
import { Constants } from '@abserve/Config/Constants'
import { StripeController as stripe } from '@abserve/Module/PaymentGateway/Controller/StripeController'
import { RazorpayController as Razor } from '@abserve/Module/PaymentGateway/Controller/RazorPayController'
import { PhonepeController as Phonepe } from '@abserve/Module/PaymentGateway/Controller/PhonepeController'
import { FareCalculationController as fare } from '@abserve/Module/Listing/Controller/FareCalculation'
import { NotificationController } from '@abserve/Module/Notification/NotificationController'
import Currency from '@abserve/Module/Currency/Currency'

class InvoiceController extends BaseController {
  constructor() {
    super()
  }
 
  static readonly initiatebooking = async (req: AuthenticateRequest, res: Response) => {
    const response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const isMobileApp = req.headers['platform'] === 'Mobile' ? true : false
      const { body, auth }  = req
      const listingId = req.params.listingId;
      const currency = req.query.currency || Config.site.currency
      if(!listingId) throw new CustomError.BadRequestError("LISTING_ID_IS_REQUIRED")
      const validation = await ListValidator.validateData(body , "bookListing") 
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      
      const userData: any = await User.findOne({
          _id: new mongoose.Types.ObjectId(auth.userId),
          verified: true,
          isActive: true,
          softdel: false
      }).lean().exec()     
  
      if (!userData) throw new CustomError.BadRequestError('USER_NOT_VERIFIED')
      
      const listData = await List.findById(listingId).exec()
      if(!listData) throw new CustomError.BadRequestError("LISTING_NOT_FOUND")
      console.log("listData",listData);
      
      const providerData = await User.findById(listData.userId).lean().exec()
      if(!providerData) throw new CustomError.BadRequestError("PROVIDER_NOT_FOUND")
      
      const currencySymbol = await Currency.findOne({ code: currency }, { symbol: 1 }).lean().exec()
      if(!currencySymbol) throw new CustomError.BadRequestError("CURRENCY_SYMBOL_NOT_FOUND")
      
      let paymentIntentRes: any;
      let razorpayOrder: any;
      let phonepeOrder: any;
      
      const queryData = { est: body, listingId }
      const fareData: any = await fare.estimation(queryData)
    
      //create Invoice
      const newDoc: any = new Invoice()  
      newDoc.vehicles = body.vehicles;
      newDoc.bookedDates.start = body.startDate
      newDoc.bookedDates.end = body.endDate
      newDoc.fareAmount = fareData.fareAmount
      newDoc.bookedHours.nights = fareData.nights
      newDoc.bookedHours.hours = fareData.hours
      newDoc.listingId = new mongoose.Types.ObjectId(listingId)
      newDoc.providerId = listData.userId
      newDoc.userId = auth.userId
      newDoc.paymentMode = body.paymentMode
      newDoc.paymentMethod = body.paymentMethod
      newDoc.discountAmount = fareData.discountAmount
      newDoc.discountPercentage = fareData.discountPercentage
      newDoc.discountCode = fareData.discountCode
      newDoc.adults = body.adults || 0
      newDoc.children = body.children || 0
      newDoc.pets = body.pets || 0
      newDoc.perDay = fareData.perDay
      newDoc.perHour = fareData.perHour
      newDoc.extraGuest = fareData.extraGuest;
      newDoc.extraGuestAmount = fareData.extraGuestAfterAmount
      newDoc.hostAmount = fareData.hostAmount
      newDoc.commission = fareData.commissionAmount
      newDoc.tax = fareData.taxAmount
      newDoc.currency = currency
      newDoc.cancellationPolicyId = listData.cancellationPolicyId
      newDoc.currencySymbol = currencySymbol.symbol

      if (providerData.instantBooking == true && body.paymentMode == 'cash') {
        newDoc.status = 'booked'
        newDoc.paymentStatus = 'paid'
        newDoc.paidAmount = fareData.fareAmount
        newDoc.paidDate = Date.now()
        newDoc.confirmedDate = Date.now()
        const bookedData = await newDoc.save();

        const bookingResponse = await this.reserveBooking({ invoiceId: bookedData._id });
        if (!bookingResponse.status) {
            throw new CustomError.BadRequestError('FAILED_TO_RESERVE_BOOKING');
        }

        let update = {
          start: body.startDate,
          end: body.endDate,
          desc: 'bookedDates'
        }
         await ListingPricing.findOneAndUpdate(
            { listingId: new mongoose.Types.ObjectId(listingId) },
            { $push: { blockedDates: update } }
          ).lean().exec()
      } else {
        if (body.paymentMode == 'cash') {
          newDoc.status = 'pending'
          newDoc.paymentStatus = 'paid'
          newDoc.paidAmount = fareData.fareAmount
          newDoc.paidDate = Date.now()
          newDoc.confirmedDate = Date.now()
          const bookedData = await newDoc.save();

          const bookingResponse = await this.reserveBooking({ invoiceId: bookedData._id });
          if (!bookingResponse.status) {
              throw new CustomError.BadRequestError('FAILED_TO_RESERVE_BOOKING');
          }

          let update = {
            start: body.startDate,
            end: body.endDate,
            desc: 'bookedDates'
          }
          await ListingPricing.findOneAndUpdate(
            { listingId: new mongoose.Types.ObjectId(listingId) },
            { $push: { blockedDates: update } }
          ).lean().exec()

        await this.sendBookingPushNotifications({
             userFcmId: userData.fcmId,
             hostFcmId: providerData.fcmId,
             templateData: {
                userName: userData.firstname,
                listingName: listData.propertyName,
                startDate: new Date(bookingResponse.data.booking.bookedDates.start).toLocaleDateString('en-GB'),
                endDate: new Date(bookingResponse.data.booking.bookedDates.end).toLocaleDateString('en-GB'),
                fareAmount: `${bookingResponse.data.booking.currencySymbol}${fareData.fareAmount}`,
                bookingId: `${Config.bookingPrefix}${bookingResponse.data.booking.bookingNo}`,
             },
        })
        }
      
        if (body.paymentMode == 'card') {
           if(body.paymentMethod == 'razorpay') {
            razorpayOrder = await Razor.createOrder({ totalAmount: fareData.fareAmount, currency: currency });
            newDoc.paymentId = razorpayOrder.id;
            newDoc.status = 'pending';
           } else if(body.paymentMethod == 'phonepe') {
            phonepeOrder = await Phonepe.createPayment({ totalAmount: fareData.fareAmount, currency: currency, invoiceId: newDoc._id, userId: newDoc.userId, isMobile: isMobileApp });      
            newDoc.paymentId = phonepeOrder.merchantOrderId;
            newDoc.status = 'pending';
           }
           else {
            paymentIntentRes = await stripe.paymentIntent({ totalAmount: fareData.fareAmount, currency: currency})
            newDoc.paymentId = paymentIntentRes.id
            newDoc.status = 'pending'
           }
        }
      }
      
      const bookedData = await newDoc.save()
      const userInfo = await User.findById(bookedData.userId).lean().exec()
      const formattedDate = new Date(bookedData.bookedDates.start).toLocaleString()
      console.log(formattedDate)
      const notifiData = {
        forWhom: providerData._id,
        message: 'Your Listing ' + listData.propertyName + ' Booked by ' + userInfo.firstname,
        fromWhom: 'USER',
        userType: 'PROVIDER',
        title: 'listing booked',
        link: '',
        image: ''
      }
      await NotificationController.notification(notifiData)

      const responseData = body.paymentMode == 'cash' ? { invoiceId: bookedData._id, paymentMode: bookedData.paymentMode } : { payment: razorpayOrder || phonepeOrder || paymentIntentRes, invoiceId: bookedData._id };
  
      // RESPONSE
      response.message = 'BOOKING_PENDING'
      response.status = true
      response.statusCode = 200
      response.data = { booking: responseData }
    }catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly paymentStatus = async (req: AuthenticateRequest, res: Response) => {
    let response: any = {
        status: false,
        message: 'Unprocessable Entity',
        data: {},
        validation: {},
        statusCode: 500
    }

    try {
        const paymentIntentId = req.query.id;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, platform } = req.body;
        const invoiceId = req.params.invoiceId || req.body.invoiceId
        const paymentMethod = req.query.paymentMethod || req.body.paymentMethod 
        const merchant_order_id = req.query.merchant_order_id || req.body.merchant_order_id 
        
        let update: any, providerData: any, invoiceData: any, paymentData: any, userData: any, listData: any, paymentId: any;
        if(paymentMethod === 'razorpay') {
          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) throw new CustomError.BadRequestError('MISSING_RAZORPAY_DETAILS')
          paymentData = await Razor.verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
          paymentId = razorpay_order_id
        } else if(paymentMethod === 'phonepe') {
          if(!merchant_order_id) throw new CustomError.BadRequestError('MISSING_PHONEPE_DETAILS')
          console.log("Inside payment method phonepe");   
          paymentData = await Phonepe.checkStatus(merchant_order_id);
          paymentId = merchant_order_id
        }
        else {
          paymentData = await stripe.stripePaymentStatus(paymentIntentId);
          paymentId = paymentIntentId
        }
        invoiceData = await Invoice.findById(invoiceId).exec();

        if (!invoiceData) {
          throw new CustomError.BadRequestError('INVOICE_NOT_FOUND');
        }
         providerData = await User.findById(invoiceData.providerId,{ instantBooking: 1, phone: 1 }).exec();

         userData = await User.findById(req.auth?.userId || req.query.userId).exec()
         listData = await List.findById(invoiceData.listingId)
         if(!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND');

        if ( paymentData.verified || paymentData.state === 'COMPLETED' || paymentData.status === 'succeeded') {
            update = {
                status: providerData.instantBooking ? 'booked' : 'pending',
                paidDate: Date.now(),
                paidAmount: invoiceData.fareAmount,
                paymentStatus: 'paid',
                paymentId: paymentId
            };

            if (providerData.instantBooking) {
                const updateDates = {
                    start: invoiceData.bookedDates.start,
                    end: invoiceData.bookedDates.end,
                    desc: 'bookedDates'
                };

                await ListingPricing.findOneAndUpdate(
                    { listingId: new mongoose.Types.ObjectId(invoiceData.listingId) },
                    { $push: { blockedDates: updateDates } }
                ).lean().exec();
            }
        } else {
            update = {
                status: 'failed',
                failedDate: Date.now(),
                paymentStatus: 'failed',
                paymentId: paymentId
            };
            if(paymentMethod == 'phonepe' && platform != "Mobile") return res.redirect(`${Config.app.baseurl}rooms/booking/paymentStatus?status=failed`)
            
            response.message = 'PAYMENT_FAILED';
            response.data = { paymentStatus: paymentData };
            response.status = true;
            response.statusCode = 422;
        }

        const statusUpdate = await Invoice.findOneAndUpdate({ _id: invoiceId }, update, {
            new: true,
            upsert: true
        }).exec();

        if (!statusUpdate) throw new CustomError.BadRequestError('FAILED_TO_UPDATE_INVOICE');

        if (paymentData.verified || paymentData.state === 'COMPLETED' || paymentData.status === 'succeeded') {
          const booking = await Booking.findOne({ paymentId: paymentId }).exec();
          if (booking) {
                response.message = 'PAYMENT_INTENT_ALREADY_USED';
                response.data = { bookingData: booking };
                response.status = true;
                response.statusCode = 200;
                return res.status(response.statusCode).json(response).end();
          }
          const bookingResponse = await this.reserveBooking({ invoiceId });
          if (!bookingResponse.status) {
              throw new CustomError.BadRequestError('FAILED_TO_RESERVE_BOOKING');
          }
          const mailData = {
            user: userData.fullname,
            bookingId: bookingResponse.data.booking._id.toString(),
            phoneNumber: providerData.phone,
          }
          
          const otpMail = await Mail.sendMail(userData.email, mailData, 'BOOKING')
          if (!otpMail) {
            console.log('FAILED_TO_SEND_OTPMAIL');
          }
         await this.sendBookingPushNotifications({
             userFcmId: userData.fcmId,
             hostFcmId: providerData.fcmId,
             templateData: {
                userName: userData.firstname,
                listingName: listData.propertyName,
                startDate: new Date(bookingResponse.data.booking.bookedDates.start).toLocaleDateString('en-GB'),
                endDate: new Date(bookingResponse.data.booking.bookedDates.end).toLocaleDateString('en-GB'),
                fareAmount: `${bookingResponse.data.booking.currencySymbol}${bookingResponse.data.booking.paidAmount}`,
                bookingId: `${Config.bookingPrefix}${bookingResponse.data.booking.bookingNo}`,
             },
        })
          if(paymentMethod == 'phonepe' && platform != "Mobile") return res.redirect(`${Config.app.baseurl}rooms/booking/paymentStatus?status=success`)
            
          response.message = 'PAYMENT_SUCCESS';
          response.data = { ...paymentData, instantBooking: providerData.instantBooking, booking: bookingResponse.data.booking };
          response.status = true;
          response.statusCode = 200;
      }

    } catch (error) {
        console.error('Error:', error);
        response.status = false;
        response.message = error.message || 'Internal Server Error';
        response.statusCode = 500;
    }

    return res.status(response.statusCode).json(response).end();
}


  static readonly reserveBooking = async (data: { invoiceId: string }) => {
    const response: any = {
        status: false,
        message: 'Unprocessable Entity',
        data: {},
        validation: {},
        statusCode: 500
      }
    try {
      const { invoiceId } = data
      const invoiceData = await Invoice.findOne({ _id: invoiceId }).exec()
      if (!invoiceData) throw new CustomError.BadRequestError('INVOICE|NOT_FOUND')

      if (invoiceData.paymentStatus === Constants.paymentStatus.paid)
        {
            const bookingData = {
                listingId: invoiceData.listingId,
                providerId: invoiceData.providerId,
                userId: invoiceData.userId,
                adults: invoiceData.adults,
                children: invoiceData.children,
                extraGuest: invoiceData.extraGuest,
                extraGuestAmount: invoiceData.extraGuestAmount,
                pets: invoiceData.pets,
                vehicles: invoiceData.vehicles,
                bookedDates: invoiceData.bookedDates,
                bookedHours: invoiceData.bookedHours,
                perDay: invoiceData.perDay,
                perHour: invoiceData.perHour,
                currency: invoiceData.currency,
                currencySymbol: invoiceData.currencySymbol,
                paidDate: invoiceData.paidDate,
                paidAmount: invoiceData.paidAmount,
                hostAmount: invoiceData.hostAmount,
                paymentMode: invoiceData.paymentMode,
                paymentMethod: invoiceData.paymentMethod,
                status: invoiceData.status,
                paymentStatus: invoiceData.paymentStatus,
                cancellation: invoiceData.cancellation,
                cancellationPolicyId: invoiceData.cancellationPolicyId,
                refundAmount: invoiceData.refundAmount,
                refundDate: invoiceData.refundDate,
                failedDate: invoiceData.failedDate,
                confirmedDate: invoiceData.confirmedDate,
                checkOutDate: invoiceData.checkOutDate,
                paymentId: invoiceData.paymentId,
                payoutId: invoiceData.payoutId,
                fareAmount: invoiceData.fareAmount,
                commission: invoiceData.commission,
                tax: invoiceData.tax,
                commissionPercentage: invoiceData.commissionPercentage,
                discountAmount: invoiceData.discountAmount,
                discountPercentage: invoiceData.discountPercentage,
                discountCode: invoiceData.discountCode
              };

              const newBooking = new Booking(bookingData);
              await newBooking.save()
              invoiceData.bookingId = newBooking._id;
              await invoiceData.save();

              let listingPricing: any = await ListingPricing.findOne({ listingId: bookingData.listingId }).lean().exec();
              if (!listingPricing) {
                throw new CustomError.BadRequestError('LISTING_PRICING_NOT_FOUND');
              }

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

              if ((bookedData[0]?.totalBookings || 0) === listingPricing.availableCount) {
                const existBlockedDates = await ListingPricing.findOne({ listingId: listingId }).select('blockedDates').lean().exec();
                let update = {
                  start: startDate,
                  end: endDate,
                  desc: 'bookedDates'
                };
                const overlapDates = existBlockedDates.blockedDates.some(block => {
                  return (new Date(update.start) <= new Date(block.end) && new Date(update.end) >= new Date(block.start));
                });
                if(!overlapDates){
                await ListingPricing.findOneAndUpdate(
                  { listingId: listingId },
                  { $push: { blockedDates: update } }
                ).lean().exec();
              }
            }

              // RESPONSE
              response.message = 'RESERVED_BOOKING'
              response.data = { booking: newBooking }
              response.status = true
              response.statusCode = 200
        }
        else {
              response.message = 'AMOUNT_NOT_PAID';
              response.statusCode = 400;
          }
    } catch (error) {
        console.log('Error \n', error)
        response.status = false
        response.message = error.message
        response.statusCode = 500
      }
      return response
  }




 static readonly sendBookingPushNotifications = async ({ userFcmId, hostFcmId, templateData }) => {
  try {
    const notifications = []

    if (userFcmId) {
      notifications.push(
        NotificationController.createPushNotification({
          data: {
            pushToken: userFcmId,
            key: 'bookingMade',
            title: 'New Booking',
            body: 'Booking made successfully',
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
            key: 'bookingMade',
            title: 'New Booking',
            body: 'Booking made successfully',
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
  
}

export { InvoiceController }