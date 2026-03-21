import { supabase } from "../utils/supabase.js";
export const getall=async()=>{
  const {data,error}=await supabase
  .from("Hospital")
  .select("*")
  if(error) throw error;
  return data;
  
}//
export const getApprovalRequests = async (hospitalId) => {
  const { data, error } = await supabase
    .from("Approval_Requests")
    .select("*")
    .eq("hospital_id", hospitalId)
    .eq("status", "PENDING");
  if (error) throw error;
  return data;
};

// export const approveUserRole = async (requestId, hospitalId) => {
//   const { data: request, error: reqError } = await supabase
//     .from("Approval_Requests")
//     .select("*")
//     .eq("id", requestId)
//     .single();

//   if (reqError) throw reqError;

//   // Insert into respective table based on role (Doctor or Staff)
//   if (request.role === 'DOCTOR') {
//     const { error: insertError } = await supabase.from("Doctor").insert([{
//       id: request.id,
//       name: request.name,
//       phone: request.phone,
//       address: request.address,
//       email: request.email,
//       hospital_id: hospitalId,
//       speciality: request.speciality
//     }]);
//     if (insertError) throw insertError;
//   }

//   const { data, error } = await supabase
//     .from("Approval_Requests")
//     .update({ status: "APPROVED" })
//     .eq("id", requestId)
//     .select();

//   if (error) throw error;
//   return data;
// };

export const getDailyOPDStats = async (hospitalId) => {
  const { data, error } = await supabase
    .from("Daily_OPDs")
    .select("*")
    .eq("hospital_id", hospitalId);
  if (error) throw error;
  return data;
};

export const getDoctorData = async(hospitalId)=>{
  const {data,error} = await supabase
  .from("Doctor")
  .select()
  .eq("hospital_id",hospitalId);
  if(error) throw error;
  return data;
};

export const getStaffData = async(hospitalId)=>{
  const {data,error} = await supabase
  .from("Staff")
  .select()
  .eq("hospital_id",hospitalId);
  if(error) throw error;
  return data;
};