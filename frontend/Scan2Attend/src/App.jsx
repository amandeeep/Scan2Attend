import { useState } from 'react'
import LoginPage from './Pages/LoginPage'
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
import NewPasswordPage from './Pages/NewPasswordPage'
import SignUpPage from './Pages/SignUpPage'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import OtpPage from './Pages/OtpPage'

function App() {
  

  return (
    <>
    
      <div className='h-screen' data-theme="forest">
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        {/* <Route path='/login/google' element={<LoginPage/>}/> */}
        <Route path='/login/forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='/login/reset-password' element={<NewPasswordPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/otp' element={<OtpPage/>}/>
        
      </Routes>
      </div>

    
    </>
  )
}

export default App
