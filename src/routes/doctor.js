import { authorize } from "../middleware/roleMiddleware.js";
import express from "express";
const router=express.Router();
import doctorController from "../controller/doctor.js";
import { authenticate } from "../middleware/authMiddleware.js";
router.get("/all/:hospitalId",doctorController.getAllDoctors);
router.post("/mark-complete",doctorController.markComplete);
router.post("/toggle-availability",doctorController.toggleAvailabilty);
export default router;