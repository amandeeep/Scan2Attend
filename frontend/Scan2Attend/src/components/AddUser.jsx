// import {useState} from 'react'
// import toast, { Toaster } from 'react-hot-toast';
// import { addUser } from '../lib/api';
// const AddUser = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [gender, setGender] = useState("");
//     const [sem, setSem] = useState("");
//     const [department, setDepartment] = useState("");
//     const [branch, setBranch] = useState("");
//     const [isLogging, setIsLogging] = useState(false);
//     const [call, setCall] = useState("");
//     const [roll, setRoll] = useState("");
//     const [id, setId] = useState("")
//     const [err, setErr] = useState("");


//     const handleClose = (e) => {
//         setIsOpen(false);
//         setBranch("");
//         setCall("");
//         setDepartment("");
//         setEmail("");
//         setGender("");
//         setName("");
//         setPassword("");
//         setRoll("");
//         setSem("");
//         setId("")
//     }
//     const handleSubmit = async (e) => {
//         try{
//             setIsLogging(true);
//             setErr(null);
//             const data = {
//             fullName : name,
//             email: email,
//             branch: branch,
//             gender: gender,
//             password: password,
//             rollNumber: roll,
//             semester: sem,
//             department: department,
//             contactNumber: call,
//             studentID: id
//             }
//             const res = await addUser(data);
            
//         }catch(err){
//             console.log(err);
//             setErr(err.message || "Error in adding Student");
//             toast(setErr);
//         }finally{
//             setIsLogging(false);
//         }
        
        
//     }
//   return (


// // onClick={()=>setIsOpen(true)}
// // open={isOpen}
// // we dont need this because our dialog box works on checkbox

//     <div className='' >
//         <Toaster/>
//         {/* The button to open modal */}



        
// <label htmlFor="my_modal_6" className="btn bg-gradient-to-r from-primary to-secondary font-mono" >Add Student!</label>

// {/* Put this part before </body> tag */}
// <form action={handleSubmit} >
// <input type="checkbox"  className="modal-toggle" id="my_modal_6"/>
// <div className="modal" role="dialog">
        
//   <div className="modal-box">
//     <h3 className="text-xl font-bold m-2 mb-5 font-mono">Add New Student!</h3>
//     <div className='flex flex-col gap-3 '>
//     <div className='form-control w-full space-y-2'>
//         <label>Full Name</label>
//         <input type="text" placeholder="Name" className=' rounded border-2 ' value={name} onChange={(e) => setName(e.target.value) } required/>
//     </div>
//     <div className='form-control w-full space-y-2'>
//         <label>Email</label>
//         <input type="email" placeholder="Email" className=' rounded border-2 ' value={email} onChange={(e) => setEmail(e.target.value) } required/>
//     </div>
//     <div className='form-control w-full space-y-2'>
//         <label>Password</label>
//         <input type="password" placeholder="Password" className=' rounded border-2 ' value={password} onChange={(e) => setPassword(e.target.value) } required/>
//     </div>
//     <div className='form-control w-full space-y-2'>
//         <label>Select Gender</label>
//         <select className=' rounded border-2' value={gender} onChange={(e) => setGender(e.target.value)} required>
//             <option value="">Select one</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="Others">Others</option>
//         </select>
//     </div>
//     <div className='form-control w-full space-y-2'>
//         <label>Semester</label>
//         <input type="number" placeholder="Semester" className=' rounded border-2 ' value={sem} onChange={(e) => setSem(e.target.value) } required/>
//     </div>
//     <div className='form-control w-full space-y-2'>
//         <label>Department</label>
//         <input type="text" placeholder="Department" className=' rounded border-2 ' value={department} onChange={(e) => setDepartment(e.target.value.toUpperCase()) } required/>
//     </div>
//     <div className='form-control w-full space-y-2'>
//         <label>Branch</label>
//         <input type="text" placeholder="Branch" className=' rounded border-2 ' value={branch} onChange={(e) => setBranch(e.target.value.toUpperCase()) } required/>
//     </div>
//     <div className='form-control w-full space-y-2'>
//         <label>Roll Number</label>
//         <input type="number" placeholder="Roll Number" className=' rounded border-2 ' value={roll} onChange={(e) => setRoll(e.target.value) } required/>
//     </div>
//     <div className='form-control w-full space-y-2'>
//         <label>Student Id</label>
//         <input type="number" placeholder="Roll Number" className=' rounded border-2 ' value={id} onChange={(e) => setId(e.target.value) } required/>
//     </div>
//     <div className='form-control w-full space-y-2'>
//         <label>Phone Number</label>
//         <input type="number" placeholder="Phone Number" className=' rounded border-2 ' value={call} onChange={(e) => setCall(e.target.value) } required/>
//     </div>
//     </div>
//     {/* <p className="py-4">This modal works with a hidden checkbox!</p> */}
//     <div className="modal-action">
//       <label htmlFor="my_modal_6" className="btn reset" onClick={handleClose}>Close!</label>
//       <button type='button' onClick={handleSubmit}  className="btn btn-primary">Submit!</button>
//     </div>
//   </div>
// </div>
// </form>
//     </div>
//   )
// }

