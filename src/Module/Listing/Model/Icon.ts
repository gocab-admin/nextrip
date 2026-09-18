import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Icon extends BaseModel {
  constructor() {
    super()
  }
}

const iconSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  icon: { type: String, default: '' },
  publicId: { type: String, default: '' },
  label: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

iconSchema.loadClass(Icon)

export default mongoose.model('icon', iconSchema)