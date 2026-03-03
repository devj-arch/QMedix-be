import * as adminService from "../services/hospital.js";

export const getPendingApprovals = async (req, res, next) => {
  try {
    // req.roleData.id is the hospital's ID 
    const requests = await adminService.getApprovalRequests(req.roleData.id);
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const approveRole = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const result = await adminService.approveUserRole(requestId, req.roleData.id);
    res.status(200).json({ success: true, message: "Role approved successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const stats = await adminService.getDailyOPDStats(req.roleData.id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
