import img from "../Images/ForgotPassword.png"
import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom'
import {otpSend} from '../lib/api'

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [mobNo, setMobNo] = useState("");
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const navigate = useNavigate();

    const handleForgot = async (e) => {
            e.preventDefault();
            try{
                setIsPending(true)
                localStorage.setItem("otpEmail", email);
                const res = await otpSend({email});
                navigate("/otp")
            }catch(err){
                console.log("error in sending otp "+ err.message);
                setError(err.response?.data?.message || "Failed to send OTP");
            }finally{
                setIsPending(false);
            }

    if (!email.trim() && !mobNo.trim()) {
      setError('Please enter either an email or a phone number.');
      return;
    }

    
    }
  return (
    <div>
        <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' >
            <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>


                {/* right hand section */}


                <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
                    {/* logo section */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <GraduationCap className="size-9 text-primary" />
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                            Scan2Attend
                            </span>

                    </div>

                    {/* error message will come here */}
                    {error && (
                        <div className='alert alert-error mb-4'>
                            <span>{error}</span>
                        </div>
                        
                    )}


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
                                        <input type="email" placeholder='hello@example.com' className=' input input-bordered w-full' value={email} onChange={(e) => setEmail(e.target.value) } required/>
                                    </div>

                                    <div className="text-center text-gray-400 font-semibold">or</div>


                                    {/* mobile number in future add country code also there */}
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text text-base font-medium">Phone number</span>
                                        </label>
                                        <input type="tel" placeholder='temporary disabled' className='input input-bordered w-full' 
                                        pattern="[0-9]{10}" maxLength="10" 
                                        value={mobNo} onChange={(e) => setMobNo(e.target.value)} disabled/>

                                    </div>

                                    {/* this is button with code to make one of the option required */}
                                    <Link to='/otp'>@</Link>
                                    <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs">Sending Otp...</span>
                                                    
                                            </>
                                        ):(
                                            "Generate OTP"
                                        )}
                                        
                                                
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