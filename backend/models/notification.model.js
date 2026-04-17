import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  recipientType: { type: String, enum: ['all', 'users', 'vendors', 'specific'], default: 'all' },
  specificId: { type: String },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String },
  recipientLabel: { type: String },
  createdAt: { type: Date, default: Date.now }
})

const Notification = mongoose.model('Notification', NotificationSchema)
export default Notification
