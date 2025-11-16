import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const collegeSchema = new mongoose.Schema({
    
    fullName:{
        type: String,
        required: true,
        default: ''
    },
    address:{
        type: String,
        default: ''
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
        type:Number,
    },
    profilePic:{
        type:String,
        default: ''
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
    },
    collegeId:{
        type: String,
        unique: true,
        sparse: true
    },
},{timestamps:true})

collegeSchema.pre("save", async function(next){
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

collegeSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordMatch = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordMatch;
    
}

const College = mongoose.model('College', collegeSchema);

export default College;