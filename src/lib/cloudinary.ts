import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.GOOGLE_CLIENT_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary=async (file:Blob)
