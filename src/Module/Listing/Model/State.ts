import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class State extends BaseModel {
  constructor() {
    super()
  }
}

const StateSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
    options: {
      isSearch: true
    }
  },
  code: {
    type: String,
    default: '',
    options: {
      isSearch: true
    }
  },
  country_id: { type: Schema.Types.ObjectId, ref: 'countries', default: null },
  status: {
    type: Boolean,
    default: true,
    options: {
      isSearch: true
    }
  },
  deletedAt: { type: Date, default: null }
})

StateSchema.loadClass(State)

export default mongoose.model('State', StateSchema)
