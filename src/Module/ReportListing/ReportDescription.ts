import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class ReportDescription extends BaseModel {
  constructor() {
    super()
  }
}

const subOptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});

const ReportDescriptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subCategoryType: {
    type: String,
    default: '',
    enum: ['none', 'choice', 'text']
  },
  subOptions: [subOptionSchema],
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
    default: Date.now
  },
  softdel: {
    type: Boolean,
    default: false
  }
});

ReportDescriptionSchema.loadClass(ReportDescription)

export default mongoose.model('reportdescription', ReportDescriptionSchema)
