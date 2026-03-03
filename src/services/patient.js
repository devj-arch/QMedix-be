import { supabase } from "../utils/supabase.js";


export const bookAppointment= async(details) =>{
    const {pref_doctor,hospital_id,isEmergency,department,bookingDate,patient_id} = details;
    const now = new Date(bookingDate);
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const { data:appointments, error:error1 } = await supabase
    .from('Appointment')
    .select()
    .eq('hospital_id',hospital_id)
    .eq('status','pending')
    .gte('booked_for', startOfDay.toISOString())
    .lt('booked_for', endOfDay.toISOString());

    if(error1) throw error1;

    const {data:doctors,error:error2} = await supabase
    .from('Doctor')
    .select()
    .eq('hospital_id',hospital_id)
    .eq('speciality',department)
    .eq('isAvailable',true);

    if(error2) throw error2;
    if (!doctors || doctors.length === 0) {
        return{
            message:"No doctors available in this department",
        }
    }
    const doctorLoad={};
    doctors.forEach(doc =>{
        doctorLoad[doc.id]=0;
    });
    appointments.forEach(appt => {
        const doctor_id = appt.assigned_doctor;

        if (doctorLoad.hasOwnProperty(doctor_id)) {
            doctorLoad[doctor_id]++;
        }
    });

    const leastBusyDoctor = Object.keys(doctorLoad).reduce(
        (minDoctorId, currentDoctorId) => {
            return doctorLoad[currentDoctorId] < doctorLoad[minDoctorId]
            ? currentDoctorId
            : minDoctorId;
        }
    );

    let assigned_doctor;
    if(doctorLoad.hasOwnProperty(pref_doctor) && doctorLoad[pref_doctor] < 10){
        assigned_doctor = pref_doctor;
    }else{
        assigned_doctor = leastBusyDoctor;
    }

    const minutesToAdd = doctorLoad[assigned_doctor] * 10;
    const tentativeTime = new Date(now.getTime() + minutesToAdd * 60000);
    const tentativeISO = tentativeTime.toISOString();

    const {data,error} = await supabase
    .from('Appointment')
    .insert({
        pref_doctor:pref_doctor,
        assigned_doctor:assigned_doctor,
        hospital_id:hospital_id,
        isEmergency:isEmergency,
        patient_id:patient_id,
        booked_for:bookingDate,
    })
    .select();

    if(error) throw error;
    return {
        message:"Appointment booked successfully",
        tentative_time:tentativeISO,
        details:data
    }
};

export const cancelAppointment = async(AppointmentId) =>{
    const {data,error} = await supabase
    .from('Appointment')
    .delete()
    .eq('id', AppointmentId)
    .select();

    if(error) throw error;

    return{
        message:"Appointment deleted successfully.",
        details:data
    }
};

export const updateAppointment = async(AppointmentId,details) =>{
    const {pref_doctor,assigned_doctor,hospital_id,isEmergency,department,bookingDate,patient_id} = details;
    const now = new Date();
    const bookingDate_ = new Date(bookingDate);
    if (isNaN(bookingDate_.getTime())) {
    throw new Error("Invalid booking date");
    }
    if (bookingDate_ <= now) {
    throw new Error("Booking date must be in the future");
    }

    const {data,error} = await supabase
    .from('Appointment')
    .update({
        pref_doctor:pref_doctor,
        assigned_doctor:assigned_doctor,
        hospital_id:hospital_id,
        isEmergency:isEmergency,
        patient_id:patient_id,
        booked_for:bookingDate,
    })
    .eq('id',AppointmentId)
    .select();

    if(error) throw error;
    return {
        message:"Appointment updated successfully",
        details:data
    }
};