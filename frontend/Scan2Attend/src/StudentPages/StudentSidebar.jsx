import React from "react";
import { HelpingHand, X } from "lucide-react";
import { Palette } from 'lucide-react';

import { SquareX, Croissant,House,Settings,HandHelping,LogOut  } from 'lucide-react'; // to close sidebar in future
import { Link } from "react-router-dom";
const StudentSidebar = () => {
  return (
    // <div className="drawer z-50">

      
    //   {/* drawer-toggle controlled by Navbar */}
    //   <input id="my-drawer" type="checkbox" className="drawer-toggle" />

    //   <div className="drawer-side">
    //     {/* Overlay (clicking it closes sidebar) */}
    //     {/* <button htmlFor="my-drawer"><SquareX/></button> */}
    //     <label
    //       htmlFor="my-drawer"
    //       aria-label="close sidebar"
    //       className="drawer-overlay"
    //     ></label>

    //     {/* Sidebar content */}
    //     <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-2 relative">
          

    //       {/* Sidebar items */}
    //       <li>
    //         <a>Sidebar Item 1</a>
    //       </li>
    //       <li>
    //         <a>Sidebar Item 2</a>
    //       </li>
    //       <li>
    //         <a>Sidebar Item 3</a>
    //       </li>
    //       <li>
    //         <ThemeSelector/>
    //       </li>
    //     </ul>
    //   </div>
    // </div>


    <div className="drawer z-50">
  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-side">
    <label htmlFor="my-drawer" className="drawer-overlay"></label>

    <div className="w-80 bg-base-200 min-h-full p-4 relative flex flex-col">
      {/* Close Button */}
      <label htmlFor="my-drawer" className="btn btn-ghost  absolute top-2 right-1">
        <SquareX className="w-6 h-6 " />
      </label>

      {/* Logo / Title */}
      <div className="mb-6 flex items-center gap-2 p-4 rounded-lg border border-gray-300 shadow-2xl">
        <Croissant className="w-9 h-9 text-primary" />
        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
          Scan2Attend
        </span>
      </div>

      {/* Menu Items */}
      <ul className="menu space-y-2 text-xl font-semibold gap-0">
        <li><a><House/>Home</a></li>
        
        <li><a><Settings/>Setting</a></li>
        
        <li><a><HandHelping/>Help</a></li>
      </ul>
      <div className="mt-auto font-semibold text-xl">
        <Link to = '/'>@
        <button className="btn  btn-error w-full gap-2"><LogOut/>    
          Logout
        </button>
        </Link>
      </div>
      
    </div>
  </div>
  
</div>

  );
};

export default StudentSidebar;
