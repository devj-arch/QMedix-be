import {
   getDoctorQueue,
   currentPatient,
   callNext,
   emergencyPatient,
   markCompleted,
   markCanceled,
   doctorStats,
   getAllDoctors
} from "../services/doctor.js";
import { redisClient } from "../utils/redis.js";

class doctorController{

   getAllDoctors=async(req,res,next)=>{
      try {
         console.log("doctor route get");
         const {hospitalId}=req.params;
         const cacheKey = `doctors:${hospitalId}`;

        const cache = await redisClient.get(cacheKey);

    if(cache){
      console.log("CACHE HIT");
      return res.status(200).json({
         message:"Doctors fetched for hospital",
        doctors: JSON.parse(cache)
      });
    }

         const doctors=await getAllDoctors(hospitalId);
      await redisClient.set(
      cacheKey,
      JSON.stringify(doctors),
      { EX: 86400 }
    );
         return res.status(200).json({
            message:"Doctors fetched for hospital",
            doctors
         })
   
      } catch (error) {
         next(error);
      }
   }
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
