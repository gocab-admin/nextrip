import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Commission extends BaseModel {
  constructor() {
    super()
  }
}

const CommissionSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', default: '' },
  listingId: { type: Schema.Types.ObjectId, ref: 'listings', default: '' },
  commission: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inActive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

CommissionSchema.loadClass(Commission)

export default mongoose.model('Commission', CommissionSchema)