import { User, ClipboardList } from "lucide-react"; // you can change icons
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const StudentDashboard = () => {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user.userData);
    const fullName = userData?.fullName;
  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6">

      <h1 className="text-2xl sm:text-3xl font-bold">
        Student Dashboard
      </h1>
      <p>Welcome {fullName}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PROFILE CARD  */}
        <div
          className="card bg-base-200 hover:shadow-xl transition-all cursor-pointer" onClick={() => {navigate('/student/onboard')}}>
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/20 text-primary">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="card-title text-lg sm:text-xl">Profile</h2>
                <p className="text-sm opacity-70">
                  View & update your student details
                </p>
              </div>
            </div>

            <div className="card-actions justify-end mt-4">
              {/* change this button link */}
              <button className="btn btn-primary btn-sm" >Open</button>
            </div>
          </div>
        </div>

        {/* ATTENDANCE CARD */}
        {/* change link inside button → navigate('/student/attendance') */}
        <div
          className="card bg-base-200 hover:shadow-xl transition-all cursor-pointer" onClick={() => {navigate('/student/attendance-view')}}>
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-secondary/20 text-secondary">
                <ClipboardList className="w-8 h-8" />
              </div>
              <div>
                <h2 className="card-title text-lg sm:text-xl">Attendance</h2>
                <p className="text-sm opacity-70">
                  Check your daily & monthly attendance
                </p>
              </div>
            </div>

            <div className="card-actions justify-end mt-4">
              {/* change this button link */}
              <button className="btn btn-secondary btn-sm">View</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
