import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Language extends BaseModel {
  constructor() {
    super()
  }
}

const LanguageSchema = new mongoose.Schema({
    name: {
      type: String,
      options: {
        isSearch: true
      }
    },
    indexName: {
      type: String,
      options: {
        isSearch: true
      }
    },
    default: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false,
      options: {
        isSearch: true
      }
    },
    file: {
      type: String,
      default: ''
    },
    softDel: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  }, { timestamps: true }
)

LanguageSchema.loadClass(Language)

export default mongoose.model('Language', LanguageSchema)
