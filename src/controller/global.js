import { todayAppointments } from "../services/global.js";

export const todayAppointmentsController = async(req,res,next) =>{
    try{
        const data = await todayAppointments();
        return res.status(200).json({
            success: true,
            data: data
        });
    }catch(error){
        next(error);
    }
};