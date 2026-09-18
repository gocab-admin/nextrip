import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { BaseController } from '@abserve/Module/BaseControllers'
import { Response } from 'express'
import { EncryptDecrypt } from '@abserve/Helper/EncryptDecrypt'
import { Config } from '@abserve/Config/AppConfig'
import User from '@abserve/Module/Auth/Model/User'
import Booking from '@abserve/Module/Listing/Model/Booking'
import ListingPricing from '@abserve/Module/Listing/Model/ListingPricing'
import Listings from '@abserve/Module/Listing/Model/Listings'
import CustomError from '@abserve/errors/index'
import ical from 'ical-generator'

class IcalController extends BaseController {
    constructor() {
        super()
    }

    static readonly getBookings = (event: any, hostData: any) => {
        return {
            _id: event._id,
            start: event.bookedDates.start,
            end: event.bookedDates.end,
            summary: `Booking Confirmation for ${event.bookingNo} | Check-in: ${event.bookedDates.start.toLocaleDateString()} | Check-out: ${event.bookedDates.end.toLocaleDateString()}`,
            categories:[{ name: "Booking" }],
            description: `
            Your booking with NO ${event.bookingNo} is confirmed!
        
                **Check-in Date**: ${event.bookedDates.start.toLocaleDateString()}
                **Check-out Date**: ${event.bookedDates.end.toLocaleDateString()}
                **Number of Guests**: ${event.adults + event.children + event.extraGuest} guest(s) 

                **Provider Name**: ${hostData.fullname}
                **Provider Contact**: ${hostData.email}
            
            
                **Special Instructions**:
                - If you have any special requests or need assistance, do not hesitate to reach out to your provider.

            Thank you for choosing us for your stay! We look forward to welcoming you.`,
        }
    }


    static readonly getBlockedDates = (blockedDate: any) => {
        return {
            _id: blockedDate._id,
            start: blockedDate.start,
            end: blockedDate.end,
            summary: `Blocked Dates: ${blockedDate.title || 'Unavailable'}`,
            categories:[{ name: "Blocked" }],
            description: blockedDate.desc || 'This period is blocked and unavailable for booking'
        }
    }


    static readonly generateSecretCode = async (req: AuthenticateRequest, res: Response) => {
        const response = {
            status: false,
            data: {},
            message: 'Unprocessable Entity',
            statusCode: 500
        };
        try {
            const { userId } = req.auth
            const encrypted = await EncryptDecrypt.encrypt(userId, Config.auth.cipherKey)


            // RESPONSE
            response.status = true
            response.statusCode = 200
            response.message = 'SECRETCODE_GENERATED'
            response.data = encrypted
        } catch (error) {
            console.error('Error:', error);
            response.status = false;
            response.message = error.message || response.message;
            response.statusCode = error.statusCode || response.statusCode;
        }
        return res.status(response.statusCode || 500).json(response).end();
    }


