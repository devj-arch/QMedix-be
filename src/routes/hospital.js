import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import {getAllHospitals, getPendingApprovals, getDashboardAnalytics,getAllStaffDetails} from "../controller/hospital.js";

const router = express.Router();
router.get("/all",getAllHospitals);

router.use(authenticate, authorizeRole("Hospital"));
router.get("/approvals", getPendingApprovals);
router.get("/get-all-staff",getAllStaffDetails);
//router.post("/approvals/:requestId/approve", approveRole);
router.get("/dashboard/opd", getDashboardAnalytics);

export default router;
