import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class PrivilegeItems extends BaseModel {
  constructor() {
    super()
  }
}

const privilegeItemsSchema = new mongoose.Schema(
  {
      privilegeId: { type: Schema.Types.ObjectId, ref: 'privileges', default: null },
      privilegeCategoryId: { type: Schema.Types.ObjectId, ref: 'privilegeCategories', default: null },
      name: { type: String, default: '' },
      description: { type: String, default: '' },
      icon: { type: String, default: '' },
      inputType: { type: String, enum: ['Text','None'], default: 'None'},
      publicId:{ type: String, default: ''},
      deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

privilegeItemsSchema.loadClass(PrivilegeItems)

export default mongoose.model('privilegeItems', privilegeItemsSchema)
