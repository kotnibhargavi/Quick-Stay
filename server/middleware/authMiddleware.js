import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const ProtectedRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.decode(token);
    const userId = decoded?.sub;

    if (!userId) return res.json({ success: false, message: "Invalid token" });

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.json({ success: false, message: "Authentication failed" });
  }
};
