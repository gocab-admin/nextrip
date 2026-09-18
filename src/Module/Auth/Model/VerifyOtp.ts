import mongoose from 'mongoose'
import { Enum } from '@abserve/Utils/Enum'
import { BaseModel } from '@abserve/Module/BaseModel'

class Verification extends BaseModel {
  constructor() {
    super()
  }
}

const VerificationSchema = new mongoose.Schema(
  {
    phoneCode: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },

    otp: { type: String, default: '' },
    userType: {
      type: String,
      enum: [Enum.ROLES.ADMIN, Enum.ROLES.USER],
      default: Enum.ROLES.ADMIN
    },

    verified: { type: Boolean, default: false },
    verifyBy: { type: String, enum: ['email', 'phone'], default: '' },
    verifyFrom: { type: String, default: 'LOGIN' },
    expired: { type: Boolean, default: false }
  },
  { timestamps: true }
)

VerificationSchema.loadClass(Verification)

export default mongoose.model('Verification', VerificationSchema)
