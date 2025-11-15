// import { useState, useEffect} from "react";
// import { CameraIcon, ShuffleIcon, CircleArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { onboard, profile } from "../lib/api"
// import { useDispatch } from "react-redux";
// import { addUser } from "../store/userSlice";
// import { setAuth, setOnboard } from "../store/authSlice";
// const StudentOnboard = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [isPending, setIsPending] = useState(false);
//     const [error, setError] = useState(null);
//     const [refresh, setRefresh] = useState(false);
//     const [flag, setFlag] = useState(false);
//     const [success, setSuccess] = useState(null);
//     const [resData, setResData] = useState({});
//     const [isOnboard, setIsOnboard] = useState(false);
     
//     useEffect(() => {
//       const fetch = async () =>{
//         try{
//           setIsPending(true);
//           setFlag(true)
//           const res = await profile();
//           console.log("hello", res.user.isOnboard)
//           dispatch(setOnboard(res.user.isOnboard));
//           setIsOnboard(res.user.isOnboard);
//           setResData(res.user);
//           console.log("isonboard in stuOnboard first useE ", res.user.isOnboard)
//         }catch(err){
//           console.log("error in calling useEffect in student onboard 1 "+ err.message);
//         }finally{
//           setIsPending(false);
//           setFlag(false)
//         }
//       };
//       fetch();
//     }, [refresh]);
//     console.log("res data ", resData)
//     console.log(resData.fullName)
//     const [formState, setFormState] = useState({
//         fullName: resData?.fullName || '',
//         semester: resData?.semester || '',
//         address: resData?.address || '',
//         gender: resData?.gender || '',
//         department: resData?.department || '',
//         age: resData?.age || '',
//         rollNumber: resData?.rollNumber || '',
//         studentID: resData?.studentID || '',
//         contactNumber: resData?.contactNumber || '',
//         profilePic: resData?.profilePic || '',
//         email: resData?.email || '',
//         isOnboard: resData?.isOnboard || ''
//     });
//     const checkOnboard = resData;
//     console.log("We getting valuse of checkOnboard ", checkOnboard)
    
    
//     useEffect(() => {
//       if (Object.keys(resData).length>0) {
//         setFormState({
//           fullName: resData?.fullName || '',
//           semester: resData?.semester || '',
//           address: resData?.address || '',
//           gender: resData?.gender || '',
//           department: resData?.department || '',
//           age: resData?.age || '',
//           rollNumber: resData?.rollNumber || '',
//           studentID: resData?.studentID || '',
//           contactNumber: resData?.contactNumber || '',
//           profilePic: resData?.profilePic || '',
//           email: resData?.email || ''
//         });
//       }
//     }, [resData]);

//     useEffect(() => {
//       if (success) {
//         const timeout = setTimeout(() => setSuccess(null), 3000);
//         return () => clearTimeout(timeout);
//       }
//     }, [success]);

//     const handleSubmit = async(e) =>{
        
//         e.preventDefault()
//         try{
//           setIsPending(true);
//           const updatedFormState = { ...formState, isOnboard: true };
//           const res = await onboard(updatedFormState);
//           dispatch(addUser(res.user))
//           dispatch(setOnboard(true))
//           dispatch(setAuth(true))
//           setError(null);
//           setSuccess(res.message); 
//           setRefresh(prev => !prev);
//           setIsOnboard(res.user.isOnboard);
//           navigate('/student')
//         }
//         catch(err){
//           console.log("Error in student onboarding "+ err.message);
//           setError(err.response?.data?.message || "Onboarding failed");
//           dispatch(setOnboard(false))
//           dispatch(setAuth(false))
//           setSuccess(null);
//         }
//         finally{
//           setIsPending(false)
//         }
//     }

//     const handleRandomAvatar = () => {
//     const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
//     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

//     setFormState((prev) => ({
//       ...prev,
//       profilePic: randomAvatar
//     }));
//     }
    
//     if(flag){
//       return(
//         <div>
//           Loading....
//         </div>
//       )
//     }
//     return(
//         <>
//         {/* modal-box max-w-7xl  */}
//         <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 ">
//         <div className="card bg-base-200 w-full max-w-3xl shadow-xl">  
//           <button
//           onClick={() => {
//             if(isOnboard) navigate('/student');
//             else alert("first enter your details")
//           }}
//         ><CircleArrowLeft/></button>

//         <div className="card-body p-6 sm:p-8" >
//           <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="flex flex-col items-center justify-center space-y-4">

//                 {/* profilepic */}
//                 <div className="size-32 rounded-full bg-base-300 overflow-hidden">
//                 {formState.profilePic ? (
//                   <img
//                     src={formState.profilePic}
//                     alt="Profile Preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <CameraIcon className="size-12 text-base-content opacity-40" />
//                   </div>
//                 )}
//               </div>
//               <div className="flex items-center gap-2">
//                 <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
//                   <ShuffleIcon className="size-4 mr-2" />
//                   Generate Random Avatar
//                 </button>
//               </div>
//             </div>

//             {/* success */}

//             {success && (
//               <div className="alert alert-success mb-4">
//                 <span>{success}</span>
//               </div>
//             )}


