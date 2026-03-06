import { authorize } from "../middleware/roleMiddleware.js";
import express from "express";
const router=express.Router();
import doctorController from "../controller/doctor.js";
import { authenticate } from "../middleware/authMiddleware.js";
router.get("/get-queue",authenticate,authorize("doctor"),doctorController.getDoctorQueue);
export default router;