import Subject from "../models/Subject.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

 // addSubject

export async function addSubject (req, res){
    try{
        if (req.role !== 'teacher' && req.role !== 'college') {
            return res.status(401).json({ message: "Only teachers or college can add subjects" });
        }
        const {name, code, semester, department} = req.body;
        if(!name || !code) return res.status(400).json({
            success:false,
            message:"Name and code are required"
        });
        const existing = await Subject.findOne({code});
        if(existing) return res.status(400).json({
            success: false,
            message: "This subject already exist"
        });
        const newSubject = await Subject.create({
            name, code, department, semester, teacherId: req.user ? req.user._id : null,
        });
        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: newSubject
        })
    }catch(err){
        console.log("Erro in add subject "+err);
        res.status(500).json({
            success:false,
            message:"Error in addSubject  " + err.message
        })
    }
}


// export async function enrollStudents(req, res) {
//   try {
//     const { subjectCode, studentIds } = req.body;

//     if (!subjectCode || !Array.isArray(studentIds) || studentIds.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "subjectCode and studentIds[] are required",
//       });
//     }

//     const subjectExist = await Subject.findOne({ code: subjectCode });
//     if (!subjectExist) {
//       return res.status(400).json({
//         success: false,
//         message: "Subject not found",
//       });
//     }
//     const validStudents = await Student.find({ studentID: { $in: studentIds } })
//       .select("studentID fullName department rollNumber");

//     if (validStudents.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "No valid student IDs are provided",
//       });
//     }

//     const teacher = await Teacher.findById(req.user._id).select(
//       "teacherId fullName department"
//     );

//     if (!teacher) {
//       return res.status(404).json({
//         success: false,
//         message: "Teacher not found",
//       });
//     }

//     const existingIds = subjectExist.studentIds || [];
//     const newStudents = validStudents.filter(
//       (s) => !existingIds.includes(s.studentID)
//     );
//     const alreadyEnrolled = validStudents
//       .filter((s) => existingIds.includes(s.studentID))
//       .map((s) => s.studentID);
//     if (newStudents.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "All students already enrolled in this subject.",
//         alreadyExist: alreadyEnrolled
//       });
//     }

//     subjectExist.studentIds.push(...newStudents.map((s) => s.studentID));

//     const newStudentInfo = newStudents.map((s) => ({
//       studentId: s.studentID,
//       fullName: s.fullName,
//       department: s.department,
//       rollNumber: s.rollNumber,
//     }));

//     subjectExist.studentInfo.push(...newStudentInfo);

//     if (!subjectExist.teacherIds.includes(teacher.teacherId)) {
//       subjectExist.teacherIds.push(teacher.teacherId);
//       subjectExist.teacherInfo.push({
//         teacherId: teacher.teacherId,
//         fullName: teacher.fullName,
//         department: teacher.department,
//       });
//     }

//     await subjectExist.save();

//     res.status(201).json({
//       success: true,
//       message: "Students enrolled successfully",
//       data: subjectExist,
//       alreadyExist: alreadyEnrolled
//     });
//   } catch (err) {
//     console.log("Error in enrollStudents:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error in enroll student " + err.message,
//     });
//   }
// }



// get all Subject of a student

export async function enrollStudents(req, res) {
  try {
    const { subjectCode, studentIds } = req.body;

    if (!subjectCode || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(401).json({
        success: false,
        message: "subjectCode and studentIds[] are required",
      });
    }

    const subjectExist = await Subject.findOne({ code: subjectCode });
    if (!subjectExist) {
      return res.status(400).json({
        success: false,
        message: "Subject not found",
      });
    }

    const validStudents = await Student.find({ studentID: { $in: studentIds } })
      .select("studentID fullName department rollNumber");

    const validIds = validStudents.map((s) => s.studentID);
    const invalidStudentIds = studentIds.filter((id) => !validIds.includes(id));

    if (validStudents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid student IDs are provided",
        invalidStudentIds,
      });
    }

    const teacher = await Teacher.findById(req.user._id).select(
      "teacherId fullName department"
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const existingIds = subjectExist.studentIds || [];
    const newStudents = validStudents.filter(
      (s) => !existingIds.includes(s.studentID)
    );

    const alreadyEnrolled = validStudents
      .filter((s) => existingIds.includes(s.studentID))
      .map((s) => s.studentID);

    if (newStudents.length === 0 && alreadyEnrolled.length > 0) {
      return res.status(400).json({
        success: false,
        message: "All students are already enrolled.",
        alreadyEnrolled,
        invalidStudentIds,
      });
    }

    subjectExist.studentIds.push(...newStudents.map((s) => s.studentID));

    const newStudentInfo = newStudents.map((s) => ({
      studentId: s.studentID,
      fullName: s.fullName,
      department: s.department,
      rollNumber: s.rollNumber,
    }));

    subjectExist.studentInfo.push(...newStudentInfo);

    if (!subjectExist.teacherIds.includes(teacher.teacherId)) {
      subjectExist.teacherIds.push(teacher.teacherId);
      subjectExist.teacherInfo.push({
        teacherId: teacher.teacherId,
        fullName: teacher.fullName,
        department: teacher.department,
      });
    }

    await subjectExist.save();

    res.status(201).json({
      success: true,
      message: "Students enrolled successfully",
      data: subjectExist,
      newlyEnrolled: newStudents.map((s) => s.studentID),
      alreadyEnrolled,
      invalidStudentIds,
    });
  } catch (err) {
    console.log("Error in enrollStudents:", err);
    res.status(500).json({
      success: false,
      message: "Error enrolling students: " + err.message,
    });
  }
}


export async function getStudentSubjects (req, res){
    try{
        let subjects;
        if(req.role === 'student'){
            const studentID = req.params.id || (req.user && req.user.studentID)
                if(!studentID) return res.status(400).json({
                success: false,
                message: "No studentID provided"
            });
            subjects = await Subject.find({studentIds:studentID})
            .select("name code semester department teacherId")
        }else if(req.role === 'teacher'){
            const {department, code} = req.body;
            if(!department || !code) return res.status(400).json({
                success: false,
                message: "Department and code are required"
            })
            const teacherID = req.params.id || req.user._id;
            if(!teacherID) return res.status(400).json({
                success: false,
                message: "No teacherId are provided"
            });
            subjects = await Subject.find({teacherId:teacherID, code})
            .select({
                name: 1,
                code: 1,
                semester: 1,
                department: 1,
                studentInfo: { $elemMatch: { department: department } },
            });
            if(subjects.length <= 0) return res.status(400).json({
              success: false,
              message: "No subjects/students found for this teacher with the specified code and department"
            })

            // .populate('studentIds', "fullName studentID email")
        }else {
            return res.status(403).json({ success: false, message: "Invalid role" });
        }
        res.status(201).json({
            success:true,
            message:"Subject listed shown successfully",
            data:subjects
        })
    }catch(err){
        console.log("Error in getStudentSubjects " +err)
        res.status(500).json({
            success:false,
            message:"Error in getStudentSubjects "+err.message
        })
    }
}
