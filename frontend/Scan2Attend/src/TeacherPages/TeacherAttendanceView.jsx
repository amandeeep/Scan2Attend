


// import { useState, useMemo } from "react";
// import { getAttendance, updateAttendance } from "../lib/attendanceApi";

// const TeacherAttendanceView = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [subjectCode, setSubjectCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [updatedAttendance, setUpdatedAttendance] = useState({});
//   const [confirmModal, setConfirmModal] = useState({ open: false, studentId: null, date: null });

//   const fetchAttendance = async () => {
//     if (!subjectCode.trim()) {
//       setError("Please enter a subject code");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const params = { role: "teacher", subjectCode };
//       const res = await getAttendance(params);
//       setAttendanceData(res.data || []);
//       setUpdatedAttendance({});
//     } catch (err) {
//       console.error("Error fetching attendance:", err);
//       setError(err.message || "Something went wrong");
//       setAttendanceData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const studentIds = useMemo(
//     () => [...new Set(attendanceData.map((r) => r.studentID))].sort(),
//     [attendanceData]
//   );

//   const dates = useMemo(
//     () =>
//       [...new Set(attendanceData.map((r) => new Date(r.date).toISOString().split("T")[0]))].sort(),
//     [attendanceData]
//   );

//   const getStatus = (studentId, date) => {
//     const key = `${studentId}-${date}`;
//     if (updatedAttendance[key]) return updatedAttendance[key];
//     const record = attendanceData.find(
//       (r) =>
//         r.studentID === studentId &&
//         new Date(r.date).toISOString().split("T")[0] === date
//     );
//     return record ? record.status : "-";
//   };

//   const handleToggleStatus = (studentId, date) => {
//     const key = `${studentId}-${date}`;
//     const current = getStatus(studentId, date);
//     const newStatus = current === "Present" ? "Absent" : "Present";

//     if (newStatus === "Absent") {
//       setConfirmModal({ open: true, studentId, date });
//       return;
//     }
                                             
//     setUpdatedAttendance((prev) => ({
//       ...prev,
//       [key]: newStatus,
//     }));
//   };

//   const confirmAbsentChange = () => {
//     const { studentId, date } = confirmModal;
//     const key = `${studentId}-${date}`;
//     setUpdatedAttendance((prev) => ({
//       ...prev,
//       [key]: "Absent",
//     }));
//     setConfirmModal({ open: false, studentId: null, date: null });
//   };

//   const handleSaveUpdates = async () => {
//     const updates = Object.entries(updatedAttendance).map(([key, status]) => {
//       const [studentID, ...dateParts] = key.split("-");
//       const date = dateParts.join("-");
//       return { studentID, subjectCode, date, status };
//     });


//     if (updates.length === 0) return;

//     setLoading(true);
//     try {
//       const res = await updateAttendance({ updates });
//       setEditMode(false);
//       await fetchAttendance();
//       document.getElementById("success_modal").showModal();
//     } catch (err) {
//       console.error("Error updating attendance:", err);
//       setError(err.message || "Error updating attendance.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Action Bar */}
//       <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
//         <input
//           type="text"
//           value={subjectCode}
//           onChange={(e) => setSubjectCode(e.target.value)}
//           placeholder="Enter Subject Code"
//           className="input input-bordered w-full sm:w-auto"
//         />
//         <button onClick={fetchAttendance} className="btn btn-primary">
//           Fetch Attendance
//         </button>

//         {attendanceData.length > 0 && !loading && (
//           <button
//             onClick={() => (editMode ? handleSaveUpdates() : setEditMode(true))}
//             className={`btn ${editMode ? "btn-success" : "btn-warning"}`}
//           >
//             {editMode ? "Save Updates" : "Edit Attendance"}
//           </button>
//         )}
//       </div>

//       {/* Feedback */}
//       {loading && <div>Loading attendance...</div>}
//       {error && <div className="text-red-500 mb-2">Error: {error}</div>}

//       {/* Attendance Table */}
//       {attendanceData.length > 0 && !loading && !error && (
//         <div className="overflow-auto border border-base-300 rounded-lg shadow-sm max-h-[28rem]">
//           <table className="table table-zebra w-full min-w-[600px]">
//             <thead className="sticky top-0 bg-base-200 z-20">
//               <tr>
//                 <th className="sticky left-0 bg-base-200 z-30 shadow-md text-sm sm:text-base w-28 sm:w-32 min-w-[6rem] sm:min-w-[8rem] max-w-[10rem] truncate">
//                   Student IDs
//                 </th>
//                 {dates.map((date) => (
//                   <th key={date} className="text-center whitespace-nowrap text-sm sm:text-base px-2">
//                     {date}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {studentIds.map((id) => (
//                 <tr key={id}>
//                   <th className="sticky left-0 bg-base-100 z-10 shadow-md font-medium text-sm sm:text-base w-28 sm:w-32 min-w-[6rem] sm:min-w-[8rem] max-w-[10rem] truncate">
//                     {id}
//                   </th>
//                   {dates.map((date) => {
//                     const status = getStatus(id, date);
//                     let cellClass = "";
//                     if (status === "Present")
//                       cellClass = "bg-green-200 text-green-900";
//                     else if (status === "Absent")
//                       cellClass = "bg-red-200 text-red-900";
//                     return (
//                       <td
//                         key={date}
//                         className={`text-center ${cellClass} ${
//                           editMode ? "cursor-pointer hover:bg-base-300" : ""
//                         }`}
//                         onClick={() => editMode && handleToggleStatus(id, date)}
//                       >
//                         {status}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Absent Confirmation Modal */}
//       {confirmModal.open && (
//         <dialog id="absent_modal" className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg text-red-600">Confirm Change</h3>
//             <p className="py-3">
//               Are you sure you want to mark this student as <b>Absent</b>?
//             </p>
//             <div className="modal-action">
//               <button
//                 className="btn btn-error"
//                 onClick={confirmAbsentChange}
//               >
//                 Yes, Mark Absent
//               </button>
//               <button
//                 className="btn"
//                 onClick={() =>
//                   setConfirmModal({ open: false, studentId: null, date: null })
//                 }
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </dialog>
//       )}

//       {/* Success Popup */}
//       <dialog id="success_modal" className="modal">
//         <div className="modal-box text-center">
//           <h3 className="text-lg font-bold text-green-600">
//             Attendance updated successfully!
//           </h3>
//           <div className="modal-action justify-center">
//             <form method="dialog">
//               <button className="btn btn-success">OK</button>
//             </form>
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// };

// export default TeacherAttendanceView;

