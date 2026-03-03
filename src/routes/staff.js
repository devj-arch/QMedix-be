import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import { createWalkIn, monitorQueue, tagEmergency, markArrival } from "../controller/staff.js";

const router = express.Router();

router.use(authenticate, authorizeRole("Staff"));

router.post("/appointments/walk-in", createWalkIn);
router.get("/queue", monitorQueue);
router.patch("/appointments/:appointmentId/emergency", tagEmergency);
router.patch("/appointments/:appointmentId/arrive", markArrival);

export default router;
