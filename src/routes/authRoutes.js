import express from "express";
import { register, Login, getMyProfile, getUsersPaginated, uploadProfile } from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", Login);
router.get("/me", protect, getMyProfile);
router.get("/users/paginated", protect, getUsersPaginated);
router.post("/upload-profile", authMiddleware, upload.single("profile"), uploadProfile)


export default router;