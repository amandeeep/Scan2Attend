import Student from "../models/Student.js";
import College from '../models/College.js';
import Teacher from '../models/Teacher.js';
import Attendance from "../models/Attendance.js";
import Subject from "../models/Subject.js";


// export async function markAttendance (req, res){
//     try{
//         const{subjectCode, attendanceList, date, department, source = 'manual'} = req.body;
//         if(!subjectCode || !attendanceList || !date || !department) return res.status(400).json({
//             success: false,
//             message: "All fields are required"
//         });
//         const formatDate = new Date(date);
//         const id = req.params.id || null;
//         const markByTeacher = req.role  === 'teacher' ? req.id : id;
//         const markByCollege = req.role === 'college' ? req.id : null;
//         // console.log({
//         // role: req.role,
//         // teacherId: req.id,
//         // paramsId: req.params.id
//         // });
//         let teacherDetails = null;
//         if (markByTeacher) {
//             const teacher = await Teacher.findById(req.objectId)
//             if (teacher) {
//                 teacherDetails = {
//                     fullName: teacher.fullName,
//                     department: teacher.department,
//                     email: teacher.email,
//                     contactNumber: teacher.contactNumber,
//                     gender: teacher.gender,
//                     objectId:teacher._id
//                 };
//             }
//         }
 
//         // const operations = attendanceList.map((entry) => ({ // entry means one object inside attendanceList array
//         //     updateOne:{
//         //         filter:{studentID:entry.studentID, subjectCode, date:formatDate, branch},
//         //         update:{
//         //             $set:{
//         //                 status:entry.status,
//         //                 teacherId:markByTeacher,
//         //                 collegeId:markByCollege,
//         //                 source,
//         //                 branch:branch
//         //             }
//         //         },
//         //         upsert:true
//         //     }
//         // }))


//         const operations = await Promise.all(
//             attendanceList.map(async (entry) => {
//                 const student = await Student.findOne({ studentID: entry.studentID })//.lean();

//                 return {
//                     updateOne: {
//                         filter: { studentID: entry.studentID, subjectCode, date: formatDate, branch: department },
//                         update: {
//                             $set: {
//                                 status: entry.status,
//                                 teacherId: markByTeacher,
//                                 collegeId: markByCollege,
//                                 source,
//                                 branch: department,
//                                 studentDetails: student
//                                     ? {
//                                         objectId: student._id,
//                                         fullName: student.fullName,
//                                         email: student.email,
//                                         department: student.department,
//                                         semester: student.semester,
//                                         rollNumber: student.rollNumber,
//                                     }
//                                     : {},
//                                 teacherDetails: teacherDetails || {},
//                             },
//                         },
//                         upsert: true,
//                     },
//                 };
//             })
//         );

//         await Attendance.bulkWrite(operations);
//         res.status(200).json({
//             success:true,
//             message:"Attendance marked successfully"
//         })
//     }catch(err){
//         console.log("Error in markAttendance "+err);
//         res.status(500).json({
//             success: false,
//             message: "Error in markAttendance "+err.message
//         })
//     }
// }

export async function markAttendance(req, res) {
    try {
        const { subjectCode, attendanceList, department, source = 'manual' } = req.body;

        if (!subjectCode || !attendanceList || !department) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const id = req.params.id || null;
        const markByTeacher = req.role === 'teacher' ? req.id : id;
        const markByCollege = req.role === 'college' ? req.id : null;

        let teacherDetails = null;
        if (markByTeacher) {
            const teacher = await Teacher.findById(req.objectId);
            if (teacher) {
                teacherDetails = {
                    fullName: teacher.fullName,
                    department: teacher.department,
                    email: teacher.email,
                    contactNumber: teacher.contactNumber,
                    gender: teacher.gender,
                    objectId: teacher._id,
                };
            }
        }

        const studentIDs = attendanceList.map(e => e.studentID);
        const students = await Student.find({ studentID: { $in: studentIDs } });
        const studentMap = {};
        students.forEach(student => {
            studentMap[student.studentID] = student;
        });

        // Check for already marked attendance
        const dateStudentPairs = attendanceList.map(e => ({
            studentID: e.studentID,
            date: new Date(e.date)
        }));

        const alreadyMarked = await Attendance.find({
            subjectCode,
            branch: department,
            $or: dateStudentPairs.map(e => ({ studentID: e.studentID, date: e.date }))
        }).select('studentID date');

        if (alreadyMarked.length > 0) {
            const markedStudents = alreadyMarked.map(a => a.studentID);
            const markedDates = alreadyMarked.map(a => a.date.toISOString().split('T')[0]);
            return res.status(400).json({
                success: false,
                message: "Attendance already marked for some students",
                studentIDs: markedStudents,
                dates: markedDates
            });
        }

        const operations = attendanceList.map(entry => {
            if (!entry.studentID || !entry.status || !entry.date) {
                throw new Error("Each entry must have studentID, status, and date");
            }

            const student = studentMap[entry.studentID];

            return {
                updateOne: {
                    filter: {
                        studentID: entry.studentID,
                        subjectCode,
                        date: new Date(entry.date),
                        branch: department,
                    },
                    update: {
                        $set: {
                            status: entry.status,
                            teacherId: markByTeacher,
                            collegeId: markByCollege,
                            source,
                            branch: department,
                            studentDetails: student
                                ? {
                                      objectId: student._id,
                                      fullName: student.fullName,
                                      email: student.email,
                                      department: student.department,
                                      semester: student.semester,
                                      rollNumber: student.rollNumber,
                                  }
                                : {},
                            teacherDetails: teacherDetails || {},
                        },
                    },
                    upsert: true,
                },
            };
        });

        await Attendance.bulkWrite(operations);

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
        });
    } catch (err) {
        console.error("Error in markAttendance:", err);
        res.status(500).json({
            success: false,
            message: "Error in markAttendance: " + err.message,
        });
    }
}


