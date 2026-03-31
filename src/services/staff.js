import { supabase } from "../utils/supabase.js";

export const cancelAppointment = async(AppointmentId) => {
    const {data,error} = await supabase
    .from('Appointment')
    .delete()
    .eq('id', AppointmentId)
    .select();

    if(error) throw error;
    if(!data || data.length===0){
        return {
            message:"No such appointment exists."
        }
    }

    return{
        message:"Appointment deleted successfully.",
        details:data
    }
};

export const toggleEmergency = async(AppointmentId) => {
  const { data,error } = await supabase
  .from('Appointment')
  .select('isEmergency')
  .eq('id', AppointmentId)
  .single();

  if(error) throw error;

  const {error:toggleError} = await supabase
  .from('Appointment')
  .update({isEmergency:!data.isEmergency})
  .eq('id',AppointmentId);

  if(toggleError) throw toggleError;

  return{
    message:"Appointment Emergency status toggled successfully."
  }
};

export const approveEmergency = async(AppointmentId) =>{
  try {
    const { error: updateError } = await supabase
      .from("Emergency_Requests")
      .update({ status: 'APPROVED' })
      .eq("appointment_id", AppointmentId);

    if (updateError) throw updateError;

    const { error: appointmentError } = await supabase
      .from("Appointment")
      .update({ isEmergency: true })
      .eq("id", AppointmentId);

    if (appointmentError) throw appointmentError;

    return {
      message: "Emergency request approved successfully."
    };

  } catch (error) {
    throw error;
  }
};

export const rejectEmergency = async(AppointmentId) =>{
    const {error:update_error} = await supabase
    .from("Emergency_Requests")
    .update({
        status:'REJECTED'
    })
    .eq("appointment_id",AppointmentId)

    if(update_error) throw update_error;

    return {
        message:"Appointment Emergency Requests Rejected Successfully."
    }
}

