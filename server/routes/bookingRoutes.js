import express from "express"
import { checkAvailabiltyAPI, createBooking, getHotelBookings, getUserBookings } from "../controllers/bookingcontoller.js"
import { ProtectedRoute } from "../middleware/authMiddleware.js"

const bookingRouter = express.Router()

bookingRouter.post("/check-availibility",checkAvailabiltyAPI )
bookingRouter.post("/book",ProtectedRoute,createBooking )
bookingRouter.get("/user",ProtectedRoute,getUserBookings )
bookingRouter.get("/hotel",ProtectedRoute,getHotelBookings )


export default bookingRouter