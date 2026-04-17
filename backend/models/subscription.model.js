import mongoose from 'mongoose'

const SubscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  duration: { type: String },
  description: { type: String },
  features: { type: [String], default: [] },
  highlight: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  isGold: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema)

export default SubscriptionPlan
