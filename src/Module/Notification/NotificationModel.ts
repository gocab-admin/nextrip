import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Notifications extends BaseModel {
  constructor() {
    super()
  }
}

const notificationSchema = new mongoose.Schema({
  image: { type: String, default: '' },
  title: { type: String, default: '' },
  link: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'sent', 'seen'], default: 'pending' },
  markAsRead:  { type: Boolean, default: false },
  fromWhom: { type: String, default: '' },
  forWhom: { type: mongoose.Schema.Types.ObjectId, default: '' },
  userType: { type: String, default: '' },
  message: { type: String, default: '' },
  upDatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  softdel: { type: Boolean, default: false }
})

notificationSchema.loadClass(Notifications)

export default mongoose.model('Notifications', notificationSchema)