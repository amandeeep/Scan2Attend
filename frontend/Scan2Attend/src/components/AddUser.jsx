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
