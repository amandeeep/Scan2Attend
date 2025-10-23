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
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    collegeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    }
},{timestamps: true})

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;