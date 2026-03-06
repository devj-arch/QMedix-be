import { supabase } from "../utils/supabase.js";

function getTodayRange(){
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);

  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);

  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString()
  };
}
const { start, end } = getTodayRange();
export const getDoctorQueue=async(doctorId)=>{
    const {data,error}=await supabase
    .from("Appointment")
    .select("*, Patient(name, phone)")
    .eq("assigned_doctor",doctorId)
    .eq("status", "pending")
    .gte("booked_for", start)
    .lte("booked_for", end)
    .order("isEmergency", { ascending: false })
    .order("booked_for", { ascending: true });

    if(error) throw error;
    return data;

};
export const currentPatient=async(doctorId)=>{
const { data,error}=await supabase
    .from("Appointment")
    .select("*,Patient(name)")
    .eq("assigned_doctor",doctorId)
    .eq("status","in_progress")
    .single();
    if(error && error.code!=="PGRST116") throw error;
    return data;
};

export const callNext=async(doctorId)=>{
const {data:nextPatient,error}=await supabase
.from("Appointment")
.select("*")
.eq("assigned_doctor",doctorId)
.eq("status","pending")
.gte("booked_for", start)
.lte("booked_for", end)
.order("isEmergency", { ascending: false })
.order("booked_for", { ascending: true })
.limit(1)
.single();
if(error) throw error;

const {data,error:err}=await supabase
.from("Appointment")
.update({ status: "in_progress" })
.eq("id",nextPatient.id)
.select();
if(err) throw err;
return data;
};

export const emergencyPatient=async(doctorId)=>{
const {data:emergencyPatient,error}=await supabase
.from("Appointment")
.select("*")
.eq("assigned_doctor",doctorId)
.eq("isEmergency",true)
.eq("status","pending")
.gte("booked_for", start)
.lte("booked_for", end)
.order("booked_for", { ascending: true })
.limit(1)
.single();

if(error) throw error;

const {data,error:err}=await supabase
.from("Appointment")
.update({ status: "in_progress" })
.eq("id",emergencyPatient.id)
.select();

if(err) throw err;
return data;
};

export const markCompleted=async(appointmentId)=>{
    const {data,error}=await supabase
    .from("Appointment")
    .update({ status: "completed" })
    .eq("id",appointmentId)
    .select()
    .single();
    if(error) throw error;
    return data;
}

export const markCanceled=async(appointmentId)=>{
const {data,error}=await supabase
.from("Appointment")
.update({status:"cancelled"})
.eq("id",appointmentId)
.single()
.select();

if(error) throw error;
const nextPatient=await callNext(data.assigned_doctor);
return nextPatient;


};

export const doctorStats=async(doctorId)=>{

  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);

  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);

  const { count: totalToday } = await supabase
    .from("Appointment")
    .select("*", { count: "exact", head: true })
    .eq("assigned_doctor", doctorId)
    .gte("booked_for", startOfDay.toISOString())
    .lte("booked_for", endOfDay.toISOString());

  const { count: emergencyCount } = await supabase
    .from("Appointment")
    .select("*", { count: "exact", head: true })
    .eq("assigned_doctor", doctorId)
    .eq("isEmergency", true)
    .gte("booked_for", startOfDay.toISOString())
    .lte("booked_for", endOfDay.toISOString());

  return {
    totalToday,
    emergencyCount
  };
};