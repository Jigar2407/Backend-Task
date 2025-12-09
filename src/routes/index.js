import express from "express";
import formRoutes from "./formRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/form", formRoutes);

router.use("/users", userRoutes);

export default router;
