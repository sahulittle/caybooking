import mongoose from "mongoose";

const MaintenanceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: String,
    email: String,
    phone: String,

    service: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
    },

    // Optional fields to support lightweight contact form submissions
    date: {
      type: String,
    },
    time: {
      type: String,
    },

    address: {
      type: String,
    },
    city: {
      type: String,
    },
    zip: {
      type: String,
    },

    notes: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null
    }
  },
  { timestamps: true }
);

export const MaintenanceRequest = mongoose.model(
  "MaintenanceRequest",
  MaintenanceRequestSchema
);