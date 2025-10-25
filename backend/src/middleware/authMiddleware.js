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
        console.log("Decoded token:", decode);

        let user;
        if(decode.role === 'student'){
            user = await Student.findById(decode.userId).select("-password");
        }
        else if(decode.role === 'college'){
            user = await College.findById(decode.userId).select("-password");
        }
        else{
            user = await Teacher.findById(decode.userId).select('-password');
        }
        
        if(!user){
            return res.status(401).json({
                message: "invalid user"
            })
        }

        req.user = user;
        req.role = decode.role
        next();
    }
    catch (err) {
        console.log("Invalid token or user"+err.message);
        res.clearCookie("jwt");
        res.clearCookie("email");
        res.clearCookie("role");

        if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Session expired. Please login again." });
        }
        res.status(500).json({message:"Something went wrong in authentication "+ err.message})
    }
}