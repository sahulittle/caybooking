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

    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
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