import { authenticate } from "../middleware/authMiddleware.js";
import { todayAppointmentsController } from "../controller/global.js";
import express from "express";
const router=express.Router();

router.get("/appointments/today",authenticate,todayAppointmentsController);
export default router;