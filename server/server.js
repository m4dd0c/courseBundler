import app from "./app.js";
import connectDB from "./config/database.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";

connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export var instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log("Backend server started at", process.env.PORT);
});

