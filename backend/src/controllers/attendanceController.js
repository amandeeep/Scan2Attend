import Student from "../models/Student.js";
import Teacher from '../models/Teacher.js';
import Attendance from "../models/Attendance.js";


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
            const totalPresent = attendance.filter(r => r.status === "Present").length;
            const totalMarked = attendance.filter(r => r.status === "Present" || r.status === "Absent").length;
            const overallAttendance = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;
            const subjectCount = [...new Set(attendance.map(r => r.subjectCode))];
            const updatedStudent = await Student.findOneAndUpdate(
              { studentID: req.user.studentID },
              {
                $set: {
                  "attendanceDetails.percentage": overallAttendance,
                  "attendanceDetails.subjectDetails": subjectCount
                }
              },
              { new: true, upsert: true }
            );
            return res.status(200).json({
                success: 'true',
                data: attendance,
            })

        }
        
        return res.json({
            message:"get attendance endpoint under construction"
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Erro in getAttendance "+err.message
        })
    }
}

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

