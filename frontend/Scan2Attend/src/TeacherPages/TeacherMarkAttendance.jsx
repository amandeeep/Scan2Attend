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
    const [confirmModal, setConfirmModal] = useState({ 
        open: false, 
        studentId: null, 
        date: null, 
        action: null 
    });

    
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
        const key = `${studentId}|${date}`;
        if (updatedAttendance[key]) return updatedAttendance[key];
        
        const record = attendanceRecords.find((r) => r.studentID === studentId && new Date(r.date).toISOString().split('T')[0] === date);
        return record ? record.status : "-";
    }
    const markAttendanceRecord = async(e) => {
        e.preventDefault();
        
        const hasAbsentChanges = Object.entries(tempStatuses).some(([key, status]) => {
            return status === "Absent";
        });
        
        if (hasAbsentChanges) {
            setConfirmModal({ 
                open: true, 
                studentId: null, 
                date: null, 
                action: 'markAttendance' 
            });
            return;
        }
        
        await saveMarkAttendance();
    }
    
    const saveMarkAttendance = async() => {
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
            
            await markAttendance(dataToSend);
            setTempStatuses({});
            setMarkingMode(false);
            await fetchAttendance(new Event("submit"));
            document.getElementById("success_modal").showModal();
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


    const handleToggleStatus = (studentId, date) => {
        const currentStatus = getStatus(studentId, date);
        const key = `${studentId}|${date}`;

        if (currentStatus === "-") return; // skip unmarked cells

      
        const newStatus = currentStatus === "Present" ? "Absent" : "Present";

        if (newStatus === "Absent") {
            setConfirmModal({ 
                open: true, 
                studentId, 
                date, 
                action: 'toggleUpdate' 
            });
            return;
        }

        setUpdatedAttendance((prev) => ({
            ...prev,
            [key]: newStatus,
        }));
    }

    const handleSaveUpdates = async (e) => {
        e.preventDefault();
        
        const hasAbsentChanges = Object.entries(updatedAttendance).some(([key, status]) => {
            return status === "Absent";
        });
        
        if (hasAbsentChanges) {
            setConfirmModal({ 
                open: true, 
                studentId: null, 
                date: null, 
                action: 'saveUpdates' 
            });
            return;
        }
        
        await saveUpdates();
    }
    
    const saveUpdates = async () => {
        const updates = Object.entries(updatedAttendance).map(([key, status]) => {
            const [studentID, date] = key.split('|');
            return { studentID, subjectCode: attendanceData.code, department: attendanceData.department, date, status };
        });

        if (updates.length === 0) return;

        setLoading(true);
        try {
            await updateAttendance({ updates });
            setEditMode(false);
            setUpdatedAttendance({});
            await fetchAttendance(new Event("submit"));
            document.getElementById("success_modal").showModal();
        } catch (err) {
            console.error("Error updating attendance:", err);
            setError(err.message || "Error updating attendance.");
        } finally {
            setLoading(false);
        }
    }

    const confirmAbsentChange = () => {
        const { studentId, date, action } = confirmModal;
        
        if (action === 'toggleUpdate') {
           
            const key = `${studentId}|${date}`;
            setUpdatedAttendance((prev) => ({
                ...prev,
                [key]: "Absent",
            }));
        } else if (action === 'markAttendance') {
            
            saveMarkAttendance();
        } else if (action === 'saveUpdates') {
            
            saveUpdates();
        }
        
        setConfirmModal({ open: false, studentId: null, date: null, action: null });
    }

    const getCellStatus = (studentId, date) => {
        const actualStatus = getStatus(studentId, date);
        if(actualStatus !== '-') return actualStatus;
        
        const key = `${studentId}|${date}`;
        return tempStatuses[key] || "-";
    }
    
    const isNewlyMarked = (studentId, date) => {
        const key = `${studentId}|${date}`;
        return tempStatuses.hasOwnProperty(key) || updatedAttendance.hasOwnProperty(key);
    }

    return(
        <div>
            <div className="p-4">
                <h2 className="mb-4 text-lg sm:text-xl font-semibold">Mark Attendance</h2>
                <div>
                    <form onSubmit={(e) => { fetchStudent(e); fetchAttendance(e); }}>
                        <input 
                            type="text" 
                            placeholder="Subject Code" 
                            className='input input-bordered w-full'
                            value={attendanceData.code} 
                            onChange={(e) => setAttendanceData({...attendanceData, code: e.target.value.toUpperCase().replace(/\s+/g, '')})} 
                            required
                        />
                        <div className="flex flex-col space-y-2">
                            <select
                                className="select select-bordered w-full"
                                value={attendanceData.department}
                                onChange={(e) => setAttendanceData({ ...attendanceData, department: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="MECHANICAL">MECHANICAL</option>
                                <option value="IT">IT</option>
                                <option value="ECE">ECE</option>
                            </select>
                        </div>
                        <button className="btn btn-primary mt-4 w-full" type="submit">Get Students</button>
                    </form>
                    
                    {loading && <div className="mt-4 text-blue-600">Loading attendance...</div>}
                    {error && <div className="text-red-500 mt-2 mb-2">Error: {error}</div>}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {/* Mark Attendance Button */}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setMarkingMode(prev => !prev);
                                if(markingMode) {
                                    setTempStatuses({});
                                }
                                if(!markingMode) {
                                    setEditMode(false);
                                    setUpdatedAttendance({});
                                }
                            }}
                        >
                            {markingMode ? "Cancel Mark" : "Mark Attendance"}
                        </button>
                        
                        {/* Save Mark Attendance Button */}
                        {markingMode && (
                            <button
                                type="button"
                                className="btn btn-accent"
                                onClick={markAttendanceRecord}
                                disabled={Object.keys(tempStatuses).length === 0}
                            >
                                Save Attendance ({Object.keys(tempStatuses).length})
                            </button>
                        )}
                        
                        {/* Edit Attendance Button */}
                        {attendanceRecords.length > 0 && !markingMode && (
                            <button
                                type="button"
                                className={`btn ${editMode ? "btn-warning" : "btn-info"}`}
                                onClick={() => {
                                    setEditMode(prev => !prev);
                                    if(editMode) {
                                        setUpdatedAttendance({});
                                    }
                                }}
                            >
                                {editMode ? "Cancel Edit" : "Edit Attendance"}
                            </button>
                        )}
                        
                        {/* Save Updates Button */}
                        {editMode && (
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleSaveUpdates}
                                disabled={Object.keys(updatedAttendance).length === 0}
                            >
                                Save Updates ({Object.keys(updatedAttendance).length})
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Attendance Table */}
                <div className="overflow-auto border border-base-300 rounded-lg shadow-sm max-h-[28rem] mt-4">
                    <table className="table table-zebra w-full min-w-[600px] sm:min-w-[700px] md:min-w-[800px]">
                        <thead className="sticky top-0 bg-base-200 z-20">
                            <tr>
                                <th className="sticky left-0 bg-base-200 z-30 shadow-md min-w-[8rem] text-sm sm:text-base">
                                    Student Id
                                </th>
                                {dates.map((date) => (
                                    <th key={date} className="sticky top-0 text-center whitespace-nowrap text-sm sm:text-base">
                                        {date}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {studentList.map((student) => (
                                <tr key={student.studentId}>
                                    <th className="sticky left-0 bg-base-100 z-10 shadow-md font-medium text-sm sm:text-base min-w-[8rem]">
                                        {student.studentId}
                                    </th>
                                    {dates.map((date) => {
                                        const status = getStatus(student.studentId, date);
                                        const displayStatus = status === '-' ? getCellStatus(student.studentId, date) : status;
                                        const isUpdated = updatedAttendance.hasOwnProperty(`${student.studentId}|${date}`);
                                        const isNewlyMarkedCell = tempStatuses.hasOwnProperty(`${student.studentId}|${date}`);
                                        
                                        let cellClass = "";
                                        
                                        if(displayStatus === "Present") {
                                            if(isNewlyMarkedCell) {
                                                cellClass = "bg-green-500 text-white border-2 border-green-700 font-semibold shadow-lg";
                                            } else if(isUpdated) {
                                                cellClass = "bg-green-200 text-green-900 border-2 border-yellow-500 font-semibold";
                                            } else {
                                                cellClass = "bg-green-200 text-green-900";
                                            }
                                        } else if(displayStatus === "Absent") {
                                            if(isNewlyMarkedCell) {
                                                cellClass = "bg-red-500 text-white border-2 border-red-700 font-semibold shadow-lg";
                                            } else if(isUpdated) {
                                                cellClass = "bg-red-200 text-red-900 border-2 border-yellow-500 font-semibold";
                                            } else {
                                                cellClass = "bg-red-200 text-red-900";
                                            }
                                        } else {
                                            cellClass = "bg-gray-100 text-gray-500";
                                        }
                                        
                                        const isClickable = markingMode && status === "-";
                                        const isEditable = editMode && status !== "-";
                                        
                                        return(
                                            <td 
                                                key={date}
                                                className={`text-center text-sm sm:text-base px-2 ${cellClass} ${isClickable || isEditable ? "cursor-pointer hover:bg-blue-100 hover:border-2 hover:border-blue-400 transition-all" : ""}`} 
                                                onClick={() => {
                                                    if (markingMode && status === "-") {
                                                        handleCellClick(student.studentId, date, status);
                                                    } else if (editMode && status !== "-") {
                                                        handleToggleStatus(student.studentId, date);
                                                    }
                                                }}
                                            >
                                                {displayStatus}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Absent Confirmation Modal */}
                {confirmModal.open && (
                    <dialog id="absent_modal" className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg text-red-600">⚠️ Confirm Absent Marking</h3>
                            <p className="py-3">
                                {confirmModal.action === 'markAttendance' || confirmModal.action === 'saveUpdates' 
                                    ? "You are about to mark one or more students as Absent. Are you sure you want to proceed?"
                                    : "Are you sure you want to mark this student as Absent?"}
                            </p>
                            <div className="modal-action">
                                <button
                                    className="btn btn-error"
                                    onClick={confirmAbsentChange}
                                >
                                    Yes, Mark Absent
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => setConfirmModal({ open: false, studentId: null, date: null, action: null })}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </dialog>
                )}

                {/* Success Modal */}
                <dialog id="success_modal" className="modal">
                    <div className="modal-box text-center">
                        <h3 className="text-lg font-bold text-green-600">
                            ✓ Attendance saved successfully!
                        </h3>
                        <div className="modal-action justify-center">
                            <form method="dialog">
                                <button className="btn btn-success">OK</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    )
}

export default TeacherMarkAttendance;