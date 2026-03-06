import {
   getDoctorQueue,
   currentPatient,
   callNext,
   emergencyPatient,
   markCompleted,
   markCanceled,
   doctorStats
} from "../services/doctor.js";


class doctorController{
    getDoctorQueue=async(req,res,next)=>{
      try {
         const doctorId=req.user.id;
         const queue=await getDoctorQueue(doctorId);
         return res.status(200).json({message:"doctor queue fetched",queue});
      } catch (error) {
         next(error);
      }
    }
};

export default new doctorController();
