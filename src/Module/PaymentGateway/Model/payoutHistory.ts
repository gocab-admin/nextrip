import { BaseModel } from "@abserve/Module/BaseModel";
import mongoose, { Schema } from 'mongoose'

class PayoutHistory extends BaseModel {
    constructor() {
        super();
    }
}

const payoutHistorySchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    userType: { type: String, required: true },
    transferId: { type: String, required: true },
    objectType: { type: String, default: '' },
    amount: { type: Number, required: true },
    amountReversed: { type: Number, default: 0 },
    balanceTransaction: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    currency: { type: String, default: '' },
    description: { type: String, default: null },
    destination: { type: String, default: null },
    destination_payment: { type: String, default: null },
    livemode: { type: String, default: null },
    source_type: { type: String, default: null },
});

payoutHistorySchema.loadClass(PayoutHistory);

export default mongoose.model('payoutHistory', payoutHistorySchema)