import React from 'react'
import img from "../Images/ForgotPassword.png"
import { useState } from 'react';
import { Croissant } from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom'
import { resetPass } from '../lib/api';
const NewPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (e) => {
            e.preventDefault();

        if (!newPassword.trim() && !confirmPassword.trim()) {
        setError('Please enter password.');
        return;
        }
        else if(newPassword != confirmPassword){
            setError('Confirm password not matches')
        }
        try{
            setIsPending(true);
            const res = await resetPass({
                enterPassword: newPassword,
                confirmPassword,
            })
            navigate("/")
        }
        catch(err){
            console.log("Error in updating password "+ err.message);
            setError(err.response?.data?.message || "Failed to update");
        }
        finally{
            setIsPending(false);
        }

    //setError('Both field should be filled and matches'); // set this to setError('') when backend code comes
    

    // alert(`Submitted: Both field should be filled and matches`);  // also uncoment this
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
                    {error && (
            <div className="alert alert-error mb-4">
                
              <span>{error}</span>  
              
            </div>
          )}

                    <div>
                        <form onSubmit={handleCreate}>
                            <div className='space-y-4'>
                                <div>
                                    <h2 className="text-xl font-semibold">New Password</h2>
                                    
                                </div>

                                
                                <div className="flex flex-col gap-3">


                                    {/* this is new password field */}

                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text text-base font-medium">Enter Password</span>
                                        </label>
                                        <input type="password" placeholder='•••••••••' className=' input input-bordered w-full' value={newPassword} onChange={(e) => setNewPassword(e.target.value) } required />
                                    </div>

                                    <div className="text-center text-gray-400 font-semibold">&</div>


                                    {/* confirm new password field */}
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text text-base font-medium">Confirm Password</span>
                                        </label>
                                        <input type="password" placeholder='•••••••••' className='input input-bordered w-full' value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)} required/>

                                    </div>

                                    {/* this is button  */}
                                    <Link to='/'>@</Link>
                                    <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                                        {isPending ? (
                                            <span className="loading loading-spinner loading-xs">Updating...</span>
                                        ):(
                                            "Save"
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
                                                <img src={img} alt="Attandence" className="w-full h-full" />
                                            </div>
                
                                            <div className="text-center space-y-3 mt-6">
                                            <h2 className="text-xl font-semibold">Forgot Password! Don't Worry</h2>
                                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                                Just create new one
                                             </p>                                            
                                            </div>
                                        </div>
                                    </div>
            </div>
        </div>
    </div>
  )
}

export default NewPasswordPage
