import express from "express"
import { ProtectedRoute } from "../middleware/authMiddleware.js"
import { getUser, storeRecentStoredCities } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/", ProtectedRoute,getUser)
userRouter.post("/store-recent-search", ProtectedRoute,storeRecentStoredCities)



export default userRouter