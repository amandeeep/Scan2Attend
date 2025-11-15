import { useEffect, useState } from "react";
import { CameraIcon, ShuffleIcon, CircleArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { profile, onboard } from "../lib/api";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { setAuth, setOnboard } from "../store/authSlice";

const CollegeOnboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isOnboard, setIsOnboard] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);

  const [formState, setFormState] = useState({
    fullName: "",
    collegeId: "",
    address: "",
    contactNumber: "",
    profilePic: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await profile();

        dispatch(addUser(res.user));
        dispatch(setOnboard(res.user.isOnboard));

        setIsOnboard(res.user.isOnboard);

        setFormState({
          fullName: res.user.fullName || "",
          collegeId: res.user.collegeId || "",
          address: res.user.address || "",
          contactNumber: res.user.contactNumber || "",
          profilePic: res.user.profilePic || "",
          email: res.user.email || "",
        });
      } catch (err) {
        console.log("Error loading college profile:", err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    event.target.value = null;

    setSelectedFile(file);

    const previewURL = URL.createObjectURL(file);
    setFormState((prev) => ({
      ...prev,
      profilePic: previewURL,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsPending(true);
      setError(null);

      const formData = new FormData();

      Object.entries(formState).forEach(([key, val]) => {
        formData.append(key, val);
      });

      formData.append("isOnboard", true);

      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      const res = await onboard(formData);

      dispatch(addUser(res.user));
      dispatch(setAuth(true));
      dispatch(setOnboard(true));

      setSuccess(res.message);

      setTimeout(() => navigate("/college"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Onboarding failed");
    } finally {
      setIsPending(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">

        <button
          onClick={() =>
            isOnboard ? navigate("/college") : alert("Please complete your profile first")
          }
          className="btn btn-ghost ml-4 mt-4"
        >
          <CircleArrowLeft />
        </button>

        <div className="card-body p-6 sm:p-8">

          <h1 className="text-3xl font-bold text-center mb-6">
            Complete Your College Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col items-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden shadow">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full opacity-40">
                    <CameraIcon className="size-12" />
                  </div>
                )}
              </div>
              
              

              
              <label className="btn btn-outline gap-2 cursor-pointer">
                <Upload size={18} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>

              
              <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                <ShuffleIcon className="size-4 mr-2" />
                Random Avatar
              </button>
            </div>

            
            {success && (
              <div className="alert alert-success">
                <span>{success}</span>
              </div>
            )}

            
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            
            <div className="grid sm:grid-cols-2 gap-4">

              <div className="form-control">
                <label className="label">College Name</label>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formState.email}
                  className="input input-bordered bg-gray-100"
                  disabled
                />
              </div>

              <div className="form-control">
                <label className="label">College ID</label>
                <input
                  type="text"
                  value={formState.collegeId}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, collegeId: e.target.value }))
                  }
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Contact Number</label>
                <input
                  type="tel"
                  value={formState.contactNumber}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, contactNumber: e.target.value }))
                  }
                  className="input input-bordered"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">Address</label>
              <textarea
                value={formState.address}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, address: e.target.value }))
                }
                className="textarea textarea-bordered h-28"
                required
              ></textarea>
            </div>

            <button type="submit" disabled={isPending} className="btn btn-primary w-full">
              {isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Submit"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default CollegeOnboard;
