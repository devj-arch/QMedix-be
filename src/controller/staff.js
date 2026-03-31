import {
  cancelAppointment,
  toggleEmergency,
  approveEmergency,
  rejectEmergency,
  getEmergency
}from "../services/staff.js";

class Staff{
  cancelAppointment = async(req,res,next) =>{
    try{
      const AppointmentId=req.params.appId;
      const data=await cancelAppointment(AppointmentId);
      return res.status(200).json(data);
    }catch(error){
      next(error);
    }
  };

  toggleEmergency = async(req,res,next) =>{
    try{
      const AppointmentId=req.params.appId;
      const data=await toggleEmergency(AppointmentId);
      return res.status(201).json(data);
    }catch(error){
      next(error);
    }
  };

  approveEmergency = async(req,res,next) =>{
    try{
      const appointmentId=req.params.appId;
      const approval = await approveEmergency(appointmentId);
      return res.status(201).json(approval);
    }catch(error){
      next(error);
    }
  };

  rejectEmergency = async(req,res,next) =>{
    try{
      const appointmentId=req.params.appId;
      const rejection = await rejectEmergency(appointmentId);
      return res.status(201).json(rejection);
    }catch(error){
      next(error);
    }
  }

  getEmergency = async(req,res,next)=>{
    try{
      const hospital_id=req.params.hId;
      const data = await getEmergency(hospital_id);
      return res.status(200).json(data);
    }catch(error){
      next(error);
    }
  }
};

export default new Staff();   
