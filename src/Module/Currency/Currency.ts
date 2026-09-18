import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Currency extends BaseModel {
  constructor() {
    super();
  }
}

// Define Currency Schema
const CurrencySchema = new mongoose.Schema({
    currency: {
      type: String
    },
    code: {
      type: String,
      required: true
    },
    default: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    symbol: {
      type: String
    },
    format: {
      type: String
    },
    exchange_rate: {
      type: String
    },
    deletedAt: {
      type: Date,
      default: null
    }
  }, { timestamps: true }
);

CurrencySchema.loadClass(Currency);

export default mongoose.model('Currency', CurrencySchema)