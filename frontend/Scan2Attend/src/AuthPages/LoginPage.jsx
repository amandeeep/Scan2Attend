import { useState } from 'react'
import { GraduationCap } from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom'
import { login } from '../lib/api';
import img from '../Images/BoyAtten.png'
import google from '../Images/GoogleLogo.png'
import { useDispatch } from 'react-redux'
import {addUser, removeUser} from '../store/userSlice'
import { setAuth, setOnboard, setIsRole, removeAuth } from '../store/authSlice';

const LoginPage = () => {
    const [loginData, setLoginData] = useState({
        email:"",
        password: "",
        role: '',
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(null);
    const [error, setError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            setIsPending(true);
            const res = await login(loginData);
            if(res.role === 'student'){
                dispatch(setAuth(true));
                dispatch(setOnboard(res.isOnboard));
                dispatch(setIsRole(res.role));
                dispatch(addUser(res.userDetails));
            }
            else if(res.role === 'teacher'){
                dispatch(setAuth(true));
                dispatch(setOnboard(res.isOnboard));
                dispatch(setIsRole(res.role));
                dispatch(addUser(res.userDetails));
            }
            else if(res.role === 'college'){
                dispatch(setAuth(true));
                dispatch(setOnboard(res.isOnboard));
                dispatch(setIsRole(res.role));
                dispatch(addUser(res.userDetails));
            }
        }catch(err){
            console.error("Login failed:", error.message);
            setError(error.response?.data?.message || "Login failed");
            dispatch(removeAuth());
            dispatch(removeUser());
        }finally{
           setIsPending(false); 
           
        }
    }

  return (
    <div >
        
        <div className=' flex items-center justify-center p-4 sm:p-6 md:p-8' >
            {/* RightSide form section */}
            <div>
                <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
                    <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
                    {/* logo of the website */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <GraduationCap className="size-9 text-primary" />
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
                                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                                    <p className="text-sm opacity-70">
                                    Sign in to your account 
                                    </p>
                                </div>
                                
                                {/* Select role */}
                                
                                <div className="mb-4">
                                <span className="text-base font-medium">Select Role:</span>
                                <div className="flex gap-6 mt-2">
                                    {["student", "teacher", "college"].map((role) => (
                                    <label key={role} className="cursor-pointer flex items-center gap-2 rounded-lg border p-2">
                                        <input
                                        type="radio"
                                        name="role"
                                        value={role}
                                        checked={loginData.role === role}
                                        onChange={(e) =>
                                            setLoginData({ ...loginData, role: e.target.value })
                                        }
                                        required
                                        />
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </label>
                                    ))}
                                </div>
                                </div>

                                {/* this is email field */}
                                <div className="flex flex-col gap-3">
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text text-base font-medium">Email</span>
                                        </label>
                                        <input type="email" placeholder='hello@example.com' className=' input input-bordered w-full' value={loginData.email} onChange={(e) => setLoginData({...loginData,email:e.target.value}) } required />
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
                                        <input type="password" placeholder='••••••••' className=' input input-bordered w-full' value={loginData.password} onChange={(e) => setLoginData({...loginData, password:e.target.value}) } required />
                                        
                                    </div>




                                    {/* button for login  */}
                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                    <button type="submit" className="btn btn-primary flex-1" disabled={isPending}>
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs">Signing in...</span>
                                                    
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
