import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token) return res.status(400).json({message: "no token find"});
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decode) return res.status(400).json({message: "invalid token"});
        const user = await Student.findById(decode.userId).select("-password");
        if(!user){
            return res.status(401).json({
                message: "invalid user"
            })
        }

        req.user = user;
        next();
    }
    catch (err) {
        console.log("Invalid token or user"+err.message);
        res.status(500).json({message:"Something went wrong in authentication "+ err.message})
    }
}