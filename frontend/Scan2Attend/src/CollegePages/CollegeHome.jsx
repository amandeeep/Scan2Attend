import React from 'react'
import { useState } from "react";
import AddUser from '../components/AddUser';
const CollegeHome = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div>
        <div className='flex justify-between m-3'>
            <span className='text-3xl font-bold font-mono bg-clip-text tracking-wider'>Dashboard</span>
            <span><AddUser/></span> 
        </div>
      </div>
    </>
  )
}

export default CollegeHome