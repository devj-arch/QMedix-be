import * as adminService from "../services/hospital.js";
import { redisClient } from "../utils/redis.js";
export const getAllHospitals=async(req,res,next)=>{
  try {
    const cache=await redisClient.get("allHospitals");
    if (cache) {
      console.log("CACHE HIT");
      return res.status(200).json({
        message:"All hospitals fetched",
        hospitals:JSON.parse(cache)
      });
    }
    const hospitals=await adminService.getall();
    await redisClient.set(
  "allHospitals",
  JSON.stringify(hospitals),
  { EX: 86400}
);

    return res.status(200).json({
      message:"All hospitals fetched",
      hospitals
    });
  } catch (error) {
    next(error);
  }
}//

export const getPendingApprovals = async (req, res, next) => {
  try {
    // req.roleData.id is the hospital's ID 
    const requests = await adminService.getApprovalRequests(req.user.id);
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

// export const approveRole = async (req, res, next) => {
//   try {
//     const { requestId } = req.params;
//     const result = await adminService.approveUserRole(requestId, req.user.id);
//     res.status(200).json({ success: true, message: "Role approved successfully", data: result });
//   } catch (error) {
//     next(error);
//   }
// };
//use auth for now

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const stats = await adminService.getDailyOPDStats(req.roleData.id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getAllStaffDetails = async (req, res, next) => {
  try {
    const hospitalId = req.user.id;

    const [staffData, doctorData] = await Promise.all([
      adminService.getStaffData(hospitalId),
      adminService.getDoctorData(hospitalId),
    ]);

    const formattedStaff = staffData.map((staff) => ({
      ...staff,
      role: "staff",
    }));

    const formattedDoctors = doctorData.map((doctor) => ({
      ...doctor,
      role: "doctor",
    }));

    const combinedData = [...formattedStaff, ...formattedDoctors];

    return res.status(200).json({
      success: true,
      count: combinedData.length,
      data: combinedData,
    });

  } catch (error) {
    next(error);
  }
};