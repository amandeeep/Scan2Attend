import React, { useState } from 'react'
import { Croissant, ShipWheel } from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import {addUser} from '../store/userSlice';
import {signup} from '../lib/api';
import img from '../Images/SignUp.png'
const SignUpPage = () => {
    // const [name, setName] = useState("")
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("")
    // const [isLogging, setIsLogging] = useState("") // create a hook to setlogin letter on imp!!!!

    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: ""
    })
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            setIsPending(true);
            const res = await signup(signupData);
            dispatch(addUser(res));
            navigate("/college/dashboard")
        }
        catch(err){
            console.log("Signup failed "+ err.message);
            setError(err.response?.data?.message || "Signup failed")
        }
        finally{
            setIsPending(false)
        }
    }
  return (
    <div >
        
        <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' >
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
                    {error && (
                        <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                    )}

                    <div>
                        <form onSubmit={handleLogin}>
                            <div className='space-y-4'>
                                <div>
                                    <h2 className="text-xl font-semibold">Welcome</h2>
                                    <p className="text-sm opacity-70">
                                    Sign up to create your account 
                                    </p>
                                </div>

                               
                                <div className="flex flex-col gap-3">

                                    {/* this is your name field */}

                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text text-base font-medium">Full Name</span>
                                        </label>
                                        <input type="text" placeholder='John Kapoor' className=' input input-bordered w-full' value={signupData.fullName} onChange={(e) => setSignupData({...signupData,fullName:e.target.value}) } required />
                                    </div>
                                     {/* this is email field */}
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text text-base font-medium">Email</span>
                                        </label>
                                        <input type="email" placeholder='hello@example.com' className=' input input-bordered w-full' value={signupData.email} onChange={(e) => setSignupData({
                                            ...signupData,
                                            email:e.target.value
                                            }) } required />
                                    </div>

                                    {/* this is password field */}
                                   
                                    <div className="form-control w-full space-y-2">
                                        <label className="password">
                                            <div className=' flex justify-between'>
                                            <span className="label-text text-base font-medium">Password</span>
                                            </div>
                                        </label>
                                        <input type="password" placeholder='••••••••' className=' input input-bordered w-full' value={signupData.password} onChange={(e) => setSignupData({...signupData, password:e.target.value}) } required />
                                        
                                    </div>

                                    {/* this is terms and condition field */}

                                    <div className='form-control w-full'>
                                        <label className='label cursor-pointer justify-start gap-2'>
                                          <input type="checkbox" className='checkbox checkbox-sm' required/>
                                            <span className='label-text'>I agree to the {""}
                                            <span className="text-primary hover:underline">terms of service</span> and {" "} <span className='text-primary hover:underline'>privacy policy</span>
                                            </span>
                                        </label>
                
                                    </div>




                                    {/* button for login  */}

                                    <button type="submit" className="btn btn-primary w-full" disabled=      {isPending}>
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                    Signing up...
                                            </>
                                                    ) : (
                                        "Sign Up"
                                        )}
                                    </button>

                                    {/* forwarding to create account */}


                                    <div className="text-center mt-4">
                                        <p className="text-sm">
                                            Already have an account?{" "}
                                            <Link to="/" className="text-primary hover:underline">
                                                 Sign In
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

export default SignUpPage
