import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class WishList extends BaseModel {
  constructor() {
    super()
  }
}

const wishListSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', default: null },
  collectionName: { type: String, default: '' },
  collectionData: [Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

wishListSchema.loadClass(WishList)

export default mongoose.model('wishLists', wishListSchema)