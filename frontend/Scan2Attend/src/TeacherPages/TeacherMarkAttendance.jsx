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
            setError(err.message || "Error fetching student list");
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

        if (currentStatus === "-") return;

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
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
                
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-2 flex items-center gap-2">
                        <span className="text-3xl sm:text-4xl">📋</span>
                        Mark Attendance
                    </h1>
                    <p className="text-sm sm:text-base text-base-content/70">
                        Track and manage student attendance efficiently
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error shadow-lg mb-4 sm:mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm sm:text-base">{error}</span>
                        <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>✕</button>
                    </div>
                )}

                {/* Search Card */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body p-4 sm:p-6">
                        <h2 className="card-title text-lg sm:text-xl mb-4">
                            🔍 Subject Details
                        </h2>
                        
                        <form onSubmit={(e) => { fetchStudent(e); fetchAttendance(e); }} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Subject Code */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-sm sm:text-base">Subject Code</span>
                                        <span className="label-text-alt text-error text-xs sm:text-sm">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., CS201" 
                                        className='input input-bordered w-full text-sm sm:text-base'
                                        value={attendanceData.code} 
                                        onChange={(e) => setAttendanceData({...attendanceData, code: e.target.value.toUpperCase().replace(/\s+/g, '')})} 
                                        required
                                    />
                                </div>

                                {/* Department */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-sm sm:text-base">Department</span>
                                        <span className="label-text-alt text-error text-xs sm:text-sm">*</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full text-sm sm:text-base"
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
                            </div>

                            <button 
                                className={`btn btn-primary w-full text-sm sm:text-base `} 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Get Students & Attendance
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Action Buttons Card */}
                {studentList.length > 0 && (
                    <div className="card bg-base-100 shadow-xl mb-6">
                        <div className="card-body p-4 sm:p-6">
                            <h2 className="card-title text-lg sm:text-xl mb-4">
                                ⚡ Quick Actions
                            </h2>
                            
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {/* Mark Attendance Button */}
                                <button
                                    type="button"
                                    className="btn btn-secondary flex-1 sm:flex-none text-sm sm:text-base"
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
                                    {markingMode ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel Mark
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                            Mark Attendance
                                        </>
                                    )}
                                </button>
                                
                                {/* Save Mark Attendance Button */}
                                {markingMode && (
                                    <button
                                        type="button"
                                        className="btn btn-accent flex-1 sm:flex-none text-sm sm:text-base"
                                        onClick={markAttendanceRecord}
                                        disabled={Object.keys(tempStatuses).length === 0}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        Save Attendance ({Object.keys(tempStatuses).length})
                                    </button>
                                )}
                                
                                {/* Edit Attendance Button */}
                                {attendanceRecords.length > 0 && !markingMode && (
                                    <button
                                        type="button"
                                        className={`btn ${editMode ? "btn-warning" : "btn-info"} flex-1 sm:flex-none text-sm sm:text-base`}
                                        onClick={() => {
                                            setEditMode(prev => !prev);
                                            if(editMode) {
                                                setUpdatedAttendance({});
                                            }
                                        }}
                                    >
                                        {editMode ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel 
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit Attendance
                                            </>
                                        )}
                                    </button>
                                )}
                                
                                {/* Save Updates Button */}
                                {editMode && (
                                    <button
                                        type="button"
                                        className="btn btn-success flex-1 sm:flex-none text-sm sm:text-base"
                                        onClick={handleSaveUpdates}
                                        disabled={Object.keys(updatedAttendance).length === 0}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save  ({Object.keys(updatedAttendance).length})
                                    </button>
                                )}
                            </div>

                            {/* Mode Indicator */}
                            {(markingMode || editMode) && (
                                <div className={`alert ${markingMode ? 'alert-info' : 'alert-warning'} shadow-sm mt-4`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5 sm:w-6 sm:h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div className="text-xs sm:text-sm">
                                        {markingMode ? (
                                            <span><strong>Mark Mode Active:</strong> Click empty cells to toggle Present/Absent</span>
                                        ) : (
                                            <span><strong>Edit Mode Active:</strong> Click marked cells to update attendance</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Attendance Table */}
                {studentList.length > 0 && (
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="card-title text-lg sm:text-xl">
                                    📊 Attendance Sheet
                                </h2>
                                <div className="badge badge-primary badge-lg text-xs sm:text-sm">
                                    {studentList.length} Students
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 p-3 bg-base-200 rounded-lg">
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-green-700 rounded"></div>
                                    <span className="font-semibold">Newly Marked</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-200 border-2 border-yellow-500 rounded"></div>
                                    <span className="font-semibold">Updated</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-200 rounded"></div>
                                    <span>Present</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-200 rounded"></div>
                                    <span>Absent</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 rounded"></div>
                                    <span>Not Marked</span>
                                </div>
                            </div>

                            <div className="overflow-auto border border-base-300 rounded-lg shadow-sm max-h-[28rem]">
                                <table className="table table-zebra w-full min-w-[600px] sm:min-w-[700px] md:min-w-[800px]">
                                    <thead className="sticky top-0 bg-base-200 z-20">
                                        <tr>
                                            <th className="sticky left-0 bg-base-200 z-30 shadow-md min-w-[8rem] text-sm sm:text-base">
                                                Student ID
                                            </th>
                                            {dates.map((date) => (
                                                <th key={date} className="sticky top-0 text-center whitespace-nowrap text-xs sm:text-sm px-1 sm:px-2">
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
                                                            className={`text-center text-xs sm:text-sm px-1 sm:px-2 ${cellClass} ${isClickable || isEditable ? "cursor-pointer hover:bg-blue-100 hover:border-2 hover:border-blue-400 transition-all" : ""}`} 
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
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {studentList.length === 0 && !loading && (
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center p-8 sm:p-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 sm:h-24 sm:w-24 text-base-content/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">No Students Found</h3>
                            <p className="text-base-content/70 text-sm sm:text-base">
                                Enter subject code and department to load student list
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Absent Confirmation Modal */}
                {confirmModal.open && (
                    <dialog id="absent_modal" className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg sm:text-xl text-error flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Confirm Absent Marking
                            </h3>
                            <p className="py-4 text-sm sm:text-base">
                                {confirmModal.action === 'markAttendance' || confirmModal.action === 'saveUpdates' 
                                    ? "⚠️ You are about to mark one or more students as Absent. This action will be recorded. Are you sure you want to proceed?"
                                    : "⚠️ Are you sure you want to mark this student as Absent?"}
                            </p>
                            <div className="modal-action">
                                <button
                                    className="btn btn-error text-sm sm:text-base"
                                    onClick={confirmAbsentChange}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Yes, Mark Absent
                                </button>
                                <button
                                    className="btn btn-ghost text-sm sm:text-base"
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
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-success/20 p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-success mb-2">
                            Success!
                        </h3>
                        <p className="text-sm sm:text-base text-base-content/70 mb-4">
                            Attendance has been saved successfully
                        </p>
                        <div className="modal-action justify-center">
                            <form method="dialog">
                                <button className="btn btn-success text-sm sm:text-base">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    OK
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>

            </div>
        </div>
    )
}

export default TeacherMarkAttendance;