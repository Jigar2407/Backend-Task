import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", router);

app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT || 5000);
});
