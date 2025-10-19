import { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import LoginPage from './AuthPages/LoginPage'
import ForgotPasswordPage from './AuthPages/ForgotPasswordPage'
import NewPasswordPage from './AuthPages/NewPasswordPage'
import SignUpPage from './AuthPages/SignUpPage'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import OtpPage from './AuthPages/OtpPage'
import { CollegeBody } from './CollegePages/CollegeBody'
import StudentBody from './StudentPages/StudentBody';
import StudentOnboard from './StudentPages/StudentOnboard';

function App() {
  
const theme = useSelector((state) => state.theme.currentTheme);

  
  return (
    <>
      <div className='h-screen' data-theme={theme}>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        {/* <Route path='/login/google' element={<LoginPage/>}/> */}
        <Route path='/login/forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='/login/reset-password' element={<NewPasswordPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/otp' element={<OtpPage/>}/>
        <Route path='/college/dashboard' element={<CollegeBody/>}/>
        
      </Routes>
      
      </div>
     </>
    //////////////////////
    // <div className='min-h-screen' data-theme={theme}>
    // <StudentOnboard/>
    // </div>

  )
}

export default App