export async function getAttendance (req, res) {
    try{
        let { date,subjectCode,  page = 1, limit = 100, department } = req.query;

        const query = {};
        page = parseInt(req.query.page) || 1;
        limit = parseInt(req.query.limit) || 100;
        limit = limit> 500? 50 : limit;
        let skip = (page-1)*limit;
        if(req.role === 'teacher' || req.query.role === "teacher"){
          let attendance;
          if(department){
            attendance = await Attendance.find({
                teacherId: req.user.teacherId, subjectCode:subjectCode, branch:department}).select("studentID date subjectCode status studentDetails").skip(skip).limit(limit);
          }
          else{
            attendance = await Attendance.find({
                teacherId: req.user.teacherId, subjectCode:subjectCode}).select("studentID date subjectCode status studentDetails").skip(skip).limit(limit);
          } 
            if(attendance.length > 0){
            return res.status(200).json({
                success: 'true',
                data: attendance,
            });
            }else{
                return res.status(400).json({
                success:true,
                message: "No attendance found for this subject"
            })
            }
        }
        if(req.role === 'student'){
            const attendance = await Attendance.find({studentID: req.user.studentID}).select("studentID date subjectCode status").skip(skip).limit(limit);
            return res.status(200).json({
                success: 'true',
                data: attendance,
            })

        }
        
        return res.json({
            message:"get attendance endpoint under construction"
        })
//         if (req.role === "student") query.studentID = req.user.studentID;
//         if (req.user.role === "teacher") query.teacherID = req.user.teacherId;
//         if (req.user.role === "college") query.collegeID = req.user.collegeCode;
//         console.log(req.role);
//         console.log(req.user.studentID)
//         if (date) query.date = new Date(date);
//         if (subjectCode) query.subjectCode = subjectCode;
// console.log("Query:", query);
//         const total = await Attendance.countDocuments(query);

//         const attendance = await Attendance.find(query)
//         //.populate("studentID", "fullName studentID")
//         //.populate("subjectCode", "subjectName subjectCode")
//         .sort({ date: -1 })
//         .skip((page - 1) * limit)
//         .limit(parseInt(limit));

//         res.status(200).json({
//         success: true,
//         total,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / limit),
//         data: attendance,
//           });
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Erro in getAttendance "+err.message
        })
    }
}


// export async function updateAttendance (req, res){
//     try{
//         if(req.role !== 'teacher' && req.role !== 'college') return res.status(400).json({
//             success: false,
//             message: "Access denied"
//         })
//         const {studentID, subjectCode, date, status} = req.body;
//         if(!studentID || !subjectCode || !date || !status) return res.status(400).json({
//             success:false,
//             message: "All fields are required"
//         })
//         const result = await Attendance.findOneAndUpdate(
//             {studentID, subjectCode, date: new Date(date)},
//             {
//                 $set:{
//                     status,
//                     teacherId: req.user.teacherId || null,
//                     collegeId: req.user.collegeId || null,
//                 },
//             },
//             {new : true}
//         );
//         if(!result) return res.status(400).json({
//             success:false,
//             message: "Attendance not found"
//         })
//         res.status(200).json({success: true, message: "Attendance updated successfully", data: result });
//     }catch(err){
//         res.status(500).json({
//             success: false,
//             message: "Error in the updateAttendance "+err.message
//         })
//     }
// }


// export async function updateAttendance(req, res) {
//   try {
//     if (req.role !== "teacher" && req.role !== "college") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });
//     }

//     const { updates } = req.body; // array of { studentID, subjectCode, date, status }
//     if (!Array.isArray(updates) || updates.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No updates provided",
//       });
//     }

//     const teacherId = req.role === "teacher" ? req.id : null;
//     const collegeId = req.role === "college" ? req.id : null;

//     const operations = updates.map((entry) => ({
//       updateOne: {
//         filter: {
//           studentID: entry.studentID,
//           subjectCode: entry.subjectCode,
//           date: new Date(entry.date),
//         },
//         update: {
//           $set: {
//             status: entry.status,
//             teacherId: teacherId,
//             collegeId: collegeId,
//             updatedAt: new Date(),
//           },
//         },
//       },
//     }));

//     await Attendance.bulkWrite(operations);

//     return res.status(200).json({
//       success: true,
//       message: "Attendance updated successfully",
//     });
//   } catch (err) {
//     console.error("Error in updateAttendance:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Error in updateAttendance " + err.message,
//     });
//   }
// }

export async function updateAttendance(req, res) {
  try {
    // Role validation
    if (req.role !== "teacher" && req.role !== "college") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    const teacherId = req.role === "teacher" ? req.id : null;
    const collegeId = req.role === "college" ? req.id : null;

    const operations = updates.map((entry) => {
      const startOfDay = new Date(entry.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(entry.date);
      endOfDay.setHours(23, 59, 59, 999);


      return {
        updateOne: {
          filter: {
            studentID: entry.studentID,
            subjectCode: entry.subjectCode,
            date: { $gte: startOfDay, $lte: endOfDay },
          },
          update: {
            $set: {
              status: entry.status,
              teacherId,
              collegeId,
              updatedAt: new Date(),
            },
          },
          upsert: false,
        },
      };
    });

    const result = await Attendance.bulkWrite(operations);

    console.log("updateAttendance -> bulkWrite result:", {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
    });


    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching attendance records found to update.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("Error in updateAttendance:", err);
    return res.status(500).json({
      success: false,
      message: "Error in updateAttendance: " + err.message,
    });
  }
}

