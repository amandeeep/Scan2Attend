import mongoose, { Mongoose } from "mongoose";


const subjectSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        default: ''
    },
    code:{
        type: String,
        required: true,
        unique: true,
    },
    department:{
        type: String,
        required: true,
        default: ''
    },
    semester:{
        type:Number,
        required: true,
    },
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }],
    studentIds:[{
        type:String,
        ref: 'Student'
    }],
    teacherId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }],
    teacherIds: [
        {
        type: String,
        ref: "Teacher",
        },
    ],
    studentInfo:[{
        studentId: {type: String},
        fullName: {type: String},
        department: {type: String},
        rollNumber: {type:String},
    }],
    teacherInfo: [{
        teacherId: { type: String }, 
        fullName: { type: String },
        department: { type: String },
    }],
    collegeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    }
},{timestamps: true})

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;