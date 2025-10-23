import Student from '../models/Student.js'
import jwt from "jsonwebtoken";
import "dotenv/config";
import {transporter }from '../config/mail.js';
import {redis} from '../config/redis.js'
import 'dotenv/config'
import crypto from 'crypto'
import bcrypt from 'bcryptjs';
import College from '../models/College.js';
import Teacher from '../models/Teacher.js';

// signup controller

export async function signup(req,res){
    const {role, fullName, email, password} = req.body;
    try{
        if(!role || !fullName || !email || !password){
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
        let existingUser;
        if(role === 'student') existingUser = await Student.findOne({email});
        else if(role === 'teacher') existingUser = await Teacher.findOne({email});
        else if(role === 'college') existingUser = await College.findOne({email});
        else return res.status(400).json({
            success: false,
            message: "No valid role"
        })
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User email already exists"
            })
        }
        const idx = Math.floor(Math.random()*100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        // const newStudent = await Student.create({
        //     email, fullName, password, profilePic: randomAvatar
        // })
        let newUser;
        if (role === 'student') {
            newUser = await Student.create({ email, fullName, password, profilePic: randomAvatar });
        } else if (role === 'teacher') {
            newUser = await Teacher.create({ email, fullName, password, profilePic: randomAvatar });
        } else if (role === 'college') {
            newUser = await College.create({ email, fullName, password, profilePic: randomAvatar });
        }


        // const token = jwt.sign(
        //     {userId: newStudent._id, role : "student"}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'}
        // )

        const token = jwt.sign({ userId: newUser._id, role }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie("jwt", token,{
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.cookie("role",role,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({
            success: true,
            message: "Signup successfully"
        })
    }
    catch(err){
        console.log("Error in signup controller " + err.message);
        res.status(500).json({
            success: false,
            message: "Error in signup controller " + err.message
        })
    }
}


// login controller

export async function login(req,res){
    try{
        const {role, email, password} = req.body;
        if(!role || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        let user;
        if(role === 'student') user = await Student.findOne({email});
        else if(role === 'college') user = await College.findOne({email});
        else if(role === 'teacher') user = await Teacher.findOne({email});
        else return res.status(400).json({
            success: false,
            message: "No valid role"
        })
        
        if(!user) return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
        const isPassword = await user.matchPassword(password);
        if(!isPassword) return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })

        const token = jwt.sign({userId: user._id, role : 'student'}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

        // res.cookie("jwt",token,{
        //     httpOnly: true,
        //     maxAge: 7*24*60*60*1000,
        //     sameSite: "strict",
        //     secure: process.env.NODE_ENV === "production"
        // })

        // res.cookie("email",email,{
        //     httpOnly: true,
        //     maxAge: 7*24*60*60*1000,
        //     sameSite: "strict",
        //     secure: process.env.NODE_ENV === "production"
        // })
        
        // res.cookie("role",role,{
        //     httpOnly: true,
        //     maxAge: 7*24*60*60*1000,
        //     sameSite: "strict",
        //     secure: process.env.NODE_ENV === "production"
        // })

        function setCookie(res, key, value) {
        res.cookie(key, value, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        }

        setCookie(res, "jwt", token);
        setCookie(res, "email", email);
        setCookie(res, "role", role);

        res.status(201).json({
            sucess: true,
            message: "Login successfully",
            // user: user
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
            message: "Successfully Onboard",
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


// send otp

export async  function sendOtp(req, res){
    try{
        const {email} = req.body;
        if(!email) return res.status(400).json({
            success: false,
            message: "Email is required"
        })
        let user = await Student.findOne({ email });
        let schema = "student";
        if (!user) {
        user = await College.findOne({ email });
        schema = "college"
        }

        if (!user) {
        user = await Teacher.findOne({ email });
        schema = 'teacher'
        }
        if(!user) return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        })

        // cooldown feature to wait for otp
        
        const cooldownKey = `otp:cooldown:${email}`;
        const isCooldown = await redis.get(cooldownKey);
        if (isCooldown) {
        return res.status(429).json({
            success: false,
            message: 'Please wait before requesting another OTP.',
        });
        }
        const otp = Math.floor(100000 + Math.random()*900000).toString();

        await Promise.all([
         redis.del(`otp:${email}`),
         redis.set(`email:${otp}`, email, {ex:300}),
         redis.set(`otp:${email}`, otp, {ex: 300}),
         redis.set(cooldownKey, '1', { ex: 60 }),])

        // send mail
        await transporter.sendMail({
            from: `Scan2Attend Admin <${process.env.FAKE_EMAIL}>`,
            to: user.email,
            subject: 'Otp from Scan2Attend',
            html: `<h3>Your OTP: ${otp}</h3><p>Valid for 5 minutes.</p>`
        })
        
        res.cookie("schema",schema,{
            httpOnly: true,
            maxAge: 5*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })
        res.status(200).json({
            success: true,
            message: "Otp send successfully"
        })
    }catch(err){
        console.error("Send OTP error:", err);
        res.status(500).json({ message: err.message });
    }
}


// verify otp

export async function verifyOtp (req,res) {
    try{
        const {otp} = req.body;
        if(!otp) return res.status(400).json({
            success: false,
            message: "Please enter otp"
        })

        const email = await redis.get(`email:${otp}`);
        // const user = await Student.findOne({email});
        const [student, college, teacher] = await Promise.all([
            Student.findOne({ email }),
            College.findOne({ email }),
            Teacher.findOne({ email }),
        ]);
        const user = student || college || teacher;


        if(!user) return res.status(400).json({
            success: false,
            message: "Please entr correct otp or correct credentials"
        })

        const saveOtp = await redis.get(`otp:${email}`);
        if(saveOtp != otp) return res.status(400).json({
            success: false,
            message: "Please enter correct otp"
        })
        const schema = req.cookies.schema;
        user.isOtpVerified = true;
        // await user.save()  // Load full doc, modify, validate entire doc, save


        // by below method => Update only specified fields in DB
        if(schema === 'student'){
            await Student.updateOne(
            { email },
            { $set: { isOtpVerified: true } });
        }else if(schema === 'college'){
            await College.updateOne(
            { email },
            { $set: { isOtpVerified: true } });
        }else if(schema === 'teacher'){
            await Teacher.updateOne(
            { email },
            { $set: { isOtpVerified: true } });
        }
        await redis.del(`otp:${email}`);
        await redis.del(`email:${otp}`);
        

        

        res.cookie("email",email,{
            httpOnly: true,
            maxAge: 5*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({
            success: true,
            message: "Otp verified successfully",
            email
        })
    }catch(err){
        console.log("Error in otp verification " + err.message)
        res.status(500).json({
            message: "Error in otp verification " + err.message
        })
    }
}


// resetPassword

export async function resetPassword (req, res) {
    try{
    const { enterPassword, confirmPassword} = req.body;
    const email = req.cookies.email
    const schema = req.cookies.schema
    if(!enterPassword || !confirmPassword) return res.status(401).json({
        success: false,
        message: "Please enter all fields"
    })
    if(enterPassword !== confirmPassword) return res.status(401).json({
        success: false,
        message: "Enter and confirm password should be same"
    })
    
    if (!email) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    // const user = await Student.findOne({email});
    const [student, college, teacher] = await Promise.all([
        Student.findOne({ email }),
        College.findOne({ email }),
        Teacher.findOne({ email }),
    ]);

    const user = student || college || teacher;

    if(!user) return res.status(400).json({
        success: false,
        message: "Invalid!, no user find"
    })
    
    if(!user.isOtpVerified) return res.status(400).json({
        success: false,
        message: "Please verify yourself"
    })
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(enterPassword, salt);
    if(schema === 'student'){
        await Student.updateOne(
            {email},
            {
                $set: {
                    password: hashPassword,
                    isOtpVerified:false
                }
                
            }
        )
    }else if(schema === 'college'){
            await College.updateOne(
            {email},
            {
                $set: {
                    password: hashPassword,
                    isOtpVerified:false
                }
                
            }
        )
    }else if(schema === 'teacher'){
            await Teacher.updateOne(
            {email},
            {
                $set: {
                    password: hashPassword,
                    isOtpVerified:false
                }
                
            }
        )
    }else{
        return res.status(400).json({
            success: false,
            message: "No or invalid schema"
        })
    }
    
    res.status(201).json({
        success: true,
        message: "Password updated successfully"
    })
}catch(err){
    console.log("Error in reset password "+ err.message);
    res.status(500).json({
        success:false,
        message:"Error in reset password "+err.message
    })
}


}