    static readonly downloadIcal = async (req: AuthenticateRequest, res: Response) => {
        try {
            const { userId, secretCode } = req.params
            const decryptedUserId = await EncryptDecrypt.decrypt(secretCode, Config.auth.cipherKey)
            if (decryptedUserId !== userId) throw new CustomError.UnAuthorizedError('UNAUTHORIZED_ACCESS');

            const hostData = await User.findOne({ _id: userId, softdel: false });
            if (!hostData) throw new CustomError.BadRequestError('USER_NOT_FOUND');

            // Calculate one month past & 3 months future
            const today = new Date()

            const pastMonth = new Date(today)
            pastMonth.setMonth(pastMonth.getMonth() - 1)

            const futureMonths = new Date(today)
            futureMonths.setMonth(futureMonths.getMonth() + 3)

            // Fetch all events for this user
            const events: any = await Booking.find({
                providerId: userId,
                status: { $ne: 'cancelled' },
                $or: [
                    {
                        "bookedDates.start": { $gte: pastMonth, $lte: futureMonths }
                    },
                    {
                        "bookedDates.end": { $gte: pastMonth, $lte: futureMonths }
                    }
                ]
            });

            const listings = await Listings.find({ userId: userId, status: { $eq: 'approve' }, softdel: false })
            const listingIds = listings.map((listingId: any) => listingId._id)

            // Fetch all blocked dates
            const dates = await ListingPricing.find({
                listingId: { $in: listingIds },
                'blockedDates.start': { $lte: futureMonths },
                'blockedDates.end': { $gte: pastMonth }
            })

            // Create an ical file with all events
            const calendar: any = ical({ name: `${hostData.fullname}'s Events` });
            
            events.forEach((event: any) => {
                calendar.createEvent(this.getBookings(event, hostData))
            });

            dates.forEach((blocked: any) => {
                blocked.blockedDates.forEach((blockedDate: any) => {
                    if (blockedDate.start >= pastMonth && blockedDate.end <= futureMonths) {
                        calendar.createEvent(this.getBlockedDates(blockedDate))
                    }
                })
            })

            res.setHeader("Content-Disposition", `attachment; filename=${hostData.fullname}-events.ics`)
            res.setHeader("Content-Type", "text/calendar")
            res.send(calendar.toString())
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                message: error.message || 'Unprocessable Entity',
                statusCode: error.statusCode || 500
            });
        }
    }


    static readonly getCalendar = async (req: AuthenticateRequest, res: Response) => {
        const response = {
            status: false,
            message: 'Unprocessable Entity',
            statusCode: 422,
            data: {}
        }
        try {
            const { userId } = req.auth
            const { start, end }: any = req.query
            const startDate = start ? new Date(start) : null
            const endDate = end ? new Date(end) : null
            let records: any = []

            const hostData = await User.findOne({ _id: userId, softdel: false });
            if (!hostData) throw new CustomError.BadRequestError('USER_NOT_FOUND');

            // Calculate one month past & 3 months future
            const today = new Date()

            const pastMonth = new Date(today)
            pastMonth.setMonth(pastMonth.getMonth() - 1)

            const futureMonths = new Date(today)
            futureMonths.setMonth(futureMonths.getMonth() + 3)

            const bookings: any = await Booking.find({
                providerId: userId,
                status: { $ne: 'cancelled' },
                $or: [
                    {
                        "bookedDates.start": { $gte: pastMonth, $lte: futureMonths }
                    },
                    {
                        "bookedDates.end": { $gte: pastMonth, $lte: futureMonths }
                    }
                ]
            });

            const listings = await Listings.find({ userId: userId, status: { $eq: 'approve' }, softdel: false })
            const listingIds = listings.map((listingId) => listingId._id)

            // Fetch all blocked dates
            const dates = await ListingPricing.find({
                listingId: { $in: listingIds },
                'blockedDates.start': { $lte: futureMonths },
                'blockedDates.end': { $gte: pastMonth }
            })

            bookings.forEach((event: any) => {
                records.push(this.getBookings(event, hostData))
            });

            dates.forEach((blocked: any) => {
                blocked.blockedDates.forEach((blockedDate: any) => {
                    if (blockedDate.start >= pastMonth && blockedDate.end <= futureMonths) {
                        records.push(this.getBlockedDates(blockedDate))
                    }
                })
            })

            if (startDate && endDate) {
                records = records.filter((record: any) => {
                    const startRecords = new Date(record.start)
                    const endRecords = new Date(record.end)
                    return startRecords >= startDate && endRecords <= endDate
                })
            }


            // RESPONSE
            response.status = true
            response.statusCode = 200
            response.data = records
            response.message = "CALENDAR_FETCHED"
        } catch (error) {
            console.error('Error:', error);
            response.status = false;
            response.message = error.message || response.message;
            response.statusCode = error.statusCode || response.statusCode;
        }
        return res.status(response.statusCode || 500).json(response).end();
    }
}

export { IcalController }