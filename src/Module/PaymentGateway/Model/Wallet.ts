import { BaseModel } from "@abserve/Module/BaseModel";
import mongoose, { Schema } from 'mongoose'

class Wallet extends BaseModel {
    constructor() {
        super();
    }
}

const transactionSchema = new mongoose.Schema({
    amount: { type: Number, default: 0 },
    type: { type: String, default: '' },
    description: { type: String, default: '' },
    reference: { type: String, default: '' },
    orderId: { type: Schema.Types.ObjectId, default: null },
    currentBalance: { type: Number, default: 0 },
    scheduledDate: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, default: null },
    userType: { type: String, default: '' },
    balance: { type: Number, default: 0 },
    status: { type: String, default: '' },
    trx: [transactionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

walletSchema.loadClass(Wallet);

export default mongoose.model('wallets', walletSchema)
