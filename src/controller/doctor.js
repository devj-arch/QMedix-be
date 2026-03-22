import {
   getAllDoctors,
   markCompleteService,
   toggle
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

   markComplete = async (req, res, next) => {
   try {
         const { appointmentId, remarks, completed_at, started_at } = req.body;

         if (!appointmentId || !completed_at || !started_at) {
            return res.status(400).json({
            success: false,
            message: "appointmentId, completed_at and started_at are required",
            });
         }

         const data = await markCompleteService(appointmentId,remarks,completed_at,started_at);

         return res.status(200).json({
            success: true,
            message: "Appointment marked as completed",
            data,
         });

   }catch (error) {
         next(error);
   }   
   };

   toggleAvailabilty = async(req,res,next) =>{
      try{
         const doctorId=req.user.id;
         const res = await toggle(doctorId);
         return res.status(200).json({
            message:"Doctor Availability toggled."
         })
      }catch(error){
         next(error);
      }
   };
};

export default new doctorController();
