import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadToCloudinary = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
    });

    fs.unlinkSync(file.path); // cleanup

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};