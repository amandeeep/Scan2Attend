import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    studentID:{
        type: String,
        ref: "Student",
        required: true,
    },
    subjectCode:{
        type: String,
        required: true,
        ref: 'Subjects',
    },
    collegeId:{
        type: String,
        required: true,
        ref: 'College'
    },
    teacherId:{
        type:String,
        required:true,
        ref: 'Teacher'
    },
    date:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ['present', 'absent'],
        required: true,
    },
    source:{
        type:String,
        enum: ['manual', 'biometric'],
        required: true
    },
    branch:{
        type:String,
        required:true
    }

}, {timestamps: true});

attendanceSchema.index({studentID:1,subjectCode:1,date:1},{unique:true})

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;