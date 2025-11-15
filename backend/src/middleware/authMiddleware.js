import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';
import Teacher from '../models/Teacher.js';
import College from '../models/College.js';

export const authMiddleware = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token) return res.status(400).json({message: "no token find"});
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decode) return res.status(400).json({message: "invalid token"});

        let user, id, objectId;
        if(decode.role === 'student'){
            user = await Student.findById(decode.userId).select("-password");
            id = user.studentID;
            objectId = user._id;
        }
        else if(decode.role === 'college'){
            user = await College.findById(decode.userId).select("-password");
            id = user.collegeId;
            objectId = user._id;
        }
        else{
            user = await Teacher.findById(decode.userId).select('-password');
            id = user.teacherId;
            objectId = user._id;
            
        }
        
        if(!user){
            return res.status(401).json({
                message: "invalid user"
            })
        }

        req.user = user;
        req.role = decode.role;
        req.id = id;
        req.objectId = objectId;
        next();
    }
    catch (err) {
        console.log("Invalid token or user "+err.message);
        res.clearCookie("jwt");
        res.clearCookie("email");
        res.clearCookie("role");

        if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Session expired. Please login again." });
        }
        res.status(500).json({message:"Something went wrong in authentication "+ err.message})
    }
}