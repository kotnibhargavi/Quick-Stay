import express from "express"
import { ProtectedRoute } from "../middleware/authMiddleware.js"
import { registerHotel } from "../controllers/hotelController.js"

const hotelRouter = express.Router()

hotelRouter.post("/", ProtectedRoute,registerHotel)

export default hotelRouter