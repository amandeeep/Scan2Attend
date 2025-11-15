import { Palette } from 'lucide-react';
import ThemeSelector  from '../components/ThemeSelector';
import { Croissant, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { removeAuth } from '../store/authSlice';
import StudentOnboard from '../StudentPages/StudentOnboard';
import { useDispatch, useSelector } from 'react-redux';
import StudentAttendanceView from './StudentAttendanceView';
import { removeUser } from '../store/userSlice';


const StudentNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const profilePic = userData?.profilePic || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  const handleLogout = async () => {
      dispatch(removeAuth());
      dispatch(removeUser());
      navigate('/');
      const res = await logout();
      
    };
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md shadow-lg rounded-xl border border-base-200 relative z-10">
      <div className="flex-none">
        <label
          htmlFor="my-drawer"   
          className="btn btn-square btn-ghost hover:bg-base-200 transition-colors shadow-sm drawer-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>

      <div className="flex-1">
        <span className='hover:scale-105 transition-transform'>
          <button className='btn btn-ghost ml-3 p-1 lg:ml-6'>
            <GraduationCap className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider hidden lg:inline-block">
              Scan2Attend
            </span>
          </button>
        </span>
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto shadow-sm focus:shadow-md transition-shadow"
        />
        
        <div className="relative z-50">
          <ThemeSelector/>
        </div>

        <div className="dropdown dropdown-end relative z-50">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform shadow-sm"
          >
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                alt="Tailwind CSS Navbar component"
                src={profilePic}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100/95 rounded-xl mt-3 w-52 p-2 shadow-xl border border-base-200"
          >
            <li>
              <span className="justify-between hover:bg-base-200 rounded-lg transition-colors" onClick={() => {navigate('/student/onboard')}}>
                Profile
              </span>
            </li>
            <li>
              <span className="hover:bg-base-200 rounded-lg transition-colors" onClick={()=> {navigate('/student')}}>Dashboard</span>
            </li>
            <li>
                <span className="hover:bg-base-200 rounded-lg transition-colors" onClick={()=> {navigate('/student/attendance-view')}}>Attendance</span>
            </li>
            <li>
              <span className="text-red-600 hover:bg-base-200 rounded-lg transition-colors" onClick={handleLogout}>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StudentNavbar;