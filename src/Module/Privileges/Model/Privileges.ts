import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Privileges extends BaseModel {
  constructor() {
    super()
  }
}

const PrivilegesSchema = new mongoose.Schema(
  {
      name: { type: String, default: '' },
      description: { type: String, default: '' },
      deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

PrivilegesSchema.loadClass(Privileges)

export default mongoose.model('privileges', PrivilegesSchema)
