import { BaseModel } from '../../BaseModel'
import mongoose from 'mongoose'

class Language extends BaseModel {
  constructor() {
    super()
  }
}

const LanguageSchema = new mongoose.Schema({
    Language: { type: String, default: '' }
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

LanguageSchema.loadClass(Language)

export default mongoose.model('languages', LanguageSchema)
