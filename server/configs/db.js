import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking-application`);
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    setTimeout(connectDB, 5000); 
  }
};

export default connectDB;