import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export const CollegeBody = () => {
  return (
    <div>
        <Navbar/>
        <Sidebar/>
        
        <Outlet/>
    </div>
  )
}
