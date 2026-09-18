import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Category extends BaseModel {
  constructor() {
    super()
  }
}

const categorySchema = new mongoose.Schema({
  category: { type: String, default: '' },
  icon: { type: String, default: '' },
  publicId: { type: String, default: '' },
  image: { type: String, default: '' },
  isAll: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

categorySchema.loadClass(Category)

export default mongoose.model('propertyCategories', categorySchema)