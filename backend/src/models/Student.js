import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
        default: 'male',
        validate(value){if(!['male', 'female','other'].includes(value)){
            throw new Error("Invalid gender");
        }}
    },
    age:{
        type: Number,
        
    },
    semester:{
        type: Number,
        min: 1,
    },
    department:{
        type: String,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
    },
    rollNumber:{
        type: Number,
        unique: true,
        sparse: true
    },
    studentID:{
        type: String,
        unique: true,
        sparse: true
    },
    contactNumber:{
        type: Number,
        
        
    },
    address:{
        type: String,
        default: ""
    },
    password:{
        type: String,
        minlength: 6,
        // maxlength: 20,
        required: true,
    },
    profilePic:{
        type: String,
        default: ""
    },
    isOnboard:{
        type: Boolean,
        default: false,
    },
    isOtpVerified:{
        type: Boolean,
        default: false
    },
    collegeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "College"
    }
},{timestamps: true});

studentSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch(err){
        next(err);
    }
})

studentSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordMatch = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordMatch;
    
}

const Student = mongoose.model('Student', studentSchema);

export default Student;