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
    const [markingMode, setMarkingMode] = useState(false);
    const [tempStatuses, setTempStatuses] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [updatedAttendance, setUpdatedAttendance] = useState({});
    const [confirmModal, setConfirmModal] = useState({ open: false, studentId: null, date: null });


    
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

    const markAttendanceRecord = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            setError(null);
            
            const attendanceList = Object.entries(tempStatuses).map(([key, status]) => {
                const [studentID, date] = key.split('|');
                return { studentID, status, date };
            });
            
            if(!attendanceData.code || !attendanceData.department || attendanceList.length === 0){
                setError("Please mark at least one attendance before saving");
                return;
            }
            
            const dataToSend = {
                subjectCode: attendanceData.code,
                department: attendanceData.department,
                attendanceList: attendanceList
            };
            
            const res = await markAttendance(dataToSend);
            setTempStatuses({}); 
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
        if(!markingMode || currentStatus !== '-') return;
        
        const key = `${studentId}|${date}`;
        
        setTempStatuses(prev => {
            const currentTemp = prev[key] || "Present";
            const newStatus = currentTemp === "Present" ? "Absent" : "Present";
            return {
                ...prev,
                [key]: newStatus
            };
        });
    }

    const getCellStatus = (studentId, date) => {
        const actualStatus = getStatus(studentId, date);
        if(actualStatus !== '-') return actualStatus;
        
        const key = `${studentId}|${date}`;
        return tempStatuses[key] || "-";
    }
    
    const isNewlyMarked = (studentId, date) => {
        const key = `${studentId}|${date}`;
        return tempStatuses.hasOwnProperty(key);
    }

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
                    onClick={() => {
                        setMarkingMode(prev => !prev);
                        if(markingMode) {
                            setTempStatuses({}); // Clear temp statuses when canceling
                        }
                    }}
                    >
                    {markingMode ? "Cancel Attendance" : "Mark Attendance"}
                    </button>
                    {markingMode && (
                    <button
                    type="button"
                    className="btn btn-accent mb-4"
                    onClick={markAttendanceRecord}
                    disabled={Object.keys(tempStatuses).length === 0}
                    >
                    Save Attendance ({Object.keys(tempStatuses).length})
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
                                        const displayStatus = status === '-' ? getCellStatus(student.studentId, date) : status;
                                        const isMarkedNow = isNewlyMarked(student.studentId, date);
                                        let cellClass = "";
                                        
                                        if(displayStatus === "Present") {
                                            cellClass = isMarkedNow 
                                                ? "bg-green-500 text-green-900 border-2 border-green-600 font-semibold" 
                                                : "bg-green-200 text-green-900";
                                        } else if(displayStatus === "Absent") {
                                            cellClass = isMarkedNow 
                                                ? "bg-red-500 text-red-900 border-2 border-red-600 font-semibold text-xl" 
                                                : "bg-red-200 text-red-900";
                                        } else {
                                            cellClass = "bg-gray-100 text-gray-500";
                                        }
                                        
                                        const isClickable = markingMode && status === "-";
                                        return(
                                            <td key={date}
                                            className={`text-center text-sm sm:text-base px-2 ${cellClass} ${isClickable ? "cursor-pointer hover:bg-blue-100 hover:border-2 hover:border-blue-400" : ""}`} 
                                            onClick = {() => handleCellClick(student.studentId, date, status)}>
                                                {displayStatus}
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