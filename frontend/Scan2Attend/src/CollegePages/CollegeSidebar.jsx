import { removeAuth } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { X, Home,   LogOut,  BookOpen, GraduationCap,  UserPen, ClipboardCheck, } from 'lucide-react';
import {  useNavigate, useLocation } from "react-router-dom";
import { logout } from "../lib/api";
import { useSelector } from "react-redux";
import { removeUser } from "../store/userSlice";
const StudentSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user.userData);
  console.log("userData in sidebar ", userData);
  const fullName = userData?.fullName || "Student Name";
  const email = userData?.email || "example@mail.com";
  const semester = userData?.semester || 0;
  const [first, last] = fullName.split(" ");
  const initials = first[0] + last[0];
  const profilePic = userData?.profilePic;
  const subjectCount = userData?.attendanceDetails?.subjectDetails?.length || 0;
  const percentage = userData?.attendanceDetails?.percentage || 0;
  const handleLogout = async () => {
    dispatch(removeAuth());
    dispatch(removeUser());
    navigate('/');
    const res = await logout();
    // Close sidebar after logout
    document.getElementById("my-drawer").checked = false;
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      document.getElementById("my-drawer").checked = false;
    }
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: Home, label: "Home", path: "/teacher" },
    { icon: ClipboardCheck, label: "Attendance", path: "/teacher/attendance-mark" },
    { icon: UserPen, label: "Profile", path: "/teacher/onboard" },
    { icon: BookOpen, label: "Subject & Enroll", path: "/teacher/addNenroll" },
  ];

  return (
    <div className="drawer z-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <div className="w-64 sm:w-72 lg:w-80 bg-base-100 min-h-full flex flex-col shadow-2xl">
          
          <div className="p-4 sm:p-6 border-b border-base-300">
            <div className="flex items-center justify-between mb-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Scan2Attend
                </span>
              </div>

              {/* Close Button */}
              <label 
                htmlFor="my-drawer" 
                className="btn btn-sm btn-ghost btn-circle lg:hidden"
              >
                <X className="w-5 h-5" />
              </label>
            </div>

            {/* User Info Card */}
            <div className="bg-base-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10 h-10 sm:w-12 sm:h-12">
                    <span className="text-lg sm:text-xl font-semibold">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-lg sm:text-xl font-semibold">{initials}</span>
                      )}
                      </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base truncate">{fullName}</p>
                  <p className="text-xs sm:text-sm text-base-content/60 truncate">{email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      text-sm sm:text-base font-medium transition-all duration-200
                      ${active 
                        ? 'bg-primary text-primary-content shadow-md scale-[1.02]' 
                        : 'text-base-content hover:bg-base-200 hover:scale-[1.01]'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'animate-pulse' : ''}`} />
                    <span className="truncate">{item.label}</span>
                    {active && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary-content"></div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-base-200 rounded-lg">
              <h4 className="text-xs sm:text-sm font-semibold text-base-content/70 mb-3">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-base-content/60">Attendance</span>
                  <span className="font-semibold text-success">{percentage}%</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-base-content/60">Subjects</span>
                  <span className="font-semibold">{subjectCount}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-base-content/60">Semester</span>
                  <span className="font-semibold">{semester}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="p-4 border-t border-base-300 space-y-3">
            {/* App Version */}
            <div className="text-center">
              <p className="text-xs text-base-content/50">Version 1.0.0</p>
            </div>

            {/* Logout Button */}
            <button 
              className="btn btn-error w-full gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;