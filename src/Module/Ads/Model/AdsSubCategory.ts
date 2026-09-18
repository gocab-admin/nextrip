import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class AdsSubCategory extends BaseModel {
  constructor() {
    super()
  }
}

const subCategorySchema = new mongoose.Schema({
  categoryId: { type: Schema.Types.ObjectId, ref: 'adsCategory', default: null },
  subCategory: { type: String, default: '' },
  desc: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

subCategorySchema.loadClass(AdsSubCategory)

export default mongoose.model('adsSubCategory', subCategorySchema)