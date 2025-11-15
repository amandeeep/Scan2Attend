import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import LoginPage from './AuthPages/LoginPage'
import ForgotPasswordPage from './AuthPages/ForgotPasswordPage'
import NewPasswordPage from './AuthPages/NewPasswordPage'
import SignUpPage from './AuthPages/SignUpPage'
import { BrowserRouter,Routes, Route, Navigate } from 'react-router-dom'
import OtpPage from './AuthPages/OtpPage'
import { CollegeBody } from './CollegePages/CollegeBody'
import StudentBody from './StudentPages/StudentBody';
import StudentOnboard from './StudentPages/StudentOnboard';
import { addUser, loadUser } from './store/userSlice';
import StudentAttendanceView from './StudentPages/StudentAttendanceView';
import TeacherMarkAttendance from './TeacherPages/TeacherMarkAttendance';
import AddSubNEnrollStud from './TeacherPages/AddSubNEnrollStud';
import TeacherDashboard from './TeacherPages/TeacherDashboard';
import TeacherBody from './TeacherPages/TeacherBody';
import TeacherOnboard from './TeacherPages/TeacherOnboard';
import CollegeOnboard from './CollegePages/CollegeOnboard';
import CollegeHome from './CollegePages/CollegeHome';
import { loadAuth } from './store/authSlice';
import StudentDashboard from './StudentPages/StudentDashboard';

function App() {
const dispatch = useDispatch();
useEffect(() => {
  dispatch(loadAuth());
  dispatch(loadUser());
}, [])
const theme = useSelector((state) => state.theme.currentTheme);
const isAuth = useSelector((state) => state.auth.isAuthenticated);
const isOnboard = useSelector((state) => state.auth.isOnboarded);
const isRole = useSelector((state) => state.auth.isRole);
const userData = useSelector((state) => state.user.userData);
  return (
    <>
      <div className='h-screen' data-theme={theme}>
      <Routes>
        
        {/* auth routes */}

        <Route path='/' element={(!isAuth) ?( <LoginPage/>) : isRole === 'student' ? (<Navigate to ={isOnboard ? '/student' : '/student/onboard'}/>) : isRole === 'teacher' ? (<Navigate to = {isOnboard ? '/teacher' : '/teacher/onboard'}/>) : isRole === 'college' ? (<Navigate to = {isOnboard ? '/college': 'college/onboard'}/>) : (<Navigate to="/not-found" />)}/>
        <Route path='/login/forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='/login/reset-password' element={<NewPasswordPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/otp' element={<OtpPage/>}/>

        {/* onboarding routes */}

        <Route path='/student/onboard' element={(isAuth && isRole === 'student') ? <StudentOnboard/> : <Navigate to ='/'/>}/>
        <Route path='/college/onboard' element={(isAuth && isRole === 'college') ? <CollegeOnboard/> : <Navigate to ='/'/>}/>
        <Route path ='/teacher/onboard' element={(isAuth && isRole === 'teacher') ? <TeacherOnboard/> : <Navigate to ='/'/>}/>

        {/* student routes */}

        <Route path='/student' element={(isAuth && (isRole === 'student')) ? <StudentBody/> : <Navigate to = '/'/>}>
          <Route index element = {<StudentDashboard/>}/>
          <Route path = 'attendance-view' element={<StudentAttendanceView/>}/>
        </Route>

        {/* college routes */}

        <Route path='/college' element={(isAuth && (isRole === 'college')) ? <CollegeBody/> : <Navigate to = '/'/>}>
          <Route index element = {<CollegeHome/>}/>
        </Route>
        
        {/* teacher Routes */}

        <Route path = '/teacher' element={(isAuth && (isRole === 'teacher')) ? <TeacherBody/> : <Navigate to = '/'/>}>
          {/* <Route path = '/teacher/dashboard' element={<TeacherDashboard/>}/>  wrong practice */}
          <Route index element={<TeacherDashboard />} />
          <Route path='addNenroll' element={<AddSubNEnrollStud/>}/>
          <Route path='attendance-mark' element={<TeacherMarkAttendance/>}/>
        </Route>

      </Routes>
      </div>
     </>
  )
}

export default App
