import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  legacyId: { type: Number },
  description: { type: String },
  image: { type: String },
  category: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  features: [String],
  plans: [planSchema],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
