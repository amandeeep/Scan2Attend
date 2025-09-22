import React, { useState } from 'react'
import { Croissant, ShipWheel } from 'lucide-react';
import {Link} from 'react-router-dom'

import img from '../Images/BoyAtten.png'
import google from '../Images/GoogleLogo.png'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [isLogging, setIsLogging] = useState("") // create a hook to setlogin letter on imp!!!!


    const handleLogin = (e) => {
        e.preventDefault();
    }
  return (
    <div >
        
        <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="light">
            {/* RightSide form section */}
            <div>
                <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
                    <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
                    {/* logo of the website */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <Croissant className="size-9 text-primary" />
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                            Scan2Attend
                            </span>

                    </div>

                    {/* error message will come here */}

                    <div>
                        <form onSubmit={handleLogin}>
                            <div className='space-y-4'>
                                <div>
                                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                                    <p className="text-sm opacity-70">
                                    Sign in to your account 
                                    </p>
                                </div>

                                {/* this is email field */}
                                <div className="flex flex-col gap-3">
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text text-base font-medium">Email</span>
                                        </label>
                                        <input type="email" placeholder='hello@example.com' className=' input input-bordered w-full' value={email} onChange={(e) => setEmail(e.target.value) } required />
                                    </div>

                                    {/* this is password field */}
                                   
                                    <div className="form-control w-full space-y-2">
                                        <label className="password">
                                            <div className=' flex justify-between'>
                                            <span className="label-text text-base font-medium">Password</span>
                                            <span>
                                                <p><Link to ='/login/forgot-password' className="text-xs text-primary hover:underline">Forgot Password</Link></p>
                                            </span></div>
                                        </label>
                                        <input type="password" placeholder='••••••••' className=' input input-bordered w-full' value={password} onChange={(e) => setPassword(e.target.value) } required />
                                        
                                    </div>




                                    {/* button for login  */}
                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                    <button type="submit" className="btn btn-primary flex-1" disabled=      {isLogging}>
                                        {isLogging ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                    Signing in...
                                            </>
                                                    ) : (
                                        "Sign In"
                                        )}
                                    </button>
                                    <button type="button" className="btn flex-1 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center gap-2 shadow-sm"><img src={google} alt="google" className="w-5 h-5"/>
                                    </button>
                                    </div>

                                    {/* forwarding to create account */}


                                    <div className="text-center mt-4">
                                        <p className="text-sm">
                                            Don't have an account?{" "}
                                            <Link to="/signup" className="text-primary hover:underline">
                                                 Create one
                                            </Link>
                                        </p>
                                    </div>
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
                                <img src={img} alt="Attandence" className="w-full h-full" />
                            </div>

                            <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Connect with success partners worldwide</h2>
                            <p className="opacity-70">
                                Take attendance seamlessly with cutting-edge face recognition.
             Fast, secure, and reliable.
                            </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


        
    </div>
  )
}

export default LoginPage





// import React, { useState } from 'react'
// import { Croissant } from 'lucide-react';
// import { Link } from 'react-router-dom'
// import img from '../Images/BoyAtten.png'

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("")
//   const [isLogging, setIsLogging] = useState("") // hook for login state

//   const handleLogin = (e) => {
//     e.preventDefault(); // fixed bug
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 p-4">
//       <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
//         {/* Left side (form) */}
//         <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
//           {/* Logo */}
//           <div className="mb-6 flex items-center gap-3">
//             <Croissant className="size-10 text-purple-600" />
//             <span className="text-3xl font-bold font-mono bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
//               Scan2Attend
//             </span>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleLogin} className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h2>
//               <p className="text-sm text-gray-500">
//                 Please login to continue
//               </p>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Email</label>
//               <input
//                 type="email"
//                 placeholder="hello@example.com"
//                 className="input input-bordered w-full rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Password + Forgot Password link */}
//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <label className="block text-sm font-medium">Password</label>
//                 <Link
//                   to="/forgotPasswordPage"
//                   className="text-sm text-purple-600 hover:underline hover:text-purple-800 transition"
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 className="input input-bordered w-full rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               className="btn btn-primary w-full py-3 rounded-lg font-semibold tracking-wide shadow-md hover:shadow-lg transition"
//               disabled={isLogging}
//             >
//               {isLogging ? (
//                 <>
//                   <span className="loading loading-spinner loading-sm"></span>
//                   <span className="ml-2">Signing in...</span>
//                 </>
//               ) : (
//                 "Sign In"
//               )}
//             </button>

//             {/* Signup Redirect */}
//             <div className="text-center mt-4">
//               <p className="text-sm text-gray-600">
//                 Don’t have an account?{" "}
//                 <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
//                   Create one
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>

//         {/* Right side (illustration) */}
//         <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-purple-50 to-purple-200 items-center justify-center">
//           <div className="max-w-md p-8 text-center">
//             {/* Illustration */}
//             <div className="relative aspect-square max-w-xs mx-auto">
//               <img
//                 src={img}
//                 alt="Login Illustration"
//                 className="w-full h-full object-contain drop-shadow-lg"
//               />
//             </div>

//             <h2 className="text-xl font-semibold mt-6 text-gray-800">
//               Connect, Learn & Grow
//             </h2>
//             <p className="text-gray-600 text-sm mt-2 leading-relaxed">
//               Take attendance seamlessly with cutting-edge face recognition.
//               Fast, secure, and reliable.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginPage
