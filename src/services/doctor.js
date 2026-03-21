import { supabase } from "../utils/supabase.js";

export const getAllDoctors=async(hospitalId)=>{
  const {data,error}=await supabase
  .from("Doctor")
  .select("*")
  .eq("hospital_id",hospitalId)

  if(error) throw error;
  return data;
};

export const markCompleteService = async (appointmentId,remarks,completed_at,started_at) => {
  const toIST = (date) => {
    const d = new Date(date);
    return new Date(
      d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    ).toISOString();
  };

  const istCompletedAt = toIST(completed_at);
  const istStartedAt = toIST(started_at);

  const { data, error } = await supabase
    .from("Appointment")
    .update({
      status: "completed",
      remarks: remarks || null,
      completed_at: istCompletedAt,
      started_at: istStartedAt,
    })
    .eq("id", appointmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggle = async(doctorId) =>{
  const {initial,err} = await supabase
  .from("Doctor")
  .select("isAvailable")
  .eq("id",doctorId);

  if(err) throw err;

  const {data,error} = await supabase
  .from("Doctor")
  .update({
    isAvailable:!initial
  })
  .eq("id",doctorId)
  .select();

  if(error) throw error;

  return ""; 
}
