import { supabase } from "../utils/supabase.js";

export const PatientSignin = async (
    name,
    email,
    phone,
    password,
    address,
    dob,
    gender
    ) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        phone,
        options: {
        data: {
            role: "patient",
        },
        },
    });

    if (error) throw error;

    const user = data.user;

    const { data: Patient, error: err } = await supabase
        .from("Patient")
        .insert([
        {
            id: user.id,
            name,
            phone,
            email,
            address,
            dob: dob || null,        // ✅ stored as DATE (YYYY-MM-DD)
            gender: gender || null,  // ✅ stored as text
        },
        ])
        .select()
        .single();

    if (err) throw err;

    return {
        session: data.session,
        Patient,
    };
};

export const DoctorSignin=async(name,email,address,phone,password,speciality,hospital_id)=>{
    const {data,error}=await supabase.auth.signUp({
       email,
       password,
       phone,
        options: {
        data: {
            role:"doctor",
        },
      },
    });
    if(error) throw error;
    const user=data.user;

    const {data:doctor,error:err}=await supabase
    .from("Approval_Requests")
    .insert({
        id:user.id,
        role:"doctor",
        hospital_id:hospital_id,
        name:name,
        phone:phone,
        address:address,
        email:email,
        speciality:speciality
    })
    .select()
    .single();
    if(err) throw err;
    return {
        session:data.session,
        doctor
    };
};

export const HospitalSignin=async(name,email,phone,password,address)=>{
    const {data,error}=await supabase.auth.signUp({
       email,
       password,
       phone,
        options: {
        data: {
          role:"hospital",
        },
      },
    });
    if(error) throw error;
    const user=data.user;

    const {data:hospital,error:err}=await supabase
    .from("Hospital")
    .insert([{
        id:user.id,
        phone,
        name,
        address,
        email
    }])
    .select()
    .single();
    if(err) throw err;
    return{
        session:data.session,
     hospital
    };
};

export const StaffSignin=async(hospital_id,name,email,phone,password,address)=>{
    const {data,error}=await supabase.auth.signUp({
       email,
       password,
       phone,
        options: {
        data: {
          role:"hospital-staff",
        },
      },
    });
    if(error) throw error;
    const user=data.user;

    const {data:hospital_staff,error:err}=await supabase
    .from("Approval_Requests")
    .insert({
        id:user.id,
        role:"hospital-staff",
        hospital_id:hospital_id,
        name:name,
        phone:phone,
        address:address,
        email:email
    })
    .select()
    .single();
    if(err) throw err;
    return{
        session:data.session,
     hospital_staff};
};
export const Login=async(email,password)=>{
    
}
export const PatientLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;

    const { data: patient, error: err } = await supabase
        .from("Patient")
        .select("*")
        .eq("id", data.user.id)
        .single();

    if (err) throw err;

    return {
        userId: data.user.id,
        patient,
        session:data.session,
        role: 'patient'
    };
};

export const DoctorLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;

    const { data: doctor, error: err } = await supabase
        .from("Doctor")
        .select("*")
        .eq("id", data.user.id)
        .single();

    if (err) throw err;

    return {
        userId: data.user.id,
        doctor,
         session:data.session,
        role: 'doctor'
    };
};

export const HospitalLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;

    const { data: hospital, error: err } = await supabase
        .from("Hospital")
        .select("*")
        .eq("id", data.user.id)
        .single();

    if (err) throw err;

    return {
        userId: data.user.id,
        hospital,
         session:data.session,
        role: 'hospital'
    };
};

export const StaffLogin=async(email,password)=>{
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;

    const { data: staff, error: err } = await supabase
    .from("Staff")
    .select("*")
    .eq("id", data.user.id)
    .single();

    if (err) throw err;

    return {
        userId: data.user.id,
        staff,
         session:data.session,
        role: 'hospital-staff'
    };
};

export const ApproveDoctor=async(id,hospital_id)=>{
    const { data:details, error:err } = await supabase
    .from('Approval_Requests')
    .select()
    .eq('id',id)
    .eq('hospital_id',hospital_id)
    .maybeSingle()

    if(err) throw err;

    if(!details || details.status!=="PENDING") return{
        message:"Wrong Approve Request."
    }

    const {error} = await supabase
    .from('Approval_Requests')
    .update({'status':'APPROVED'})
    .eq("id",id)

    if(error) throw error;

    const {name,address,phone,email,speciality}=details;

    const {data:doctor,error:err1}=await supabase
    .from("Doctor")
    .insert({
        id,
        name,
        address,
        phone,
        email,
        hospital_id,
        speciality

    })
    .select()
    .maybeSingle();
    if(err1) throw err1;
    return {
        details:doctor,
        message:"Doctor Approved."
    }

};

export const ApproveStaff=async(id,hospital_id)=>{
    const { data:details, error:err } = await supabase
    .from('Approval_Requests')
    .select()
    .eq("id",id)
    .eq("hospital_id",String(hospital_id))
    .maybeSingle()

    if(err) throw err;

    if(!details || details.status!=="PENDING") return{
        message:"Wrong Approve Request."
    }

    const {error} = await supabase
    .from('Approval_Requests')
    .update({'status':'APPROVED'})
    .eq("id",id)

    if(error) throw error;

    const {name,address,phone,email}=details;

    const {data:hospital_staff,error:err1}=await supabase
    .from("Staff")
    .insert([{
        id,
        hospital_id,
        phone,
        name,
        address,
        email
    }])
    .select()
    .maybeSingle();
    if(err1) throw err1;
    return {
        details:hospital_staff,
        message:"Staff Approved"
    }

};

export const RejectRequest=async(id,hospital_id)=>{
    const { data:details, error:err } = await supabase
    .from('Approval_Requests')
    .select()
    .eq("id",id)
    .eq("hospital_id",hospital_id)
    .single()
    
    if(err) throw err;

    if(!details || details.status!=="PENDING") return{
        message:"Wrong Reject Request."
    }

    const {error} = await supabase
        .from('Approval_Requests')
        .update({'status':'REJECTED'})
        .eq("id",id)

    if(error) throw error;

    const { data, error:err1 } = await supabaseAdmin.auth.admin.deleteUser(id);
    if(err1) throw err1;
    return { message: "Request Rejected Successfully." };

};

export const getMe = async (user) => {
  const role = user.user_metadata?.role;
  let profile = null;

  if (role === "patient") {
    const { data } = await supabase
      .from("Patient")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data;
  }

  else if (role === "doctor") {
    const { data } = await supabase
      .from("Doctor")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data;
    if(!profile){
        const {data:pending}=await supabase
        .from("Approval_Requests")
        .select("*")
        .eq("id",user.id)
        .single();
        profile=pending;
    }
  }

  else if (role === "hospital") {
    const { data } = await supabase
      .from("Hospital")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data;
  }

  return({  
    ...profile,   
    role
  });
};
