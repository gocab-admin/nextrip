import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Listing extends BaseModel {
  constructor() {
    super()
  }
}
const bedtypeSchema = new mongoose.Schema({
  bedRoom: { type: String, default: '' },
  bedType: { type: String, default: '' },
  bedCount: { type: Number, default: 0 }
})

const reviewsRatingSchema = new mongoose.Schema({
  review: { type: String, default: '' },
  rating: {
    Cleanliness: { type: Number, default: 0 },
    Accuracy: { type: Number, default: 0 },
    Communication: { type: Number, default: 0 },
    Location: { type: Number, default: 0 },
    Check_in: { type: Number, default: 0 },
    Value: { type: Number, default: 0 }
  },
  userId: { type: Schema.Types.ObjectId },
  bookingId: { type: Schema.Types.ObjectId, required: true },
  isReviewed : { type: Boolean, default: false},
  reply: [
    {
      userId: { type: Schema.Types.ObjectId },
      userType: { type: String, default: '' },
      response: { type: String, default: '' },
      dateOfReview: { type: Date, default: Date.now }
    }
  ],
  dateOfReview: { type: Date, default: Date.now }
})

const scheduleSchema=new mongoose.Schema({
  day: { type: String },
  openingTime: { type: String },
  closingTime: { type: String },
  isToday: { type: Boolean, default: false },
}, { strict: true, _id: false })


const slotSchema = new mongoose.Schema(
{
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true }  
},
{ _id: false }
)

const weeklyScheduleSchema = new mongoose.Schema(
{
  day: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ]
  },

  slots: [slotSchema]

},
{ _id: false }
)


const dateOverrideSchema = new mongoose.Schema(
{
  date: { type: String, required: true }, 

  isUnavailable: {
    type: Boolean,
    default: false
  },

  blockedSlots: [
    {
      startTime: String,
      endTime: String
    }
  ]
},
{ _id: false }
)


const listingSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, default: null },
    propertyCategory: { type: Schema.Types.ObjectId, ref: 'propertyCategories', default: null },
    propertyType: { type: Schema.Types.ObjectId, ref: 'properties', default: null },
    propertyName: { type: String, default: '' },
    propertyDesc: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approve', 'decline', 'publish'], default: 'pending' },
    events: [
      {
        title: { type: String, default: '' },
        desc: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now }
      }
    ],
    address: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zipcode: { type: String, default: '' },
      address: { type: String, default: '' },
      landmark: { type: String, default: '' },
      location: { type: String, default: '' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    location: { type: [Number], index: '2dsphere', default: [0, 0] },
    guest: {
      adult: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      pets: { type: Number, default: 0 }
    },
    availability: { type: Boolean, default: true },
    accomodation: {
      bedRoomCount: { type: Number, default: 1 },
      bedRoomBedtype: [bedtypeSchema],
      bathRoom: {
        bathRoomCount: { type: Number, default: 0 },
        shared: { type: Boolean, default: false }
      }
    },
    reviewRating: [reviewsRatingSchema],
    schedule: { type: [scheduleSchema], default: [] },
    weeklySchedule: {
       type: [weeklyScheduleSchema],
       default: []
    },
    dateOverrides: {
       type: [dateOverrideSchema],
       default: []
    },
    totalCleanlinessRate: { type: Number, default: 0 },
    totalAccuracyRate: { type: Number, default: 0 },
    totalCommunicationRate: { type: Number, default: 0 },
    totalLocationRate: { type: Number, default: 0 },
    totalValueRate: { type: Number, default: 0 },
    totalCheckInRate: { type: Number, default: 0 },
    totalRatingCount: { type: Number, default: 0 },
    totalReviewCount: { type: Number, default: 0 },
    cancellationPolicyId: { type: Number, default: 3 },
    placesToOffer: [
      {
        name: { type: String, default: '' },
        desc: { type: String, default: '' },
        Image: { type: String, default: '' }
      }
    ],
    progress: { type: String, default: '' },
    softdel: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

listingSchema.index({ location: '2dsphere' })
listingSchema.loadClass(Listing)

export default mongoose.model('listings', listingSchema)
