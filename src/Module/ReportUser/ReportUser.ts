import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class ReportUser extends BaseModel {
  constructor() {
    super()
  }
}

const ReportUserSchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'inReview', 'resolved', 'rejected'],
    default: 'pending'
  },
  adminComments: {
    type: String,
    default: '',
    required: false,
  },
  createdAt: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: null
  }
});

ReportUserSchema.loadClass(ReportUser)

export default mongoose.model('reportuser', ReportUserSchema)
