import { bookAppointment,
    cancelAppointment,
    updateAppointment,
    getAppointments,
    getBatchPatientDetails
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
        const patient_id=req.user.id;
        const appId=req.params.appId;
        try{
            const appointment = await cancelAppointment(appId,patient_id);
            return res.status(200).json(appointment);
        }catch(error){
            next(error);
        }
    }

    updateAppointment = async(req,res,next)=>{
        const patient_id=req.user.id;
        const AppId=req.params.appId;
        const details={
            ...req.body,
            patient_id:patient_id
        }
        try{
            const appt = await updateAppointment(AppId,details);
            return res.status(201).json(appt);
        }catch(error){
            next(error);
        }
    };

    getAppointments = async(req,res,next)=>{
        const patient_id=req.user.id;
        try{
            const appts = await getAppointments(patient_id);
            return res.status(200).json(appts);
        }catch(error){
            next(error);
        }
    };

    getBatchDetails = async (req, res, next) => {
        try {
            const { ids } = req.body;

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "ids array is required",
            });
            }

            const patients = await getBatchPatientDetails(ids);

            return res.status(200).json({
            patients,
            });
        } catch (error) {
            next(error);
        }
    };
};

export default new Patient();