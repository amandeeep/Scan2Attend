import { useState } from 'react'
import LoginPage from './Pages/LoginPage'
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
import NewPasswordPage from './Pages/NewPasswordPage'
import SignUpPage from './Pages/SignUpPage'
import { BrowserRouter,Routes, Route } from 'react-router-dom'

function App() {
  

  return (
    <>
    

      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        {/* <Route path='/login/google' element={<LoginPage/>}/> */}
        <Route path='/login/forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='/login/reset-password' element={<NewPasswordPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        
      </Routes>

    
    </>
  )
}

export default App
