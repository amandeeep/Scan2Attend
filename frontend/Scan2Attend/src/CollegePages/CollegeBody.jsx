import React from 'react'
import { Outlet } from 'react-router-dom'
import CollegeNavbar from './CollegeNavbar'
import CollegeSidebar from './CollegeSidebar'

export const CollegeBody = () => {
  return (
    <div>      
        <CollegeNavbar/>
        <CollegeSidebar/>
        <Outlet/>
        <h1>Currently College facilities under construction</h1>
    </div>
  )
}
