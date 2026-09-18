import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class AdsSubscriptions extends BaseModel {
  constructor() {
    super()
  }
}

const adsSubscriptionsSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users'},
    packageId: { type: Schema.Types.ObjectId, ref: 'adsPackages' },
    adsLimit: { type: Number, default: 0  },
    type: { type: String, default: '' }, 
    paidAmount: { type: Number, default: 0 },
    currency: { type: String, default: '' }, 
    startDate: { type: Date, default: Date.now }, 
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
    paymentId: { type: String, default: '' },
    paymentStatus: { type: String, default: 'pending', enum: ['paid','failed', 'pending'] },
    deletedAt: { type: Date, default: null }
},
{ timestamps: true }
);

adsSubscriptionsSchema.loadClass(AdsSubscriptions)

export default mongoose.model('adsSubscriptions', adsSubscriptionsSchema)