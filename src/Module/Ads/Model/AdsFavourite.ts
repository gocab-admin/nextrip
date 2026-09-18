import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class AdsFavourite extends BaseModel {
  constructor() {
    super()
  }
}

const advertisementFavouriteSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', default: null },
  favData: { type: Schema.Types.ObjectId, ref: 'advertisement', default: null },
  createdAt: { type: Date, default: Date.now },
  softdel: { type: Boolean, default: false }
})

advertisementFavouriteSchema.loadClass(AdsFavourite)

export default mongoose.model('adsFavourite', advertisementFavouriteSchema)