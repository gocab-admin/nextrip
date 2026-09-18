import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Chat extends BaseModel {
  constructor() {
    super()
  }
}

const messages = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, default: null },
  message: { type: String, default: '' },
  replyId: { type: Schema.Types.ObjectId, default: null },
  type: { type: String, default: 'text', enum: ['text', 'file'] },
  status: { type: String, default: 'unseen', enum: ['seen', 'unseen'] },
  date: { type: Date, default: Date.now },
  imageDetails: { type: String, default: null },
  file_id: { type: Schema.Types.ObjectId, default: null }
})

const deliverMessages = new mongoose.Schema({
  messageId: { type: Schema.Types.ObjectId, default: null },
  userId: { type: Schema.Types.ObjectId, default: null },
  type: { type: String, default: 'text', enum: ['text', 'file'] },
  message: { type: String, default: '' },
  softdel: { type: Boolean, default: false },
  deleteAt: { type: Date, default: '' },
  date: { type: Date, default: Date.now },
  file_id: { type: Schema.Types.ObjectId, default: null },
  imageDetails: { type: String, default: null },
  status: { type: String, default: 'unseen', enum: ['seen', 'unseen'] }
})

const chatSchema = new mongoose.Schema({
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, default: null },
      // blockedBy: { type: Schema.Types.ObjectId, default: null },
      status: { type: String, default: 'offline' },
      blockStatus: { type: Boolean, default: false },
      blockedAt: Date,
      delChat: { type: Boolean, default: false },
      archived: { type: Boolean, default: false },
      unseen: { type: Number, default: 0 }
    }
  ],
  message: [messages],
  deliverMessage: [deliverMessages],
  isImportant: { type: Boolean, default: false },
  adsId: { type: Schema.Types.ObjectId, required: true },
  catId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

chatSchema.loadClass(Chat)

export default mongoose.model('chats', chatSchema)
