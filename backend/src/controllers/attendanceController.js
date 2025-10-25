import Student from "../models/Student.js";
import College from '../models/College.js';
import Teacher from '../models/Teacher.js';
import Attendance from "../models/Attendance.js";
import Subject from "../models/Subject.js";


export async function markAttendance (req, res){
    try{
        const{subjectCode, attendanceList, date, branch, source = 'manual'} = req.body;
        if(!subjectCode || !attendanceList || !date || !branch) return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
        const formatDate = new Date(date);
        const markByTeacher = req.user.role  === 'teacher' ? req.user.teacherId : null;
        const markByCollege = req.user.role === 'college' ? req.user.collegeId : null;

        const operations = attendanceList.map((entry) => ({ // entry means one object inside attendanceList array
            updateOne:{
                filter:{studentID:entry.studentID, subjectCode, date:formatDate, branch},
                update:{
                    $set:{
                        status:entry.status,
                        teacherId:markByTeacher,
                        collegeId:markByCollege,
                        source,
                        branch:branch
                    }
                },
                upsert:true
            }
        }))

        await Attendance.bulkWrite(operations);
        res.status(200).json({
            success:true,
            message:"Attendance marked successfully"
        })
    }catch(err){
        console.log("Error in markAttendance "+err);
        res.status(500).json({
            success: false,
            message: "Error in markAttendance "+err.message
        })
    }
}

export async function getAttendance (req, res) {
    try{
        const { date, subjectCode, page = 1, limit = 10 } = req.query;

        const query = {};

        
        if (req.user.role === "student") query.studentID = req.user.studentID;
        if (req.user.role === "teacher") query.teacherID = req.user.teacherId;
        if (req.user.role === "college") query.collegeID = req.user.collegeCode;

        if (date) query.date = new Date(date);
        if (subjectCode) query.subjectCode = subjectCode;

        const total = await Attendance.countDocuments(query);

        const attendance = await Attendance.find(query)
        //.populate("studentID", "fullName studentID")
        //.populate("subjectCode", "subjectName subjectCode")
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

        res.status(200).json({
        success: true,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        data: attendance,
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Erro in getAttendance "+err.message
        })
    }
}


export async function updateAttendance (req, res){
    try{
        if(req.role !== 'teacher' && req.role !== 'college') return res.status(400).json({
            success: false,
            message: "Access denied"
        })
        const {studentID, subjectCode, date, status} = req.body;
        if(!studentID || !subjectCode || !date || !status) return res.status(400).json({
            success:false,
            message: "All fields are required"
        })
        const result = await Attendance.findOneAndUpdate(
            {studentID, subjectCode, date: new Date(date)},
            {
                $set:{
                    status,
                    teacherId: req.user.teacherId || null,
                    collegeId: req.user.collegeId || null,
                },
            },
            {new : true}
        );
        if(!result) return res.status(400).json({
            success:false,
            message: "Attendance not found"
        })
        res.status(200).json({success: true, message: "Attendance updated successfully", data: result });
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Error in the updateAttendance "+err.message
        })
    }
}