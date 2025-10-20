import Student from "../models/Student.js"


//student profile

export async function studentProfile (req, res) {
    try{const email = req.cookies.email
    if(!email) return res.status(400).json({
        success: false,
        message:"Token expired"
    })
    const user = await Student.findOne({email}).select("-password");
    if(!user){
        return res.status(400).json({
                success: false,
                message: "Invalid email"
                })
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