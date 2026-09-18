import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'
import { Config } from '@abserve/Config/AppConfig'

class User extends BaseModel {
  constructor() {
    super()
  }
}

const Document = new mongoose.Schema({
  name: { type: String },
  status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' },
  reason: { type: String, default: '' },
  fields: [
    {
      name: { type: String },
      value: { type: String },
    }
  ]
})

const UserSchema = new mongoose.Schema({
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  fullname: { type: String, default: '' },
  phoneCode: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  publicId: { type: String, default: '' },
  document: [Document],
  gender: { type: String, default: '' },
  dob: { type: String, default: '' },
  language: { type: String, default: '' },
  school: { type: String, default: '' },
  work: { type: String, default: '' },
  pet: { type: String, default: '' },
  song: { type: String, default: '' },
  obsessed: { type: String, default: '' },
  funFact: { type: String, default: '' },
  useLessSkill: { type: String, default: '' },
  bio: { type: String, default: '' },
  hobby: { type: String, default: '' },
  desc: { type: String, default: '' },
  mode: { type: String, enum: ['traveller', 'host'], default: 'traveller'},
  passwordKeys: {
    forgetPasswordKey: { type: String, default: '' },
    isValidKey: { type: Boolean, default: false },
    resetDate: { type: Date, default: null }
  },
  address: {
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    zipcode: { type: String, default: '' },
    address: { type: String, default: '' },
    landmark: { type: String, default: '' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  currency: { type: String, default: '' },
  hash: { type: String },
  salt: { type: String },
  verified: { type: Boolean, default: true },
  verifiedBy: { type: String, default: '' },
  verifiedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  emailOtp: { type: Number, default: 1111 },
  userBankId: { type: String, default: '' },
  softdel: { type: Boolean, default: false },
  refBy: { type: Schema.Types.ObjectId, ref: 'users', default: null },
  fcmId: { type: String, default: '' },
  permitCopy: { type: String, default: '' },
  cancellationPolicyId: { type: Number, default: 0 },
  instantBooking: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

UserSchema.loadClass(User)

export default mongoose.model('users', UserSchema)
