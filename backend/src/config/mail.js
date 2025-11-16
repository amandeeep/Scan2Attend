// import nodemailer from 'nodemailer'
// import "dotenv/config";

// export const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     port: 587,
//     secure: false, 
//     requireTLS: true,
//     auth:{
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASS
//     }
// })


// transporter.verify((error, success) => {
//   if (error) console.error("Brevo SMTP Error:", error.message);
//   else console.log("Brevo SMTP Ready to Send Emails");
// });