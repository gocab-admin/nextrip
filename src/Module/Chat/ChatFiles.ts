import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class ChatFile extends BaseModel {
  constructor() {
    super()
  }
}

const chatFileSchema = new mongoose.Schema({
  user_id: { type: String },
  chatId: { type: String },
  type: { type: String },
  details: { type: String },
  property: {
    size: Number,
    filename: String,
    fileType: String,
    convertedSize: String,
    length: String
  },
  status: { type: String, enum: ['available', 'deleted', 'uploaded'] },
  groupId: { type: mongoose.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

chatFileSchema.loadClass(ChatFile)

export default mongoose.model('chat_files', chatFileSchema)