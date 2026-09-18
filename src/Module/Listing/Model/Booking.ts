import mongoose, { Schema } from 'mongoose'
import AutoIncrement from '@abserve/Utils/AutoIncrement'
import { BaseModel } from '@abserve/Module/BaseModel'
AutoIncrement.initialize(mongoose)

class Booking extends BaseModel {
  constructor() {
    super()
  }
}

const bookingSchema = new mongoose.Schema({
  bookingNo: { type: Number },
  listingId: { type: Schema.Types.ObjectId, ref: 'listings', default: null },
  providerId: { type: Schema.Types.ObjectId, ref: 'providers', default: null },
  userId: { type: Schema.Types.ObjectId, ref: 'users', default: null },
  vehicles: [
    {
      vehicleNumber: { type: String, required: true },
      vehicleModel: { type: String, default: '' },
      vehicleBrand: { type: String, default: '' },
      vehicleColor: { type: String, default: '' },
      vehicleType: {
        type: String,
        enum: ['car', 'bike', 'suv', 'van', 'truck', 'other'],
        default: 'car'
      }
    }
  ],
  adults: { type: Number, default: 0 },
  children: { type: Number, default: 0 },
  extraGuest: { type: Number, default: 0 },
  extraGuestAmount: { type: Number, default: 0 },
  pets: { type: Number, default: 0 },
  bookedDates: {
    start: { type: Date, default: null },
    end: { type: Date, default: null }
  },
  bookedHours: {
    nights: { type: Number, default: 0 },
    hours: { type: Number, default: 0 }
  },
  perDay: { type: Number, default: 0 },
  perHour: { type: Number, default: 0 },
  currency: { type: String, default: '' },
  currencySymbol: { type: String, default: '' },
  paidDate: { type: Date, default: '' },
  paidAmount: { type: Number, default: 0 },
  hostAmount: { type: Number, default: 0 },
  paymentMode: { type: String, default: 'cash', enum: ['card', 'cash'] },
  paymentMethod: { type: String, default: ''},
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'booked', 'checkOut', 'cancelled', 'failed', 'refund']
  },
  paymentStatus: { type: String, default: 'pending', enum: ['paid', 'refund', 'failed', 'pending'] },
  cancellationPolicyId: { type: Number },
  cancellation: {
    Reason: { type: String, default: '' },
    cancledBy: { type: String, default: '' },
    cancleDate: Date
  },
  refundAmount: { type: Number, default: 0 },
  refundDate: Date,
  failedDate: Date,
  confirmedDate: Date,
  checkOutDate: Date,
  paymentId: { type: String, default: '' },
  payoutId: { type: String, default: '' },
  payoutDone: { type: Boolean, default: false },
  fareAmount: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  commissionPercentage: { type: Number, default: 0 }, //Admin Commision percentage
  discountAmount: { type: Number, default: 0 },
  discountPercentage: { type: Number, default: 0 },
  discountCode: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

bookingSchema.plugin(AutoIncrement.plugin, {
  model: 'bookings',
  field: 'bookingNo',
  startAt: 1000,
  incrementBy: 1
})

bookingSchema.loadClass(Booking)

export default mongoose.model('bookings', bookingSchema)
