import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class ListingPricing extends BaseModel {
  constructor() {
    super()
  }
}

const blockedDates = new mongoose.Schema({
  title: { type: String, default: '' },
  start: { type: Date, default: null },
  end: { type: Date, default: null },
  desc: { type: String, default: '' }
})

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },         
  startTime: { type: String, required: true },    
  endTime: { type: String, required: true },     
  price: { type: Number, required: true }  
}, { _id: true })

const listingPricingSchema = new mongoose.Schema({
  listingId: { type: Schema.Types.ObjectId, ref: 'listings', default: null },
  availableCount: { type: Number, default: 1 },
  maxNightSelect: { type: Boolean, default: true },
  pricing: {
    perHour: { type: Number, default: 0 },
    perDay: { type: Number, default: 0 },
    baseFare: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 }, 
    discountedPrice: { type: Number, default: 0 } 
  },
  bookingType: {
    minimumNight: { type: Number, default: 1 },
    maximumNight: { type: Number, default: 90 },
    extraGuest: { type: Number, default: 0 }, //3
    extraGuestFee: { type: Number, default: 0 } //500
  },
  blockedDates: [blockedDates],
  dayPassPackages: { type: [packageSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

listingPricingSchema.loadClass(ListingPricing)

export default mongoose.model('listingPricings', listingPricingSchema)