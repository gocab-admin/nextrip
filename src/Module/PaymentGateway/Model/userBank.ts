import { BaseModel } from "@abserve/Module/BaseModel";
import mongoose, { Schema } from 'mongoose'

class UserBank extends BaseModel {
    constructor() {
        super();
    }
}

const userBankSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, default: null },
    acctType: { type: String, default: 'savings', enum: ["current", "savings"] },
    bankName: { type: String, default: '' },
    acctHolderName: { type: String, default: '' },
    acctNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: {
        line1: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        postal_code: { type: String, default: '' },
    },
    routing_number: { type: String, default: '' },
    permanentAcctNum: { type: String, default: '' },
    country: { type: String, default: '' },
    paymentMethod: { type: String, default: '', enum: ['stripe', 'razorpay']},
    stripeAcctId: { type: String, default: '' },
    stripeBankId: { type: String, default: '' },
    razorpayContactId: { type: String, default: '' },
    razorpayFundAccountId: { type: String, default: '' },
    softDelete: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

userBankSchema.loadClass(UserBank);

export default mongoose.model('userBanks', userBankSchema)
