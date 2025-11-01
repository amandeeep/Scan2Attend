import { useEffect, useState, useMemo } from "react";
import { getAttendance } from "../lib/attendanceApi.js";

const StudentAttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const params = {
          date: today,
          subjectCode: "BEC501",
        };
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
    () => [...new Set(attendanceData.map((r) => r.subjectCode))],
    [attendanceData]
  );

  const dates = useMemo(
    () =>
      [...new Set(attendanceData.map((r) => new Date(r.date).toISOString().split("T")[0]))].sort(),
    [attendanceData]
  );

  const getStatus = (subject, date) => {
    const record = attendanceData.find(
      (r) =>
        r.subjectCode === subject &&
        new Date(r.date).toISOString().split("T")[0] === date
    );
    return record ? record.status : "-";
  };

  if (loading) return <div>Loading attendance...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg sm:text-xl font-semibold">Student Attendance</h2>

      <div className="overflow-auto border border-base-300 rounded-lg shadow-sm max-h-[28rem]">
        <table className="table table-zebra w-full min-w-[600px] sm:min-w-[700px] md:min-w-[800px]">
          <thead className="sticky top-0 bg-base-200 z-20">
            <tr>
              <th
                className="sticky left-0 bg-base-200 z-30 shadow-md min-w-[8rem] text-sm sm:text-base"
              >
                Subject
              </th>
              {dates.map((date) => (
                <th key={date} className="text-center whitespace-nowrap text-sm sm:text-base">
                  {date}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject) => (
              <tr key={subject}>
                <th
                  className="sticky left-0 bg-base-100 z-10 shadow-md font-medium text-sm sm:text-base min-w-[8rem]"
                >
                  {subject}
                </th>
                {dates.map((date) => {
                  const status = getStatus(subject, date);
                  let cellClass = "";
                  if (status === "Present") cellClass = "bg-green-200 text-green-900";
                  else if (status === "Absent") cellClass = "bg-red-200 text-red-900";

                  return (
                    <td key={date} className={`text-center text-sm sm:text-base ${cellClass}`}>
                      {status}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendanceView;
