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

export const getEmergency = async (hospitalId) => {
  const { data, error } = await supabase
    .from("emergency_requests_view")
    .select()
    .eq('hospital_id', hospitalId);
  if (error) throw error;
  return data;
};

export const registerWalkIn = async (details) => {
  const {
    patient_name,
    doctor_id,
    hospital_id,
    isEmergency,
    phone,
    gender,
    dob,
    address
  } = details;

  const { data: walkinRegistration, error: patientRegisterError } = await supabase
    .from('Patient')
    .insert({
      name: patient_name,
      address: address || null,
      phone: phone || null,
      dob: dob || null,
      gender: gender || null,
      is_walkin: true
    })
    .select()
    .single();

  if (patientRegisterError) throw patientRegisterError;

  const patient_id = walkinRegistration.id;

  const now = new Date();

  const opdStart = new Date();
  opdStart.setHours(9, 0, 0, 0);

  const opdEnd = new Date();
  opdEnd.setHours(18, 0, 0, 0);

  const { data: appointments, error: error1 } = await supabase
    .from('Appointment')
    .select()
    .eq('hospital_id', hospital_id)
    .eq('assigned_doctor', doctor_id)   
    .in('status', ['waiting', 'in_progress'])
    .gte('booked_for', opdStart.toISOString())
    .lt('booked_for', opdEnd.toISOString());

  if (error1) throw error1;

  const queueLength = appointments.length;

  const minutesToAdd = queueLength * 10;

  const tentativeTime = new Date(now.getTime() + minutesToAdd * 60 * 1000);

  const { data: booked_appointment, error } = await supabase
    .from('Appointment')
    .insert({
      pref_doctor: doctor_id,        
      assigned_doctor: doctor_id,    
      hospital_id: hospital_id,
      patient_id: patient_id,
      booked_for: tentativeTime.toISOString(),
      status: 'waiting',
      isEmergency: isEmergency || false
    })
    .select()
    .single();

  if (error) throw error;

  return {
    message: 'Walk-in registered successfully',
    //token: booked_appointment.id,
    details: booked_appointment
  };
};