//             {/* error */}

//             {error && (
//               <div className="alert alert-error mb-4">
//                 <span>{error}</span>
//               </div>
//             )}

//             {/* details */}



//             <div>
//              {/* name */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Full Name</span>
//               </label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formState.fullName}
//                 onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
//                 className="input input-bordered w-full"
//                 placeholder="Your full name"
//                 required
//               />
//             </div>

//             {/* email */}

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Email</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formState.email}
//                 onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
//                 className="input input-bordered w-full"
//                 placeholder="Email"
//               />
//             </div>


//             <div className="md:flex  justify-between flex-wrap">
//             {/* rollNumber */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Roll Number</span>
//               </label>
//               <input
//                 type="number"
//                 name="rollNumber"
//                 value={formState.rollNumber}
//                 onChange={(e) => setFormState((prev) => ({ ...prev, rollNumber: e.target.value }))}
//                 className="input input-bordered w-full"
//                 placeholder="Your RollNumber"
//                 required
//               />
//               </div>

//               {/* studentID */}
//               <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Student Id</span>
//               </label>
//               <input
//                 type="number"
//                 name="studentID"
//                 value={formState.studentID}
//                 onChange={(e) => setFormState((prev) => ({ ...prev, studentID: e.target.value }))}
//                 className="input input-bordered w-full"
//                 placeholder="Your StudentID"
//                 required
//               />
//             </div>


//             {/* semester */}

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Semester</span>
//               </label>
//               <input
//                 type="number"
//                 name="studentID"
//                 value={formState.semester}
//                 onChange={(e) => setFormState((prev) => ({ ...prev, semester: e.target.value }))}
//                 className="input input-bordered w-full"
//                 placeholder="Your StudentID"
//                 required
//               />
//             </div>

//             {/* brach || department */}
//             <div className="form-control">
//             <label className="label">
//                 <span className="label-text">Branch</span>
//             </label>
//             <select
//                 name="department"
//                 value={formState.department}
//                 onChange={(e) =>
//                 setFormState((prev) => ({ ...prev, department: e.target.value }))
//                 }
//                 className="select select-bordered w-full"
//                 required
//             >
//                 <option value="">Select your branch</option>
//                 <option value="CSE">Computer Science (CSE)</option>
//                 <option value="ECE">Electronics (ECE)</option>
//                 <option value="ME">Mechanical (ME)</option>
//                 <option value="CE">Civil (CE)</option>
//                 <option value="EE">Electrical (EE)</option>
//                 <option value="IT">Information Technology (IT)</option>
//             </select>
//             </div>

//             {/* contactNumber */}
            
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Contact Number</span>
//               </label>
//               <input
//                 type="tel"
//                 name="contactNumber"
//                 value={formState.contactNumber}
//                 onChange={(e) => setFormState((prev) => ({ ...prev, contactNumber: e.target.value }))}
//                 className="input input-bordered w-full"
//                 placeholder="Contact Number"
//                 required
//               />
//             </div>

//             {/* gender */}

//             <div className="form-control">
//                 <label className="label">
//                     <span className="label-text">Gender</span>
//                 </label>
//                 <select
//                 name="gender"
//                 value={formState.gender}
//                 onChange={(e) => setFormState((prev) => ({...prev, gender:e.target.value}))}
//                 className="select select-bordered w-full"
//                 required
//                 >
//                     <option value="">Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                 </select>
//             </div>

//             {/* age */}

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Age</span>
//               </label>
//               <input
//                 type="number"
//                 name="age"
//                 value={formState.age}
//                 onChange={(e) => setFormState((prev) => ({ ...prev, age: e.target.value }))}
//                 className="input input-bordered w-full"
//                 placeholder="Your Age"
//                 required
//               />
//             </div>

//             </div>

//             {/* address */}

//             <div className="form-control">
//             <label className="label">
//                 <span className="label-text">Address</span>
//             </label>
//             <textarea
//                 name="address"
//                 value={formState.address}
//                 onChange={(e) =>
//                 setFormState((prev) => ({ ...prev, address: e.target.value }))
//                 }
//                 className="textarea textarea-bordered w-full h-32"
//                 placeholder="Your full address"
//                 required
//             ></textarea>
//             </div>


//             </div>
//                 <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
//                   {isPending ? (
//                     <span className="loading loading-spinner loading-xs">Submiting...</span>
//                   ):
//                   (
//                     "Submit"
//                   )}
//                   </button>

//           </form>
//         </div>
//         </div>
//         </div>
//         </>
//     )

// }


// export default StudentOnboard;



