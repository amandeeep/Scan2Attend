import { useNavigate } from 'react-router-dom';
import AddUser from '../components/AddUser';
import { useSelector } from 'react-redux';
import { Info, UserPen, BookOpen, ClipboardCheck, UserPlus, ChevronRight, GraduationCap } from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const fullName = userData?.fullName || 'Teacher';
  const name = fullName.split(" ")
  const dashboardCards = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'View & update your details',
      icon: <UserPen className="w-10 h-10" />,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      hoverColor: 'hover:border-blue-500',
      route: '/teacher/onboard',
      tooltip: 'Click to view & update profile'
    },
    {
      id: 'subjects',
      title: 'Subjects & Enrollment',
      description: 'Create subjects and manage student enrollments',
      icon: <BookOpen className="w-10 h-10" />,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      hoverColor: 'hover:border-purple-500',
      route: '/teacher/addNenroll',
      tooltip: 'Click to add subjects and enroll students'
    },
    {
      id: 'attendance',
      title: 'Attendance',
      description: 'Record and manage student attendance',
      icon: <ClipboardCheck className="w-10 h-10" />,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      hoverColor: 'hover:border-green-500',
      route: '/teacher/attendance-mark',
      tooltip: 'Click to mark or view attendance'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-primary/20">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {name[0]} Dashboard
            </h1>
            <p className="text-sm sm:text-base text-base-content/70 mt-1">{fullName},
              Manage your daily teaching operations and student activities efficiently
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="stats shadow-md bg-base-100 border border-base-300">
            <div className="stat py-3 px-4">
              <div className="stat-title text-xs">Total Students</div>
              <div className="stat-value text-xl sm:text-2xl text-primary">145</div>
            </div>
          </div>
          <div className="stats shadow-md bg-base-100 border border-base-300">
            <div className="stat py-3 px-4">
              <div className="stat-title text-xs">Active Subjects</div>
              <div className="stat-value text-xl sm:text-2xl text-secondary">12</div>
            </div>
          </div>
          <div className="stats shadow-md bg-base-100 border border-base-300">
            <div className="stat py-3 px-4">
              <div className="stat-title text-xs">Today's Classes</div>
              <div className="stat-value text-xl sm:text-2xl text-accent">5</div>
            </div>
          </div>
          <div className="stats shadow-md bg-base-100 border border-base-300">
            <div className="stat py-3 px-4">
              <div className="stat-title text-xs">Avg Attendance</div>
              <div className="stat-value text-xl sm:text-2xl text-success">92%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-base-content">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className={`group card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border-2 border-transparent ${card.hoverColor} relative overflow-hidden`}
              onClick={() => navigate(card.route)}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.lightColor} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
              
              <div className="card-body items-center text-center p-6 sm:p-8 relative z-10">
                <div className={`p-5 rounded-2xl ${card.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                
                <h2 className="card-title mt-4 text-lg sm:text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                  {card.title}
                </h2>
                <p className="text-xs sm:text-sm text-base-content/70 mt-2 leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-6 h-6 text-primary" />
                </div>

                <div className="absolute top-3 left-3 tooltip tooltip-right" data-tip={card.tooltip}>
                  <Info className="w-5 h-5 text-primary/60 hover:text-primary cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          ))}

          <div className="group card bg-gradient-to-br from-base-100 to-primary/5 shadow-lg hover:shadow-2xl border-2 border-dashed border-primary/30 hover:border-primary transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            
            <div className="card-body items-center text-center p-6 sm:p-8 relative z-10">
              <div className="p-5 rounded-2xl bg-primary/10 text-primary shadow-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <UserPlus className="w-10 h-10" />
              </div>
              
              <h2 className="card-title mt-4 text-lg sm:text-xl font-bold text-base-content">
                Add Student
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 mt-2 leading-relaxed">
                Add new students to your institution
              </p>

              <div className="mt-4 w-full">
                <AddUser />
              </div>

              <div className="absolute top-3 left-3 tooltip tooltip-right" data-tip="Click on Add Student to add new student">
                <Info className="w-5 h-5 text-primary/60 hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default TeacherDashboard;