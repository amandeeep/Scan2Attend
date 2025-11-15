import Student from '../models/Student.js'
import jwt from "jsonwebtoken";
import "dotenv/config";
import {transporter }from '../config/mail.js';
import {redis} from '../config/redis.js'
import { uploadOnCloudinary } from '../config/cloudinary.js';
import 'dotenv/config'
import bcrypt from 'bcryptjs';
import College from '../models/College.js';
import Teacher from '../models/Teacher.js';
const isProduction = process.env.NODE_ENV === "production";
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

        let newUser;
        if (role === 'student') {
            newUser = await Student.create({ email, fullName, password, profilePic: randomAvatar, isOnboard: false });
        } else if (role === 'teacher') {
            newUser = await Teacher.create({ email, fullName, password, profilePic: randomAvatar, isOnboard: false });
        } else if (role === 'college') {
            newUser = await College.create({ email, fullName, password, profilePic: randomAvatar, isOnboard: false });
        }

        const token = jwt.sign({ userId: newUser._id, role }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie("jwt", token,{
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite:  isProduction ? "none" : "lax",
            secure: isProduction 
        })

        res.cookie("role",role,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite:  isProduction ? "none" : "lax",
            secure: isProduction
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
        let check;
        let isOnboard;
        let userData;
        if(role === 'student') {
            user = await Student.findOne({email});
            userData = user.toObject();
            delete userData.password;
            isOnboard = user?.isOnboard === true;
        }
        else if(role === 'college') {
            user = await College.findOne({email})
            userData = user.toObject();
            delete userData.password;
            isOnboard = user?.isOnboard === true;
        }
        else if(role === 'teacher') {
            user = await Teacher.findOne({email});
            userData = user.toObject();
            delete userData.password;
            isOnboard = user?.isOnboard === true;

        }
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

        const token = jwt.sign({userId: user._id, role : role}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

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
            sameSite:  isProduction ? "none" : "lax",
            secure: isProduction
        });
        }

        setCookie(res, "jwt", token);
        setCookie(res, "email", email);
        setCookie(res, "role", role);

        res.status(201).json({
            success: true,
            message: "Login successfully",
            role: role,
            isOnboard: isOnboard,
            userDetails : userData
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

// onboard

export async function onboard(req, res) {
  try {
    const userId = req.objectId;
    const role = req.role;
    const body = req.body;

    // Profile image file from multer
    const uploadedFile = req.file;

    const requiredFields = {
      student: [
        "fullName", "address", "semester", "department", "rollNumber",
        "gender", "age", "email", "studentID", "contactNumber", "profilePic"
      ],

      teacher: [
        "fullName", "teacherId", "department", "address", "gender",
        "age", "email", "contactNumber", "profilePic", "collegeId"
      ],

      college: [
        "fullName", "collegeId", "address", "email", "contactNumber", "profilePic"
      ]
    };

    if (!requiredFields[role]) {
      return res.status(400).json({
        success: false,
        message: "Invalid role for onboarding"
      });
    }

    


    const missingFields = requiredFields[role].filter(field => !body[field]);

    // profilePic is always required 
    if (!uploadedFile && !body.profilePic) {
      missingFields.push("profilePic");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        missingFields
      });
    }



    // Upload image to Cloudinary
    let cloudUrl = body.profilePic;
    if (uploadedFile) {
      const uploadedUrl = await uploadOnCloudinary(uploadedFile.path);

      if (!cloudUrl) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed"
        });
      }
      cloudUrl = uploadedUrl;
    } //vvvv


    let Model;
    if (role === "student") Model = Student;
    else if (role === "teacher") Model = Teacher;
    else if (role === "college") Model = College;

    const updatedUser = await Model.findByIdAndUpdate(
      userId,
      { ...body, isOnboard: true, profilePic: cloudUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: `${role} onboarding completed successfully`,
      user: updatedUser
    });

  } catch (err) {
    console.log("Error in onboarding API:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message
    });
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
        try{
        const info = await transporter.sendMail({
            from: `Scan2Attend Admin <${process.env.FAKE_EMAIL}>`,
            to: user.email,
            subject: 'Otp from Scan2Attend',
            html: `<h3>Your OTP: ${otp}</h3><p>Valid for 5 minutes.</p>`
        });console.log("Email sent:", info.response);
        console.log("Email 1234 sent:", info);
        }catch(err){
            console.error("SendMail error:", err);
        }
        res.cookie("schema",schema,{
            httpOnly: true,
            maxAge: 5*60*1000,
            sameSite:  isProduction ? "none" : "lax",
            secure: isProduction
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
            sameSite:  isProduction ? "none" : "lax",
            secure: isProduction
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

// addUser


export async function addUser(req, res){
    try{
        const {fullName, branch, email, gender, password, rollNumber, semester, department, contactNumber, studentID, role = 'student'} = req.body;
        
        if(!role || !fullName || !email || !password || !studentID){
            return res.status(400).json({
                success: false,
                message: "All *fields are required"
            })
        }
        const emailSnippet = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailSnippet.test(email)){
            return  res.status(400).json({
                success: false,
                message: "Fill correct email"
            })
        }

        let studentExist = await Student.findOne({email});
        if(studentExist){
            return res.status(400).json({
                success: false,
                message: "Student already exist"
            })
        }
        if(req.role != 'teacher' && req.role != 'college') return res.status(400).json({
            success : false,
            message : "Not Authorize to add Student "
        })
        let newUser = await Student.create({
            email, fullName, password, branch, gender, semester, role, contactNumber, department, rollNumber, studentID
        })
        res.status(201).json({
            success: true,
            message: "Student add successfully"
        })
    }catch(err){
        console.log("Error in addUser controller " + err.message);
        res.status(500).json({
            success: false,
            message: "Error in addUser controller " + err.message
        })
    }
}