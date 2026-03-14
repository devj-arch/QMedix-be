import {supabase} from "../utils/supabase.js";

export const todayAppointments = async()=>{
    const { data, error } = await supabase
  .from('today_appointments')
  .select();
    if(error) throw error;
    return data;
};