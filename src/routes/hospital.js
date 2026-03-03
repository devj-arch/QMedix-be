import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import { getPendingApprovals, approveRole, getDashboardAnalytics } from "../controller/hospital.js";

const router = express.Router();

router.use(authenticate, authorizeRole("Hospital"));

router.get("/approvals", getPendingApprovals);
router.post("/approvals/:requestId/approve", approveRole);
router.get("/dashboard/opd", getDashboardAnalytics);

export default router;
