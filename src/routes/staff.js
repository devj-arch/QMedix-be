import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import staffSevice from "../controller/staff.js";

const router = express.Router();

router.use(authenticate, authorizeRole("Staff"));

router.delete("/cancel-appointment/:appId",staffSevice.cancelAppointment);
router.post("/toggle-emergency/:appId",staffSevice.toggleEmergency);

export default router;