import { useState, useEffect } from "react";
import { CameraIcon, ShuffleIcon, CircleArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { onboard, profile } from "../lib/api";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { setAuth, setOnboard } from "../store/authSlice";

const StudentOnboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [flag, setFlag] = useState(false);
  const [success, setSuccess] = useState(null);
  const [resData, setResData] = useState({});
  const [isOnboard, setIsOnboard] = useState(false);

  // IMAGE FILE FOR UPLOAD
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsPending(true);
        setFlag(true);

        const res = await profile();
        dispatch(setOnboard(res.user.isOnboard));
        setIsOnboard(res.user.isOnboard);
        setResData(res.user);
      } catch (err) {
        console.log("Error:", err.message);
      } finally {
        setIsPending(false);
        setFlag(false);
      }
    };
    fetch();
  }, [refresh]);

  const [formState, setFormState] = useState({
    fullName: "",
    semester: "",
    address: "",
    gender: "",
    department: "",
    age: "",
    rollNumber: "",
    studentID: "",
    contactNumber: "",
    profilePic: "",
    email: "",
  });

  useEffect(() => {
    if (Object.keys(resData).length > 0) {
      setFormState({
        fullName: resData.fullName || "",
        semester: resData.semester || "",
        address: resData.address || "",
        gender: resData.gender || "",
        department: resData.department || "",
        age: resData.age || "",
        rollNumber: resData.rollNumber || "",
        studentID: resData.studentID || "",
        contactNumber: resData.contactNumber || "",
        profilePic: resData.profilePic || "",
        email: resData.email || "",
      });
    }
  }, [resData]);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  // HANDLES IMAGE SELECTION
  // const handleImageSelect = (e) => {
  //   const file = e.target.files[0];
  //   setSelectedFile(file);

  //   // preview
  //   if (file) {
  //     const imgUrl = URL.createObjectURL(file);
  //     setFormState((prev) => ({ ...prev, profilePic: imgUrl }));
  //   }
  // };
  const handleImageSelect = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    event.target.value = null; 

    setSelectedFile(file);

    const imageURL = URL.createObjectURL(file);
    setFormState((prev) => ({
      ...prev,
      profilePic: imageURL,
    }));
  };

  // ----------- SUBMIT FORM (multipart) -----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsPending(true);

      const formData = new FormData();

      Object.entries(formState).forEach(([key, val]) => {
        formData.append(key, val);
      });

      // important
      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      formData.append("isOnboard", true);

      const res = await onboard(formData);

      dispatch(addUser(res.user));
      dispatch(setOnboard(true));
      dispatch(setAuth(true));

      setSuccess(res.message);
      setRefresh((p) => !p);
      navigate("/student");
    } catch (err) {
      console.log("Onboard error =>", err.message);
      setError(err.response?.data?.message || "Onboarding failed");
      setSuccess(null);
    } finally {
      setIsPending(false);
    }
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setSelectedFile(null);
    setFormState((prev) => ({
      ...prev,
      profilePic: randomAvatar,
    }));
  };

  if (flag) {
    return <div>Loading…</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
          <button
            onClick={() => {
              if (isOnboard) navigate("/student");
              else alert("first enter your details");
            }}
            className="btn btn-ghost ml-4 mt-4"
          >
            <CircleArrowLeft />
          </button>

          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Complete Your Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PROFILE PICTURE SECTION */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                <label className="btn btn-outline flex items-center gap-2 cursor-pointer">
                  <Upload size={18} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Random Avatar
                </button>
              </div>

              {/* SUCCESS */}
              {success && (
                <div className="alert alert-success">
                  <span>{success}</span>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              {/* ------------------ FORM FIELDS ------------------ */}

              <div>
                <div className="form-control">
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={formState.fullName}
                    onChange={(e) =>
                      setFormState((p) => ({
                        ...p,
                        fullName: e.target.value,
                      }))
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState((p) => ({ ...p, email: e.target.value }))
                    }
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="md:flex justify-between flex-wrap gap-3">
                  <div className="form-control">
                    <label className="label">Roll Number</label>
                    <input
                      type="number"
                      value={formState.rollNumber}
                      onChange={(e) =>
                        setFormState((p) => ({
                          ...p,
                          rollNumber: e.target.value,
                        }))
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Student ID</label>
                    <input
                      type="number"
                      value={formState.studentID}
                      onChange={(e) =>
                        setFormState((p) => ({
                          ...p,
                          studentID: e.target.value,
                        }))
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Semester</label>
                    <input
                      type="number"
                      value={formState.semester}
                      onChange={(e) =>
                        setFormState((p) => ({
                          ...p,
                          semester: e.target.value,
                        }))
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Branch</label>
                    <select
                      value={formState.department}
                      onChange={(e) =>
                        setFormState((p) => ({
                          ...p,
                          department: e.target.value,
                        }))
                      }
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select</option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">ME</option>
                      <option value="CE">CE</option>
                      <option value="EE">EE</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">Contact</label>
                    <input
                      type="tel"
                      value={formState.contactNumber}
                      onChange={(e) =>
                        setFormState((p) => ({
                          ...p,
                          contactNumber: e.target.value,
                        }))
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Gender</label>
                    <select
                      value={formState.gender}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, gender: e.target.value }))
                      }
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">Age</label>
                    <input
                      type="number"
                      value={formState.age}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, age: e.target.value }))
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">Address</label>
                  <textarea
                    value={formState.address}
                    onChange={(e) =>
                      setFormState((p) => ({
                        ...p,
                        address: e.target.value,
                      }))
                    }
                    className="textarea textarea-bordered w-full h-32"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-xs">
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentOnboard;
