import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Messages extends BaseModel {
  constructor() {
    super()
  }
}

const messagesSchema = new mongoose.Schema({
  file: [
    {
      location: String,
      format: String
    }
  ],
  parentMessageId: { type: mongoose.Types.ObjectId, default: '' },
  status: { type: String, enum: ['DELETED', 'ARCHIVED', 'RECEIVED'], default: 'RECEIVED' },
  messageContent: { type: String, default: '' },
  title: { type: String, default: '' },
  senderRole: { type: String, enum: ['ADMIN', 'PROVIDER', 'USER'] },
  sender: { type: mongoose.Types.ObjectId }, // sender (from)
  receiver: { type: mongoose.Types.ObjectId }, //receiver (to)
  scheduleTime: { type: Date, default: Date.now },
  archeivedBy: [mongoose.Types.ObjectId], //two or more people will archeive a message so, we should keep this field as a array
  deletedBy: [mongoose.Types.ObjectId], //two or more people will delete a message so, we should keep this field as a array
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
})

messagesSchema.loadClass(Messages)

export default mongoose.model('Messages', messagesSchema)