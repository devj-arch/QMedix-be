import { supabase } from "../utils/supabase.js";


export const bookAppointment = async (details) => {
  const { pref_doctor, hospital_id, isEmergency, department, bookingDate, timeSlot, patient_id } = details;
  const opdStart = new Date(`${bookingDate}T09:00:00+05:30`);
  const opdEnd   = new Date(`${bookingDate}T18:00:00+05:30`);
  let slotBase = opdStart;

  if (timeSlot) {
    const [time, meridiem] = timeSlot.split(' ');
    let [hours, minutes]   = time.split(':').map(Number);

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    slotBase = new Date(`${bookingDate}T00:00:00+05:30`);
    slotBase.setHours(hours, minutes, 0, 0);
  }

  const { data: appointments, error: error1 } = await supabase
    .from('Appointment')
    .select()
    .eq('hospital_id', hospital_id)
    .eq('status', 'waiting')
    .gte('booked_for', opdStart.toISOString())
    .lt('booked_for', opdEnd.toISOString());

  if (error1) throw error1;

  const { data: doctors, error: error2 } = await supabase
    .from('Doctor')
    .select()
    .eq('hospital_id', hospital_id)
    .eq('speciality', department)
    .eq('isAvailable', true);

  if (error2) throw error2;

  if (!doctors || doctors.length === 0) {
    return { message: 'No doctors available in this department' };
  }

  const doctorLoad = {};
  doctors.forEach(doc => { doctorLoad[doc.id] = 0; });

  appointments.forEach(appt => {
    const doctor_id = appt.assigned_doctor;
    if (doctorLoad.hasOwnProperty(doctor_id)) {
      doctorLoad[doctor_id]++;
    }
  });

  const leastBusyDoctor = Object.keys(doctorLoad).reduce(
    (minId, curId) =>
      doctorLoad[curId] < doctorLoad[minId] ? curId : minId
  );

  let assigned_doctor;
  if (doctorLoad.hasOwnProperty(pref_doctor) && doctorLoad[pref_doctor] < 10) {
    assigned_doctor = pref_doctor;
  } else {
    assigned_doctor = leastBusyDoctor;
  }

  const minutesToAdd  = doctorLoad[assigned_doctor] * 10;
  const tentativeTime = new Date(slotBase.getTime() + minutesToAdd * 60 * 1000);
  const tentativeISO  = tentativeTime.toISOString();

  const { data:booked_appointment, error } = await supabase
    .from('Appointment')
    .insert({
      pref_doctor:     pref_doctor,
      assigned_doctor: assigned_doctor,
      hospital_id:     hospital_id,
      patient_id:      patient_id,
      booked_for:      tentativeISO,
      status: 'waiting',
    })
    .select()
    .single();

  if (error) throw error;

  if(isEmergency){
    const {error:emergency_error} = await supabase
    .from('Emergency_Requests')
    .insert({
      appointment_id:booked_appointment.id,
    })

    if(emergency_error) throw emergency_error;
  }

  return {
    message: 'Appointment booked successfully',
    details: booked_appointment,
  };
};

export const cancelAppointment = async(AppointmentId,patient_id) =>{
    const {data,error} = await supabase
    .from('Appointment')
    .delete()
    .eq('id', AppointmentId)
    .eq('patient_id',patient_id)
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

export const updateAppointment = async(AppointmentId,details) =>{
    const patient_id=details.patient_id;
    try{
        await cancelAppointment(AppointmentId,patient_id);
        const updAppt = await bookAppointment(details);
        return{
            message:"Appointment Updated Successfully.",
            details:updAppt.details
        }
    }catch(error){
        throw error;
    }
};

export const getAppointments = async(patient_id)=>{
    const { data, error } = await supabase
    .from('patient_appointment_view')
    .select()
    .eq('patient_id',patient_id);

    if(error) throw error;

    return {
        message:"Appointments fetched successfully.",
        data:data
    }
};

export const getBatchPatientDetails = async (ids) => {
  const { data, error } = await supabase
    .from("Patient")
    .select("id, name, dob, gender, phone")
    .in("id", ids);

  if (error) throw error;

  const calculateAge = (dob) => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const patients = data.map((p) => ({
    id: p.id,
    name: p.name,
    age: calculateAge(p.dob),
    dob: p.dob,
    gender: p.gender
      ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1)
      : null,
    phone: p.phone,
  }));

  return patients;
};