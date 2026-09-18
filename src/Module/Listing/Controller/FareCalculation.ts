import moment from 'moment'
import mongoose from 'mongoose'
import List from '@abserve/Module/Listing/Model/Listings'
import ListingPricing from '@abserve/Module/Listing/Model/ListingPricing'
import Offers from '@abserve/Module/Listing/Model/Offers'
import Comision from '@abserve/Module/Listing/Model/Commission'
import CustomError from '@abserve/errors/index'
import Booking from '@abserve/Module/Listing/Model/Booking'
import { Config } from '@abserve/Config/AppConfig'
import { BaseController } from '@abserve/Module/BaseControllers'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'

class FareCalculationController extends BaseController {
  constructor() {
    super()
  }
  static readonly calcCommissionAndTax = async function (comm: any) {
      try {
                
        const commData = await Comision.findOne({ $or: [{ userId: comm.userId }, { listingId: comm.listingId }], status: 'active' }).lean().exec()
        const commissionPercentage = Number(commData ? commData.commission : Config.commission) || 0
        const tax = Number(commData ? commData.tax : Config.tax) || 0

        // Commission & Tax
        const commission = await helper.fixedNum(comm.fareAmount * (commissionPercentage / 100))
        const taxAmount = await helper.fixedNum(comm.fareAmount * (tax / 100))

        //Amount to host
        const hostAmount = await helper.fixedNum(comm.fareAmount - commission /* + taxAmount */)
        const fareAmount = await helper.fixedNum(comm.fareAmount + taxAmount)
        const totalAmountBeforeTax = await helper.fixedNum(comm.fareAmount)

        return {
          hostAmount,
          commission,
          commissionPercentage,
          tax,
          taxAmount,
          fareAmount,
          totalAmountBeforeTax
        }
      } catch (error) {
         throw new Error(error)
      }
  }


  static readonly calcdiscount = async function (data) {
      try {
        let discountData, discountValue: number, datas
        let endOfTheDay = moment().endOf('day').format('yyyy-MM-DD' + 'T' + 'HH:mm:ss').toString()
        let startOfTheDay = moment().startOf('day').format('yyyy-MM-DD' + 'T' + 'HH:mm:ss').toString()

        discountData = await Offers.findOne({ code: data.discountCode }).lean().exec()
        if (!discountData) {
          throw new CustomError.BadRequestError('DISCOUNT_CODE_NOT_FOUND')
        }

        if (new Date(startOfTheDay) < new Date(discountData.startDate) || new Date(endOfTheDay) > new Date(discountData.endDate)) {
          throw new CustomError.BadRequestError('DISCOUNT_CODE_EXPIRED')
        }

        discountValue = discountData.percentage / 100
        discountValue = data.fareAmount * discountValue
        datas = {
          discountAmount: discountValue,
          code: discountData.code,
          percentage: discountData.percentage
        }
        return datas
      } catch (error) {
        throw new Error(error)
      }
  }


