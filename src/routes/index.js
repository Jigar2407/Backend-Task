import express from "express";
import formRoutes from "./formRoutes.js";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/form", formRoutes);

router.use("/users", userRoutes);

router.use("/auth", authRoutes);

export default router;
