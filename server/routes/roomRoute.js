import express from "express"
import upload from "../middleware/uploadMiddleware.js"
import { ProtectedRoute } from "../middleware/authMiddleware.js"
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js"


const roomRouter = express.Router()

roomRouter.post("/", upload.array("images",4),ProtectedRoute,createRoom)
roomRouter.get("/",getRooms)
roomRouter.get("/owner",ProtectedRoute,getOwnerRooms)
roomRouter.post("/toggle-availability",ProtectedRoute,toggleRoomAvailability)


export default roomRouter