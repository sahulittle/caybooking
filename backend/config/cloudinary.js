import dotenv from "dotenv";
import cloudinaryPkg from "cloudinary";

// 🔥 VERY IMPORTANT
dotenv.config();

const cloudinary = cloudinaryPkg.v2;

console.log("Cloudinary ENV check:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;