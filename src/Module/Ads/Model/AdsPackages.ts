import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class AdsPackages extends BaseModel {
  constructor() {
    super()
  }
}

const adsPackagesSchema = new mongoose.Schema({
    packageName: { type: String, default: '' }, 
    description: { type: String, default: '' },
    price: { type: Number, default: '' }, 
    currency: { type: String, default: '' }, 
    adsLimit: { type: Number, default: 0 }, 
    validityDays: { type: Number, default: 0 }, 
    type: { type: String, enum: ["standard", "featured", "boosted"], default: "standard" }, 
    deletedAt: { type: Date, default: null }
},
{ timestamps: true }
);

adsPackagesSchema.loadClass(AdsPackages)

export default mongoose.model('adsPackages', adsPackagesSchema)