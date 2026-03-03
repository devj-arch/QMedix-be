import express from "express";
import patient from "../controller/patient.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router=express.Router();
router.post("/book-appointment",authenticate,patient.bookAppointment);
export default router;