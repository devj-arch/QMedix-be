import {
  cancelAppointment,
  toggleEmergency
}from "../services/staff.js";

class Staff{
  cancelAppointment = async(req,res,next) =>{
    try{
      const AppointmentId=req.params.appId;
      const data=await cancelAppointment(AppointmentId);
      res.status(200).json(data);
    }catch(error){
      next(error);
    }
  };

  toggleEmergency = async(req,res,next) =>{
    try{
      const AppointmentId=req.params.appId;
      const data=await toggleEmergency(AppointmentId);
      res.status(201).json(data);
    }catch(error){
      next(error);
    }
  };
};

export default new Staff();   
