import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class PrivilegeCategories extends BaseModel {
  constructor() {
    super()
  }
}

const privilegeCategoriesSchema = new mongoose.Schema(
  {
     privilegeId: { type: Schema.Types.ObjectId, ref: 'privileges', default: null },
     name: { type: String, default: '' },
     description: { type: String, default: '' },
     deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

privilegeCategoriesSchema.loadClass(PrivilegeCategories)

export default mongoose.model('privilegeCategories', privilegeCategoriesSchema)
