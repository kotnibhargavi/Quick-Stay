import express from "express"
import "dotenv/config" 
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from "./controllers/clerkWebHooks.js"
import userRouter from "./routes/uerRoutes.js"
import hotelRouter from "./routes/hotelRoutes.js"
import connectCloudinary from "./configs/cloudinary.js"
import roomRouter from "./routes/roomRoute.js"
import bookingRouter from "./routes/bookingRoutes.js"

// DataBase Connection
connectDB()
connectCloudinary()
const app = express()
app.use(cors()) // Enabling Cross-Origin Resource Sharing 

// Middleware
app.use(clerkMiddleware())  
app.use(express.json())
const PORT = process.env.PORT || 3000;


// API to listen to Clerk Webhooks 

app.use("/api/clerk",clerkWebHooks)

app.get("/",(req,res)=>{
   res.send("API is Working")
})
app.use("/api/user", userRouter)
app.use("/api/hotels", hotelRouter)
app.use("/api/rooms", roomRouter)
app.use("/api/bookings", bookingRouter)


app.listen(PORT,()=>{
    console.log(`Server is Running on local host port ${PORT}`)
})