// export default AddUser


import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { addUser } from "../lib/api";
import { 
  UserPlus, X, Mail, Lock, Phone, 
  Building2, Hash, GraduationCap, User
} from "lucide-react";

const AddUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    semester: "",
    department: "",
    branch: "",
    rollNumber: "",
    contactNumber: "",
    studentID: "",
  });

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      gender: "",
      semester: "",
      department: "",
      branch: "",
      rollNumber: "",
      contactNumber: "",
      studentID: "",
    });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password || !form.studentID) {
      return toast.error("Please fill all required fields");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error("Invalid email format");
    }

    setIsLoading(true);

    try {
      const response = await addUser(form);

      if (response?.success) {
        toast.success("Student added successfully!");
        document.getElementById("addStudentModal").checked = false;
        resetForm();
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <label 
        htmlFor="addStudentModal" 
        className="btn btn-primary gap-2"
      >
        <UserPlus className="w-5 h-5" />
        Add Student
      </label>

      <input type="checkbox" id="addStudentModal" className="modal-toggle" />

      <div className="modal">
        <div className="modal-box max-w-xl animate-scale-in">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              Add New Student
            </h3>
            <label htmlFor="addStudentModal" className="btn btn-sm btn-ghost">
              <X />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="label font-semibold">Full Name</label>
              <div className="input input-bordered flex items-center gap-2">
                <User className="w-5 h-5 opacity-60" />
                <input
                  type="text"
                  className="grow"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label font-semibold">Email</label>
              <div className="input input-bordered flex items-center gap-2">
                <Mail className="w-5 h-5 opacity-60" />
                <input
                  type="email"
                  className="grow"
                  placeholder="student@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label font-semibold">Password</label>
              <div className="input input-bordered flex items-center gap-2">
                <Lock className="w-5 h-5 opacity-60" />
                <input
                  type="password"
                  className="grow"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label font-semibold">Gender</label>
              <select
                className="select select-bordered w-full"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                required
              >
                <option value="">Choose gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div>
              <label className="label font-semibold">Semester</label>
              <div className="input input-bordered flex items-center gap-2">
                <GraduationCap className="w-5 h-5 opacity-60" />
                <input
                  type="number"
                  className="grow"
                  placeholder="Semester"
                  value={form.semester}
                  onChange={(e) => handleChange("semester", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label font-semibold">Department</label>
              <div className="input input-bordered flex items-center gap-2">
                <Building2 className="w-5 h-5 opacity-60" />
                <input
                  type="text"
                  className="grow"
                  placeholder="Department"
                  value={form.department}
                  onChange={(e) =>
                    handleChange("department", e.target.value.toUpperCase())
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="label font-semibold">Branch</label>
              <div className="input input-bordered flex items-center gap-2">
                <Building2 className="w-5 h-5 opacity-60" />
                <input
                  type="text"
                  className="grow"
                  placeholder="Branch"
                  value={form.branch}
                  onChange={(e) =>
                    handleChange("branch", e.target.value.toUpperCase())
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="label font-semibold">Roll Number</label>
              <div className="input input-bordered flex items-center gap-2">
                <Hash className="w-5 h-5 opacity-60" />
                <input
                  type="number"
                  className="grow"
                  placeholder="Roll Number"
                  value={form.rollNumber}
                  onChange={(e) => handleChange("rollNumber", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label font-semibold">Student ID</label>
              <div className="input input-bordered flex items-center gap-2">
                <Hash className="w-5 h-5 opacity-60" />
                <input
                  type="number"
                  className="grow"
                  placeholder="Unique ID"
                  value={form.studentID}
                  onChange={(e) => handleChange("studentID", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label font-semibold">Phone Number</label>
              <div className="input input-bordered flex items-center gap-2">
                <Phone className="w-5 h-5 opacity-60" />
                <input
                  type="number"
                  className="grow"
                  placeholder="Enter phone number"
                  value={form.contactNumber}
                  onChange={(e) => handleChange("contactNumber", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-action">
              <label 
                htmlFor="addStudentModal" 
                className="btn"
                onClick={resetForm}
              >
                Cancel
              </label>

              <button 
                type="submit" 
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Submit"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddUser;
