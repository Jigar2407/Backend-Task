import express from "express";
import { register, Login, getMyProfile, getUsersPaginated } from "../controller/authController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", Login);
router.get("/me", protect, getMyProfile);
router.get("/users/paginated", protect, getUsersPaginated);


export default router;