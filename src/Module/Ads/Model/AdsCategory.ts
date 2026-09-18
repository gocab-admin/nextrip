import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class AdsCategory extends BaseModel {
  constructor() {
    super()
  }
}

const categorySchema = new mongoose.Schema({
  category: { type: String, default: '' },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  isAll: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

categorySchema.loadClass(AdsCategory)

export default mongoose.model('adsCategory', categorySchema)