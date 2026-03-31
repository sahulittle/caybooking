import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // one vendor profile per user
  },

  businessName: {
    type: String,
    required: true
  },

  serviceType: {
    type: String,
    enum: ['plumbing', 'electrical', 'cleaning', 'ac', 'mechanic'],
    required: true
  },

  experience: {
    type: Number,
    default: 0
  },

  phone: {
    type: String
  },

  location: {
    type: String
  },

  description: {
    type: String
  },

  status: {
    type: String,
    enum: ['Active', 'Pending Approval', 'Suspended'],
    default: 'Pending Approval'
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  rating: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export const Vendor = mongoose.model("Vendor", vendorSchema);