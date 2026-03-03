import { supabase } from "../utils/supabase.js";

export const bookWalkInAppointment = async (appointmentData) => {
  const { data, error } = await supabase
    .from("Appointment")
    .insert([appointmentData])
    .select();
  if (error) throw error;
  return data;
};

export const getQueue = async (hospitalId) => {
  const { data, error } = await supabase
    .from("Appointment")
    .select("*, Patient(name, phone), Doctor(name, speciality)")
    .eq("hospital_id", hospitalId)
    .order("isEmergency", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};

export const updateAppointmentStatus = async (appointmentId, updates) => {
  const { data, error } = await supabase
    .from("Appointment")
    .update(updates)
    .eq("id", appointmentId)
    .select();
  if (error) throw error;
  return data;
};
