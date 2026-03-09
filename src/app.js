import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import auth from "./routes/auth.js";
import patient from "./routes/patient.js";
import hospitalRoutes from "./routes/hospital.js";
import staffRoutes from "./routes/staff.js";
import { authenticate } from "./middleware/authMiddleware.js";
import doctorRoutes from "./routes/doctor.js";
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
app.get("/me", authenticate, (req, res) => {
  console.log("me route hitted");
  res.json({
    success: true,
    user: req.user,
  });
});

app.use("/auth",auth);
app.use("/patient",patient);
app.use("/doctor",doctorRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/staff", staffRoutes);

app.use(errorHandler);

export default app;
