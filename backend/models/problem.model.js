import mongoose from "mongoose";

const ProblemRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,

  service: String,
  plan: String,

  date: String,
  time: String,

  address: String,
  city: String,
  zip: String,

  notes: String,

  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed'],
    default: 'Pending'
  },

  vendor: {
    type: String,
    default: 'Unassigned'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const ProblemRequest = mongoose.model(
  'ProblemRequest',
  ProblemRequestSchema
);