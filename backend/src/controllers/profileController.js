import College from "../models/College.js";
import Student from "../models/Student.js"
import Teacher from "../models/Teacher.js";


//student profile

export async function profile (req, res) {
    try{
        const email = req.cookies.email
        const role = req.role
        if(!email) return res.status(400).json({
            success: false,
            message:"Token expired"
        })
        let user;
        if(role === 'student'){
            user = await Student.findOne({email}).select("-password");
            if(!user){
                return res.status(400).json({
                    success: false,
                    message: "Invalid email"
                })
            }
        }
        else if(role === 'teacher'){
            user = await Teacher.findOne({email}).select("-password");
            if(!user){
                return res.status(400).json({
                    success: false,
                    message: "Invalid email"
                })
            } 
        }
        else if(role === 'college'){
            user = await College.findOne({email}).select("-password");
            if(!user){
                return res.status(400).json({
                    success: false,
                    message: "Invalid email"
                })
            }
        }
    
    res.status(201).json({
        success: true,
        message: "Profile data ",
        user: user
    })
}
    catch(err){
        console.log("Error in student profile backend "+ err.message);
        res.status(500).json({
            success: false,
            message: "Error in studendt profile backend " + err.message
        })
    }
}