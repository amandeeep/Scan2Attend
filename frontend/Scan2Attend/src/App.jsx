import { useState } from 'react'
import LoginPage from './Pages/LoginPage'
import ForgotPasswordPage from './Pages/ForgotPasswordPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <LoginPage/> */}
    <ForgotPasswordPage/>
    </>
  )
}

export default App
