import { useEffect, useState, useMemo } from "react";
import { getAttendance } from "../lib/attendanceApi.js";
import { Calendar, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";

const StudentAttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // Overall totals
  const totalPresent = attendanceData.filter(r => r.status === "Present").length;
  const totalMarked = attendanceData.filter(r => r.status === "Present" || r.status === "Absent").length;
  const overallAttendance = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;
  
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const params = { date: today };
        const res = await getAttendance(params);
        setAttendanceData(res.data || []);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const subjects = useMemo(
    () => [...new Set(attendanceData.map(r => r.subjectCode))],
    [attendanceData]
  );

  const dates = useMemo(
    () => [...new Set(attendanceData.map(r => new Date(r.date).toISOString().split("T")[0]))].sort(),
    [attendanceData]
  );

  const getStatus = (subject, date) => {
    const record = attendanceData.find(
      r => r.subjectCode === subject && new Date(r.date).toISOString().split("T")[0] === date
    );
    return record ? record.status : "-";
  };

  const getAttendancePercentage = (subject) => {
    const subjectRecords = attendanceData.filter(r => r.subjectCode === subject);
    if (subjectRecords.length === 0) return 0;
    const presentCount = subjectRecords.filter(r => r.status === "Present").length;
    return Math.round((presentCount / subjectRecords.length) * 100);
  };

  // Loading State
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
      <p className="text-base-content/70 text-lg">Loading attendance data...</p>
    </div>
  );

  // Error State
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="alert alert-error max-w-md shadow-lg">
        <AlertCircle className="h-6 w-6" />
        <div className="flex flex-col">
          <span className="font-semibold">Oops! Something went wrong</span>
          <span className="text-sm opacity-80">{error}</span>
        </div>
      </div>
      <button 
        className="btn btn-primary mt-4"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );

  // Empty State
  if (attendanceData.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <Calendar className="h-16 w-16 text-base-content/30 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Attendance Records</h3>
      <p className="text-base-content/70 text-center max-w-md">
        Your attendance records will appear here once they are marked by your instructor.
      </p>
    </div>
  );

  return (
    <div className="bg-base-200 p-3 sm:p-4 md:p-6 space-y-4">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between flex-wrap">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
            Attendance Overview
          </h2>
          <p className="text-sm sm:text-base text-base-content/70 mt-1">
            Track your attendance across all subjects
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-2  sm:mt-0">
          <div className="stats shadow-md bg-base-200 border border-base-300">
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Total Attendance</div>
              <div className="stat-value text-2xl text-primary">{overallAttendance}%</div>
            </div>
          </div>
          <div className="stats shadow-md bg-base-200 border border-base-300">
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Total Present</div>
              <div className="stat-value text-2xl text-primary">{totalPresent}</div>
            </div>
          </div>
          <div className="stats shadow-md bg-base-200 border border-base-300">
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Total Records</div>
              <div className="stat-value text-2xl text-primary">{attendanceData.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Percentage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {subjects.map(subject => {
          const percentage = getAttendancePercentage(subject);
          return (
            <div key={subject} className="card bg-base-100 shadow-md border border-base-300 hover:shadow-lg transition-shadow">
              <div className="card-body p-4">
                <h3 className="card-title text-base">{subject}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-bold">{percentage}%</span>
                </div>
                <progress 
                  className={`progress ${percentage < 75 ? 'progress-error' : 'progress-success'} w-full`}
                  value={percentage} 
                  max="100"
                ></progress>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance Table */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="table table-pin-rows table-pin-cols w-full min-w-[700px]">
                <thead>
                  <tr className="bg-base-200">
                    <th className="sticky left-0 z-20 bg-base-200 min-w-[120px] sm:min-w-[150px] border-r-2 border-base-300">
                      Subject
                    </th>
                    {dates.map(date => (
                      <th key={date} className="text-center whitespace-nowrap min-w-[100px] sm:min-w-[120px]">
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {subjects.map((subject, idx) => (
                    <tr key={subject} className={idx % 2 === 0 ? 'bg-base-100' : 'bg-base-200/50'}>
                      <th className="sticky left-0 z-10 bg-inherit font-semibold text-sm sm:text-base min-w-[120px] sm:min-w-[150px] border-r-2 border-base-300">
                        {subject}
                      </th>
                      {dates.map(date => {
                        const status = getStatus(subject, date);
                        let cellClass = "";
                        if (status === "Present") cellClass = "bg-green-200 text-green-900";
                        else if (status === "Absent") cellClass = "bg-red-200 text-red-900";

                        return (
                          <td key={date} className={`text-center p-2 font-medium ${cellClass}`}>
                            {status === "-" ? "---" : status}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start items-center p-4 bg-base-100 shadow rounded-lg">
        <span className="text-sm font-semibold">Legend:</span>
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-green-200 rounded-md border border-green-400"></span>
          <span className="text-sm">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-red-200 rounded-md border border-red-400"></span>
          <span className="text-sm">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-base-100 border border-base-300 rounded-md"></span>
          <span className="text-sm">Not Marked</span>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceView;
