import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class City extends BaseModel {
  constructor() {
    super()
  }
}

const CitySchema = new mongoose.Schema({
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
  state_id: { type: Schema.Types.ObjectId, ref: 'States', default: null },
  latitude: { type: Number, default: 0.0 },
  longitude: { type: Number, default: 0.0 },
  status: {
    type: Boolean,
    default: true,
    options: {
      isSearch: true
    }
  },
  deletedAt: { type: Date, default: null }
})

CitySchema.loadClass(City)

export default mongoose.model('City', CitySchema)
