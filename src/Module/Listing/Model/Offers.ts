import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Offer extends BaseModel {
  constructor() {
    super()
  }
}

const offerSchema = new mongoose.Schema({
  title: String,
  desc: String,
  code: { type: String, default: '' },
  percentage: { type: Number, default: 0 },
  file: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

offerSchema.loadClass(Offer)

export default mongoose.model('offers', offerSchema)