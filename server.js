import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", router);

app.listen(5000, () => {
  console.log("Server  running on port 5000");
});
