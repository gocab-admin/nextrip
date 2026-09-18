import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class MailTemplate extends BaseModel {
  constructor() {
    super()
  }
}

const MailTemplateSchema = new mongoose.Schema({
    subject: { type: String, default: '' },
    description: { type: String, default: '' },
    body: { type: String, default: '' },
    softDel: { type: Boolean, default: false }
  }, { timestamps: true }
)

MailTemplateSchema.loadClass(MailTemplate)

export default mongoose.model('mailTemplate', MailTemplateSchema)
