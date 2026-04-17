import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const serviceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },

    

    plans: {
      type: [planSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    requirements: [
      {
        label: { type: String, required: true },
        options: [
          {
            label: { type: String, required: true },
            extraPrice: { type: Number, default: 0 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// 🚀 performance
serviceSchema.index({ category: 1 });
serviceSchema.index({ status: 1 });

const adminService = mongoose.model("AdminService", serviceSchema);

export default adminService;