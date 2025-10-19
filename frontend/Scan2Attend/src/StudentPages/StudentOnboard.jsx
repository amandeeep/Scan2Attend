import { useState } from "react";
import { CameraIcon, ShuffleIcon } from "lucide-react";
const StudentOnboard = () => {
    
    const [formState, setFormState] = useState({
    fullName: '',
    semester: '',
    address: '',
    gender: '',
    department: '',
    age: '',
    rollNumber: '',
    studentID: '',
    contactNumber: '',
    profilePic: '',
    email: ''
});


    const handleSubmit = (e) =>{
        
        e.preventDefault()
    }

    const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState((prev) => ({
      ...prev,
      profilePic: randomAvatar
    }));
    }
    return(
        <>
        {/* modal-box max-w-7xl  */}
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 ">
        <div className="card bg-base-200 w-full max-w-3xl shadow-xl">  
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">

                {/* profilepic */}
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* details */}



            <div>
             {/* name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
                className="input input-bordered w-full"
                placeholder="Your full name"
                required
              />
            </div>

            {/* email */}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                className="input input-bordered w-full"
                placeholder="Email"
              />
            </div>


            <div className="md:flex  justify-between flex-wrap">
            {/* rollNumber */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Roll Number</span>
              </label>
              <input
                type="Number"
                name="rollNumber"
                value={formState.rollNumber}
                onChange={(e) => setFormState((prev) => ({ ...prev, rollNumber: e.target.value }))}
                className="input input-bordered w-full"
                placeholder="Your RollNumber"
                required
              />
              </div>

              {/* studentID */}
              <div className="form-control">
              <label className="label">
                <span className="label-text">Roll Number</span>
              </label>
              <input
                type="Number"
                name="studentID"
                value={formState.studentID}
                onChange={(e) => setFormState((prev) => ({ ...prev, studentID: e.target.value }))}
                className="input input-bordered w-full"
                placeholder="Your StudentID"
                required
              />
            </div>

            {/* brach || department */}
            <div className="form-control">
            <label className="label">
                <span className="label-text">Branch</span>
            </label>
            <select
                name="department"
                value={formState.department}
                onChange={(e) =>
                setFormState((prev) => ({ ...prev, department: e.target.value }))
                }
                className="select select-bordered w-full"
                required
            >
                <option value="">Select your branch</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="ME">Mechanical (ME)</option>
                <option value="CE">Civil (CE)</option>
                <option value="EE">Electrical (EE)</option>
                <option value="IT">Information Technology (IT)</option>
            </select>
            </div>

            {/* contactNumber */}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Contact Number</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formState.contactNumber}
                onChange={(e) => setFormState((prev) => ({ ...prev, contactNumber: e.target.value }))}
                className="input input-bordered w-full"
                placeholder="Contact Number"
                required
              />
            </div>

            {/* gender */}

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Gender</span>
                </label>
                <select
                name="gender"
                value={formState.gender}
                onChange={(e) => setFormState((prev) => ({...prev, gender:e.target.value}))}
                className="select select-bordered w-full"
                required
                >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="othem">Other</option>
                </select>
            </div>

            {/* age */}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Age</span>
              </label>
              <input
                type="Number"
                name="age"
                value={formState.age}
                onChange={(e) => setFormState((prev) => ({ ...prev, age: e.target.value }))}
                className="input input-bordered w-full"
                placeholder="Your Age"
                required
              />
            </div>

            </div>

            {/* address */}

            <div className="form-control">
            <label className="label">
                <span className="label-text">Address</span>
            </label>
            <textarea
                name="address"
                value={formState.address}
                onChange={(e) =>
                setFormState((prev) => ({ ...prev, address: e.target.value }))
                }
                className="textarea textarea-bordered w-full h-32"
                placeholder="Your full address"
                required
            ></textarea>
            </div>


            </div>
                <button type="submit" className="btn btn-primary w-full">Submit</button>

          </form>
        </div>
        </div>
        </div>
        </>
    )
}


export default StudentOnboard;