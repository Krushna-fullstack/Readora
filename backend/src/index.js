import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import job from "./lib/cron.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

job.start();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(morgan("dev"));

import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import connectDB from "./config/db.js";

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is listing in on PORT ${PORT}`);
  connectDB();
});
