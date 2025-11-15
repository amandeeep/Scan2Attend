import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teacherSchema = new mongoose.Schema({
    teacherId:{
        type: String,
        // required: true,
        unique: true,
        sparse: true
    },
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    department:{
        type:String,
    },
    address:{
        type:String,
        default:''
    },
    collegeObjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    collegeId:{
        type: String,
        ref: 'College'
    },
    password:{
        type: String,
        minlength: 6,
        // maxlength: 20,
        required: true,
    },
    isOnboard:{
        type: Boolean,
        default: false,
    },
    isOtpVerified:{
        type: Boolean,
        default: false
    },
    contactNumber:{
        type:Number
    },
    gender:{
        type: String,
        required: true,
        default: 'male',
        validate(value){if(!['male', 'female','other'].includes(value)){
            throw new Error("Invalid gender");
        }}
    },
    profilePic:{
        type: String,
        default:''
    },
    age:{
        type:Number
    }
},{timestamps:true});

teacherSchema.pre("save", async function(next){
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

teacherSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordMatch = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordMatch;
    
}

const Teacher = mongoose.model("Teacher",teacherSchema);

export default Teacher;