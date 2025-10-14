import Student from '../models/Student.js'
import jwt from "jsonwebtoken";
import "dotenv/config";


// signup controller

export async function signup(req,res){
    const {fullName, email, password} = req.body;
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const emailSnippet = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailSnippet.test(email)){
            return  res.status(400).json({
                success: false,
                message: "Fill correct email"
            })
        }
        const idx = Math.floor(Math.random()*100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newStudent = await Student.create({
            email, fullName, password, profilePic: randomAvatar
        })

        const token = jwt.sign(
            {userId: newStudent._id,}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'}
        )

        res.cookie("jwt", token,{
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({
            success: true,
            message: "Signup successfully"
        })
    }
    catch(err){
        console.log("Error in signup controller" + err.message);
        res.status(500).json({
            success: false,
            message: "Error in signup controller" + err.message
        })
    }
}


// login controller

export async function login(req,res){
    try{
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                sucess: false,
                message: "All fields are required"
            })
        }
        const user = await Student.findOne({email});
        if(!user) return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
        const isPassword = await user.matchPassword(password);
        if(!isPassword) return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

        res.cookie("jwt",token,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({
            sucess: true,
            message: "Login successfully"
        })
    }
    catch(err){
        console.log("Erron in login" + err.message);
        res.status(500).json({message:"Failed login from server error" + err.message})

    }
}



// logout controller

export function logout(req,res){
    res.clearCookie("jwt");
    res.status(201).json({
        success: true,
        message: "Logout successfully"
    })
}


// student onboard

export async function studentOnboard (req, res) {
    try{
        const userId = req.user._id;
        const {fullName, address, semester, department, rollNumber, gender,age,email, studentID, contactNumber,profilePic} = req.body;
        if(!fullName || !address || !semester || !rollNumber || !gender || !age || !email || !studentID || !contactNumber || !profilePic){
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !address && "address",
                    !semester && "semester",
                    !department && "department",
                    !gender && "gender",
                    !age && "age",
                    !email && "email",
                    !rollNumber && "rollNumber",
                    !studentID && "studentID",
                    !contactNumber && "contactNumber",
                    
                    !profilePic && "profilePic"
                ].filter(Boolean)
            })

        }
// By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
        const update = await Student.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboard: true
        },{new: true})
        if(!update)  return res.status(404).json({
            message: "User not found"
        })
        return res.status(202).json({
            success: true,
            user: update
        })
    }
    catch(err){
        console.log("error in student onboard" + err.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"+err.message
        })

    }
}

