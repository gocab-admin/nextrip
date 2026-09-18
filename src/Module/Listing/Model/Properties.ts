import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Property extends BaseModel {
  constructor() {
    super()
  }
}

const propertySchema = new mongoose.Schema({
  categoryId: { type: Schema.Types.ObjectId, ref: 'categories', default: null },
  property: { type: String, default: '' },
  icon: { type: String, default: '' },
  publicId: { type: String, default: '' },
  desc: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

propertySchema.loadClass(Property)

export default mongoose.model('properties', propertySchema)