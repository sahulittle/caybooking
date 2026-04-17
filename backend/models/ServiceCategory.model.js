import mongoose from "mongoose";

const AdminServiceCategory = new mongoose.Schema(
  {


    addCategory: {
      type: String,
      lowercase: true,
      trim: true,
      default: "general",
    },

    image: {
      type: String,
    },

    status: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true },
);


const ServiceCategory = mongoose.model("ServiceCategory", AdminServiceCategory);
export { ServiceCategory };