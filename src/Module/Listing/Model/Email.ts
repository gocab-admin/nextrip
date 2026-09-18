import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Email extends BaseModel {
  constructor() {
    super()
  }
}

const EmailSchema = new mongoose.Schema({
  subject: String,
  description: String,
  body: String,
  status: String,
  header: String,
  language: { type: String, default: 'en' }, //en/es
  createdAt: { type: Date, default: Date.now }
})

EmailSchema.loadClass(Email)

export default mongoose.model('Email', EmailSchema)