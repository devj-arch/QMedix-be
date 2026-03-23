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

