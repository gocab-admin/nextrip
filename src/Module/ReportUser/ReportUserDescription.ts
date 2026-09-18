import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class ReportUserDescription extends BaseModel {
  constructor() {
    super()
  }
}

const ReportUserDescriptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  addedAt: {
    type: Date,
    default: null
  },
  softdel: {
    type: Boolean,
    default: false
  }
});

ReportUserDescriptionSchema.loadClass(ReportUserDescription)

export default mongoose.model('reportuserdescription', ReportUserDescriptionSchema)
