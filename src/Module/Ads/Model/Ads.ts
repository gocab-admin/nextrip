import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Advertisement extends BaseModel {
  constructor() {
    super()
  }
}

const advertisementSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, default: null },
    category: { type: Schema.Types.ObjectId, ref: 'adsCategory', default: null },
    subCategory: { type: Schema.Types.ObjectId, ref: 'adsSubCategory', default: null },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'adsSubscriptions', default: null },
    name: { type: String, default: '' },
    desc: { type: String, default: '' },
    price: { type: Number, default: 0 },
    image: {
      coverImageId: { type: Schema.Types.ObjectId, default: null },
      coverImage: { type: String, default: '' }, 
      groupImage: [{ imagePath: { type: String }, groupImageId: { type: Schema.Types.ObjectId, default: null } }] 
    },
    status: { type: String, enum: ['pending', 'approve', 'decline', 'publish', 'expired' , 'sold'], default: 'pending' },
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
    softdel: { type: Boolean, default: false },
    approvedAt: { type: Date, default: null },
    inactiveAt: { type: Date, default: null },
    progressPercentage: { type: Number, default: 0 },
    isFreeAd: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

advertisementSchema.index({ location: '2dsphere' })
advertisementSchema.loadClass(Advertisement)

export default mongoose.model('advertisement', advertisementSchema)
