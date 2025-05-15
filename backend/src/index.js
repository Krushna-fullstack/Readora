import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

import authRoutes from "./routes/auth.routes.js";
import connectDB from "./config/db.js";

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is listing in on PORT ${PORT}`);
  connectDB();
});
