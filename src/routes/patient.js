import express from "express";
import patient from "../controller/patient.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router=express.Router();
router.post("/book-appointment",authenticate,patient.bookAppointment);
router.delete("/cancel-appointment/:appId",authenticate,patient.cancelAppointment);
router.post("/update-appointment/:appId",authenticate,patient.updateAppointment);
router.get("/get-appointments",authenticate,patient.getAppointments);
export default router;