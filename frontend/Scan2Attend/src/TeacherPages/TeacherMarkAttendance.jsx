import {useState} from "react";
import { getStudentSubjects } from "../lib/subjectApi";
import { getAttendance, updateAttendance, markAttendance} from "../lib/attendanceApi";

const TeacherMarkAttendance = () => {
    const [attendanceData, setAttendanceData] = useState({
        code: "",
        department: "",
    });
    const [studentList, setStudentList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [attendanceUpdates, setAttendanceUpdates] = useState({});
    const [updateMode, setUpdateMode] = useState(false);
    const [markData, setMarkData] = useState({
        subjectCode: attendanceData.code,
        department: attendanceData.department,
        
        attendanceList: [
            {studentID: "",
             status: "",
             date: new Date().toISOString().split('T')[0]}
        ]
    })
    const [markingMode, setMarkingMode] = useState(false); // use for allow teacher to mark attendance
    const [editableDates, setEditableDates] = useState(Array(11).fill(false));


    
    const getLastNDate = (n) => {
        const dates = [];
        const today = new Date();
        for(let i = 0; i<n; i++){
            const date = new Date();
            date.setDate(today.getDate()-i);
            const formatted = date.toISOString().split('T')[0];
            dates.push(formatted);
        }
        return dates.reverse();
    }
    const dates = getLastNDate(11);

    const fetchStudent = async(e) => {
            e.preventDefault();
        try{
            const list = await getStudentSubjects(attendanceData);
            const allStudents = list.data.flatMap(subject => subject.studentInfo);
            setStudentList(allStudents);
        }catch(err){
            console.error("Error in fetching student list: ", err);
        }
    }
    const fetchAttendance = async(e) => {
        e.preventDefault();
        if(!attendanceData.code || !attendanceData.department){
            setError("Please provide subject code and department");
            return;
        } 
        setLoading(true);
        setError(null);
        try{
            const params = {role: "teacher", subjectCode: attendanceData.code, department: attendanceData.department};
            const res = await getAttendance(params);
            setAttendanceRecords(res.data || []);
            setAttendanceUpdates({});
            
        }catch(err){
            console.error("Error in fetching attendance records: ", err);
            setError(err.message || "Error in fetching attendance records");
            setAttendanceRecords([]);
        }finally{
            setLoading(false);
        }
    }
    
    const getStatus = (studentId, date) => {
        const record = attendanceRecords.find((r) => r.studentID === studentId && new Date(r.date).toISOString().split('T')[0] === date);
        return record ? record.status : "-";
    }
//     const getStatus = (studentId, date) => {
//   // Check for unsaved local changes first
//   const localChange = markData.attendanceList.find(
//     (entry) => entry.studentID === studentId && entry.date === date
//   );

//   if (localChange) return localChange.status;

//   // If no local change, check fetched attendance records

//   const record = attendanceRecords.find(
//     (r) =>
//       r.studentID === studentId &&
//       new Date(r.date).toISOString().split("T")[0] === date
//   );

//   return record ? record.status : "-";
// };


    const markAttendanceRecord = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            setError(null);
            if(!markData.subjectCode || !markData.department || (markData.attendanceList.length === 0)){
                setError("Please provide all required fields to mark attendance");
                return;
            }
            const res = await markAttendance(markData);
            setMarkData({
                subjectCode: "",
                department: "",
                attendanceList: [],
            });
            setMarkingMode(false);
            await fetchAttendance(new Event("submit"));
        }catch(err){
            console.error("Error in marking attendance: ",err);
            setError(err.message || "Error in marking attendance");
        }finally{
            setLoading(false);
        }
    }

    const handleCellClick = (studentId, date, currentStatus) => {
  // Only allow marking in markingMode AND only if the current status is "-"
  if (!markingMode || currentStatus !== "-") return;

  setMarkData((prev) => {
    let updatedList = [...prev.attendanceList];
    const existingIndex = updatedList.findIndex(
      (entry) => entry.studentID === studentId && entry.date === date
    );

    if (existingIndex >= 0) {
      // Toggle between Present and Absent
      updatedList[existingIndex].status =
        updatedList[existingIndex].status === "Present" ? "Absent" : "Present";
    } else {
      // First time marking → mark as Present
      updatedList.push({ studentID: studentId, status: "Present", date });
    }

    return {
      ...prev,
      subjectCode: attendanceData.code,
      department: attendanceData.department,
      attendanceList: updatedList,
    };
  });
};


    return(
        <div>
            <div className="p-4">
                <h2 className="mb-4 text-lg sm:text-xl font-semibold">Mark Attendance</h2>
                <div>
                    <form onSubmit={(e) => { fetchStudent(e); fetchAttendance(e); }}>
                    <input type="text" placeholder="Subject Code" className=' input input-bordered w-full'
                    value = {attendanceData.code} onChange={(e) => setAttendanceData({...attendanceData, code: e.target.value.toUpperCase().replace(/\s+/g, '')})} required/>
                    <div className="flex flex-col space-y-2">
                    <select
                    className="select select-bordered w-full"
                    value={attendanceData.department}
                    onChange={(e) => setAttendanceData({ ...attendanceData, department: e.target.value })}
                    required
                    >
                    <option value="" disabled>
                        Select Department
                    </option>
                    <option value="CSE">CSE</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MECHANICAL">MECHANICAL</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    </select>
                    </div>
                    <button className="btn btn-primary mt-4 w-full" type="submit">Get Students</button>
                    </form>
                    {loading && <div>Loading attendance...</div>}
                    {error && <div className="text-red-500 mb-2">Error: {error}</div>}
                    <button
                    type="button"
                    className="btn btn-secondary mb-4"
                    onClick={() => setMarkingMode(prev => !prev)}
                    >
                    {markingMode ? "Cancel Attendance" : "Mark Attendance"}
                    </button>
                    {markingMode && (
                    <button
                    type="button"
                    className="btn btn-accent mb-4"
                    onClick={markAttendanceRecord}
                    disabled={markData.attendanceList.length === 0}
                    >
                    Save Attendance
                    </button>)}
                </div>
                <div className="overflow-auto border border-base-300 rounded-lg shadow-sm max-h-[28rem]">
                    <table className="table table-zebra w-full min-w-[600px] sm:min-w-[700px] md:min-w-[800px]">
                        <thead className="sticky top-0 bg-base-200 z-20">
                            <tr>
                                <th className="sticky left-0 bg-base-200 z-30 shadow-md min-w-[8rem] text-sm sm:text-base">
                                    Student Id
                                </th>
                                {dates.map((date) => (
                                    <th key = {date} className="sticky top-0
                                    text-center whitespace-nowrap text-sm
                                    sm:text-base">{date}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {studentList.map((student) => (
                                <tr key = {student.studentId}>
                                    <th className="sticky left-0 bg-base-100 z-10 shadow-md font-medium text-sm sm:text-base min-w-[8rem]">{student.studentId}</th>
                                    {dates.map((date) => {
                                        const status = getStatus(student.studentId, date);
                                        let cellClass = "";
                                        if(status === "Present") cellClass = "bg-green-200 text-green-900";
                                        else if(status === "Absent") cellClass ="bg-red-200 text-red-900"
                                        const isClickable = markingMode || status === "-";
                                        return(
                                            <td key={date}
                                            className={`text-center text-sm sm:text-base px-2 ${cellClass} ${isClickable ? "cursor-pointer" : ""}`} onClick = {(e) => handleCellClick(student.studentId, date, status)}>
                                                {status}
                                            </td>
                                        )
                                    })}
                                </tr>
                                
                            ))}
                        </tbody>

                    </table>

                </div>

            </div>
        </div>
    )
}

export default TeacherMarkAttendance;



