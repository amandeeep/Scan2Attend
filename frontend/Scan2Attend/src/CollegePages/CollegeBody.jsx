import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import CollegeHome from './CollegeHome'
import CollegeAttendance from './CollegeAttendance'
import SignUpPage from '../AuthPages/SignUpPage'
export const CollegeBody = () => {
  return (


    // className="min-h-screen bg-base-100"   use this to make ui align to full screen
    <div>      
        <Navbar/>
        <Sidebar/>
        <Outlet/>
        
        <CollegeHome/>
        {/* <SignUpPage/> */}
        <CollegeAttendance/>
    </div>
  )
}



// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import Navbar from '../components/Navbar'
// import Sidebar from '../components/Sidebar'

// export const CollegeBody = () => {
//   return (
//     <div className="min-h-screen bg-base-100">
//       <Navbar />

//       <div className="flex">
//         <Sidebar />

//         <main className="flex-1 p-4">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }
