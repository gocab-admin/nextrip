import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class ReportListing extends BaseModel {
  constructor() {
    super()
  }
}


const ReportListingSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'listings',
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
  subReason: {
    type: String,
    required: false
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

ReportListingSchema.loadClass(ReportListing)

export default mongoose.model('reportlisting', ReportListingSchema)
