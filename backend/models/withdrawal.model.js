import mongoose from 'mongoose'

const WithdrawalSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true },
  method: { type: String, default: 'bank' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema)
export default Withdrawal
