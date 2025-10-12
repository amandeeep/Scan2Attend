import React from 'react'
import img from "../Images/ForgotPassword.png"
import { useState } from 'react';
import { Croissant } from 'lucide-react';
import {Link} from 'react-router-dom'
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [mobNo, setMobNo] = useState("");
    const [error, setError] = useState('');

    const handleForgot = (e) => {
            e.preventDefault();

    if (!email.trim() && !mobNo.trim()) {
      setError('Please enter either an email or a phone number.');
      return;
    }

    setError('');
    
    alert(`Submitted:\nEmail: ${email}\nPhone: ${mobNo}`);
    }
  return (
    <div>
        <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' >
            <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>


                {/* right hand section */}


                <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
                    {/* logo section */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <Croissant className="size-9 text-primary" />
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                            Scan2Attend
                            </span>

                    </div>

                    {/* error message will come here */}


                    <div>
                        <form onSubmit={handleForgot}>
                            <div className='space-y-4'>
                                <div>
                                    <h2 className="text-xl font-semibold">Forgot Password</h2>
                                    
                                </div>

                                
                                <div className="flex flex-col gap-3">


                                    {/* this is email field */}

                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text text-base font-medium">Email</span>
                                        </label>
                                        <input type="email" placeholder='hello@example.com' className=' input input-bordered w-full' value={email} onChange={(e) => setEmail(e.target.value) }  />
                                    </div>

                                    <div className="text-center text-gray-400 font-semibold">or</div>


                                    {/* mobile number in future add country code also there */}
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text text-base font-medium">Phone number</span>
                                        </label>
                                        <input type="tel" placeholder='9837XXXX' className='input input-bordered w-full' 
                                        pattern="[0-9]{10}" maxLength="10" 
                                        value={mobNo} onChange={(e) => setMobNo(e.target.value)} />

                                    </div>

                                    {/* this is button with code to make one of the option required */}
                                    <Link to='/otp'>@</Link>
                                    <button type="submit" className="btn btn-primary w-full" >
                                        
                                                Generate OTP
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>

                </div>

                {/* left side or image section */}
                
                                    <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                                        <div className="max-w-md p-8">
                                        {/* Illustration */}
                                            <div className="relative aspect-square max-w-sm mx-auto">
                                                <img src={img} alt="Attendence" className="w-full h-full" />
                                            </div>
                
                                            <div className="text-center space-y-3 mt-6">
                                            <h2 className="text-xl font-semibold">Forgot Password! Don't Worry</h2>
                                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                                Just enter your email or phone number and we’ll help you reset your password quickly and securely.
                                            </p>
                                            </div>
                                        </div>
                                    </div>
            </div>
        </div>
    </div>
  )
}

export default ForgotPasswordPage


// seacond ui

// import React, { useState } from 'react'
// import { Croissant } from 'lucide-react';
// import { Link } from 'react-router-dom'
// import img from "../Images/ForgotPassword.png"

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState("");
//   const [mobNo, setMobNo] = useState("");
//   const [error, setError] = useState('');

//   const handleForgot = (e) => {
//     e.preventDefault();
//     if (!email.trim() && !mobNo.trim()) {
//       setError('Please enter either an email or a phone number.');
//       return;
//     }
//     setError('');
//     alert(`Submitted:\nEmail: ${email}\nPhone: ${mobNo}`);
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 p-4">
//       <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
//         {/* Left: Form Section */}
//         <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
//           {/* Logo */}
//           <div className="mb-6 flex items-center gap-3">
//             <Croissant className="size-10 text-purple-600" />
//             <span className="text-3xl font-bold font-mono bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
//               Scan2Attend
//             </span>
//           </div>

//           {/* Heading */}
//           <h2 className="text-2xl font-bold text-gray-800 mb-1">Forgot Password?</h2>
//           <p className="text-sm text-gray-500 mb-6">
//             Enter your email or mobile number to reset your password
//           </p>

//           {/* Error */}
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//           {/* Form */}
//           <form onSubmit={handleForgot} className="space-y-5">
//             {/* Email */}
//             <div className="form-control w-full">
//               <label className="label">
//                 <span className="label-text text-base font-medium">Email</span>
//               </label>
//               <input
//                 type="email"
//                 placeholder="hello@example.com"
//                 className="input input-bordered w-full rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="text-center text-gray-400 font-semibold">or</div>

//             {/* Mobile Number */}
//             <div className="form-control w-full">
//               <label className="label">
//                 <span className="label-text text-base font-medium">Mobile Number</span>
//               </label>
//               <input
//                 type="tel"
//                 placeholder="9837XXXXXX"
//                 className="input input-bordered w-full rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
//                 pattern="[0-9]{10}"
//                 maxLength="10"
//                 value={mobNo}
//                 onChange={(e) => setMobNo(e.target.value)}
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="btn btn-primary w-full py-3 rounded-lg font-semibold tracking-wide shadow-md hover:shadow-lg transition"
//             >
//               Generate OTP
//             </button>

//             {/* Back to Login */}
//             <div className="text-center mt-4">
//               <Link to="/login" className="text-purple-600 font-semibold hover:underline">
//                 Back to Login
//               </Link>
//             </div>
//           </form>
//         </div>

//         {/* Right: Illustration */}
//         <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-purple-50 to-purple-200 items-center justify-center">
//           <div className="max-w-md p-8 text-center">
//             <div className="relative aspect-square max-w-xs mx-auto">
//               <img
//                 src={img}
//                 alt="Forgot Password Illustration"
//                 className="w-full h-full object-contain drop-shadow-lg"
//               />
//             </div>

//             <h2 className="text-xl font-semibold mt-6 text-gray-800">
//               Don't Worry!
//             </h2>
//             <p className="text-gray-600 text-sm mt-2 leading-relaxed">
//               Just enter your email or phone number and we’ll help you reset your password quickly and securely.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ForgotPasswordPage
