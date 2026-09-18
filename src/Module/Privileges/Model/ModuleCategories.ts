import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class ModuleCategories extends BaseModel {
  constructor() {
    super()
  }
}

const moduleCategoriesSchema = new mongoose.Schema(
  {
    moduleId: { type: Schema.Types.ObjectId, refPath: 'moduleType', default: null },
    moduleType: { type: String, enum : ['listings', 'advertisement'], default: null },
    privilegeId: [{ type: Schema.Types.ObjectId, ref: 'privileges' }],
    privilegeCategoryId: [{ type: Schema.Types.ObjectId, ref: 'privilegeCategories' }],
    privilegeItemId: [{ type: Schema.Types.ObjectId, ref: 'privilegeItems' }],
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

moduleCategoriesSchema.loadClass(ModuleCategories)

export default mongoose.model('moduleCategories', moduleCategoriesSchema)
