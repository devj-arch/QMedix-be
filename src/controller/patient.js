import { bookAppointment,
    cancelAppointment,
    updateAppointment
 } from "../services/patient.js";

class Patient{
    bookAppointment = async(req,res,next)=>{
        const patient_id=req.user.id;
        const details={
            ...req.body,
            patient_id:patient_id
        };
        try{
            const appointment = await bookAppointment(details);
            return res.status(201).json(appointment);
        }catch(error){
            next(error);
        }
    };

    cancelAppointment = async(req,res,next)=>{

    }

    updateAppointment = async(req,res,next)=>{

    };
};

export default new Patient();