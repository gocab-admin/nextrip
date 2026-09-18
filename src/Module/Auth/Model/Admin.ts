import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Admin extends BaseModel {
  constructor() {
    super()
  }
}

const AdminSchema = new mongoose.Schema({
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  dob: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  phoneCode: { type: String, default: '+91' },
  gender: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  publicId : { type: String, default: '' },
  role: { type: Schema.Types.ObjectId, ref: 'adminroles', default: null},
  hash: { type: String },
  salt: { type: String },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  isActive: { type: Boolean, default: true },
  softdel: { type: Boolean, default: false },
  wallet: { type: Number, default: 0 },
  fcmId: { type: String, default: '' }
})

AdminSchema.loadClass(Admin)

export default mongoose.model('admins', AdminSchema)