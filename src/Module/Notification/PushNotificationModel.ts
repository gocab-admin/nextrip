import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class PushNotifications extends BaseModel {
  constructor() {
    super()
  }
}

const pushNotificationSchema = new mongoose.Schema({
  key: { type: String, default: '' },
  title: { type: String, default: '' },
  body: { type: String, default: '' },
  softdel: { type: Boolean, default: false },
}, { timestamps: true });

pushNotificationSchema.loadClass(PushNotifications)

export default mongoose.model('PushNotifications', pushNotificationSchema)