  static readonly estimation = async function (estimateData: any) {
      try {
        const data = estimateData.est
        const listingId = estimateData.listingId
  
        // Fetching listing data
        const listData = await List.findById(listingId).lean().exec()
        if (!listData)
          throw new CustomError.BadRequestError('LISTING_NOT_FOUND')
  
  
        // Fetching pricing data
        const priceData = await ListingPricing.findOne({ listingId: listingId }).lean().exec()
        if (!priceData) 
          throw new CustomError.BadRequestError('LISTING_NOT_CONFIGURED')
  
        const checkInDate = new Date(data.startDate)
        checkInDate.setHours(checkInDate.getHours() + 5)
        checkInDate.setMinutes(checkInDate.getMinutes() + 30)
        let checkIn = checkInDate.toISOString()
        console.log(checkIn)
  
        const checkOutDate = new Date(data.endDate)
        checkOutDate.setHours(checkOutDate.getHours() + 5)
        checkOutDate.setMinutes(checkOutDate.getMinutes() + 30)
        let checkOut = checkOutDate.toISOString()
        console.log(checkOut)
  
        
        const startDate = moment(data.startDate, 'YYYY-MM-DD HH:mm')
        const endDate = moment(data.endDate, 'YYYY-MM-DD HH:mm')
        const duration = moment.duration(endDate.diff(startDate))
        const Days = Math.floor(duration.asDays())
        const hours = duration.hours()
        // const totalHours = Days * 24 + hours
  
        // Calculating the total number of guests
        const guest = Number(data.adults || 0) + Number(data.children || 0) /* + Number(data.pets || 0); */
        // let pet = Number(data.pets || 0) * 400;
  
        // Extracting pricing details
        const minimumNight = priceData['bookingType']['minimumNight']
        const maximumNight = priceData['bookingType']['maximumNight']
        const hourlyCharge = priceData['pricing']['perHour']
        const extraGuestAfter = priceData['bookingType']['extraGuest'] // 3
        const extraGuestFee = priceData['bookingType']['extraGuestFee'] // 500
        //const dayCharge = priceData['pricing']['perDay']
        const originalDayCharge = priceData.pricing.perDay
        const discountedDayCharge = priceData.pricing.discountedPrice
        const dayCharge = discountedDayCharge > 0 ? discountedDayCharge : originalDayCharge

  
        // Additional guest charge
        const extraGuestCount = guest - extraGuestAfter // 1 - 2 = -1
        const final = guest > extraGuestAfter ? extraGuestCount * extraGuestFee : 0
    
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
                    { 'bookedDates.start': { $lte: new Date(data.endDate), $gte: new Date(data.startDate) } },
                    { 'bookedDates.end': { $lte: new Date(data.endDate), $gte: new Date(data.startDate) } }
                  ]
                },
                {
                  $or: [
                    { 'bookedDates.start': { $lte: new Date(data.startDate), $gte: new Date(data.endDate) } },
                    { 'bookedDates.end': { $gte: new Date(data.endDate), $lte: new Date(data.startDate) } }
                  ]
                },
  /*                   {
                  $and: [
                    {'bookedDates.start': { $gte: new Date(data.startDate)}},
                    {'bookedDates.end': { $gte: new Date(data.endDate)}}
                  ]
                },
                {
                  $and: [
                    {'bookedDates.start': { $lte: new Date(data.startDate)}},
                    {'bookedDates.end': { $lte: new Date(data.endDate)}}
                  ]
                } */
              ]
            }
          },
          {
            $count: 'totalBookings'
          }
        ]);
        if(bookedData && bookedData.length > 0 && bookedData[0].totalBookings && priceData.availableCount <= bookedData[0].totalBookings)
          throw new CustomError.BadRequestError('BOOKING_LIMIT_EXCEED')
  
        // Check date availability
        let availableDate = await ListingPricing.aggregate([
          { $match: { listingId: new mongoose.Types.ObjectId(listingId) } },
          { $unwind: '$blockedDates' },
          {
            $match: {
              $or: [
                {
                  $or: [
                    {
                      $and: [
                        { 'blockedDates.start': { $lte: new Date(data.startDate) } },
                        { 'blockedDates.end': { $gte: new Date(data.startDate) } }
                      ]
                    },
                    {
                      $and: [
                        { 'blockedDates.start': { $lte: new Date(data.endDate) } },
                        { 'blockedDates.end': { $gte: new Date(data.endDate) } }
                      ]
                    }
                  ]
                },
                {
                  $and: [
                    {
                      $and: [
                        { 'blockedDates.start': { $gte: new Date(data.startDate) } },
                        { 'blockedDates.end': { $gte: new Date(data.startDate) } }
                      ]
                    },
                    {
                      $and: [
                        { 'blockedDates.start': { $lte: new Date(data.endDate) } },
                        { 'blockedDates.end': { $lte: new Date(data.endDate) } }
                      ]
                    }
                  ]
                }
              ]
            }
          },    
        ])
        if (availableDate.length != 0) throw new CustomError.BadRequestError('DATES_NOT_AVAILABLE')
  
        // Validating guest count
        if (Number(listData.guest.adult) > 0) {
          if (data.adults > listData.guest.adult)
            throw new CustomError.BadRequestError('Adult count should be maximum ' + listData.guest.adult)
          if (data.children > listData.guest.children)
            throw new CustomError.BadRequestError('Children count should be maximum ' + listData.guest.children)
          if (data.pets > listData.guest.pets)
            throw new CustomError.BadRequestError('Pets count should be maximum ' + listData.guest.pets)
        }
  
        if (data.bookingType == 'Day') {
          // Validating minimum night
          if (minimumNight > Days)
            throw new CustomError.BadRequestError('Booking should be minimum ' + minimumNight + ' Nights')
  
          // Validating maximum night
          if (maximumNight < Days)
            throw new CustomError.BadRequestError('Booking should be maximum ' + maximumNight + ' Nights')
        }
  
        //fare calculation
        const daysFee = Days * (dayCharge + final)
        let hoursFee = 0
        if (data.bookingType == 'Hour') {
          const pinFromDate = startDate.format('dddd')
          const pinToDate = endDate.format('dddd')
  
          let checkInUnix = await helper.getTime(moment.utc(data.startDate).format('hh:mm A'))
          let checkOutUnix = await helper.getTime(moment.utc(data.endDate).format('hh:mm A'))    
  
          const pinFromIndex = listData.schedule.findIndex((i) => i.day == pinFromDate)
          const pinToIndex = listData.schedule.findIndex((i) => i.day == pinToDate)
          if (pinFromIndex != -1) {
            const pinFromUnix = await helper.getTime(listData.schedule[pinFromIndex].openingTime)
            if (pinFromUnix > checkInUnix) throw new CustomError.BadRequestError('Check in time not valid')
          }
  
          if (pinToIndex != -1) {
            const pinToUnix = await helper.getTime(listData.schedule[pinToIndex].closingTime)
            if (pinToUnix < checkOutUnix) throw new CustomError.BadRequestError('Check out time not valid')
          }
          hoursFee = hourlyCharge * hours
        }
        let fareAmount = daysFee + hoursFee;

        // Calculating commission & tax
        const calcComAndTax = await this.calcCommissionAndTax({ fareAmount, userId: listData.userId, listingId: listData._id })
        const hostAmount = await helper.fixedNum(calcComAndTax.hostAmount)
        fareAmount = await helper.fixedNum(calcComAndTax.fareAmount)
  
        // Applying discount if applicable discount
        let discountData = null
        if (data.discountCode) {
          discountData = await this.calcdiscount({
            fareAmount: fareAmount,
            discountCode: data.discountCode
          })
          fareAmount = await helper.fixedNum(fareAmount - discountData.discountAmount)
        }
  
        console.log('hourlyCharge', hourlyCharge, '\ndayCharge', dayCharge + final, '\nDays', Days, /* "\nhours", hours, */ '\nhostAmount', hostAmount, '\nfareAmount', fareAmount)
  
        // Final data obj
        return {
          listingId: listingId,
          bookingType: data.bookingType,
          nights: Days,
          hours: hours,
          startDate: data.startDate,
          endDate: data.endDate,
          Adult: data.adults,
          Children: data.children,
          Pets: data.pets,
          perHour: priceData.pricing.perHour,
          perDay: priceData.pricing.perDay + final /* + pet */,
          discountPercentage: priceData.pricing.discountPercentage,
          discountedPrice: priceData.pricing.discountedPrice,
          extraGuest: extraGuestCount > 0 ? extraGuestCount : 0,
          extraGuestAfterAmount: final,
          taxAmount: calcComAndTax.taxAmount,
          taxPercentage: calcComAndTax.tax,
          commissionAmount: calcComAndTax.commission,
          commissionPercentage: calcComAndTax.commissionPercentage,
          fareAmount: fareAmount,
          dayFare: Days * (dayCharge + final),
          hourFare: hourlyCharge * hours,
          totalAmountBeforeTax: calcComAndTax.totalAmountBeforeTax,
          hostAmount: hostAmount,
          discountData: discountData
        }
      } catch (error) {
        throw error
      }
  }
}

export { FareCalculationController }