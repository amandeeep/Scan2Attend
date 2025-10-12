
import { Palette } from 'lucide-react';
import ThemeSelector  from './ThemeSelector';
import { Croissant } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    //fixed top-0 left-0 w-full z-50 add this to make nabar fixed
    <div className="navbar bg-base-100/80 backdrop-blur-md shadow-lg rounded-xl border border-base-200">
    <div className="flex-none">
  <label
    htmlFor="my-drawer"   
    className="btn btn-square btn-ghost hover:bg-base-200 transition-colors shadow-sm drawer-button"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="inline-block h-6 w-6 stroke-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
    </svg>
  </label>
</div>

  <div className="flex-1">
    <span className='hover:scale-105 transition-transform'><button className='btn btn-ghost ml-3 p-1 lg:ml-6'>
      <Croissant className="size-9 text-primary" />
      <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider hidden lg:inline-block">Scan2Attend</span>
    </button>
      </span>
    
    
  </div>
  <div className="flex gap-2 items-center">
    <input
      type="text"
      placeholder="Search"
      className="input input-bordered w-24 md:w-auto shadow-sm focus:shadow-md transition-shadow"
      
    />
    <ThemeSelector/>
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform shadow-sm"
      >
        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100/95 rounded-xl z-[1] mt-3 w-52 p-2 shadow-xl border border-base-200"
      >
        <li>
          <a className="justify-between hover:bg-base-200 rounded-lg transition-colors">
            Profile
            
          </a>
        </li>
        <li><a className="hover:bg-base-200 rounded-lg transition-colors">Settings</a></li>
        <li>
          <Link to= '/'>@
          <a className="hover:bg-base-200 rounded-lg transition-colors">Logout</a>
          </Link>
          </li>
        

      </ul>
    </div>
  </div>
</div>

  )
}

export default Navbar



// import { useState, useEffect, useRef } from 'react';
// import { Palette, Search, X } from 'lucide-react';

// const Navbar = () => {
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
//   const inputRef = useRef(null);

//   // Focus input when mobile search opens
//   useEffect(() => {
//     if (mobileSearchOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [mobileSearchOpen]);

//   // Close mobile search on Escape or outside click
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') {
//         setMobileSearchOpen(false);
//       }
//     };

//     const handleClickOutside = (e) => {
//       if (
//         mobileSearchOpen &&
//         inputRef.current &&
//         !inputRef.current.contains(e.target)
//       ) {
//         setMobileSearchOpen(false);
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [mobileSearchOpen]);

//   return (
//     <div className="navbar bg-base-100/80 backdrop-blur-md shadow-lg rounded-xl border border-base-200">
//       {/* Left: Drawer Toggle */}
//       <div className="flex-none">
//         <label
//           htmlFor="my-drawer"
//           className="btn btn-square btn-ghost hover:bg-base-200 transition-colors shadow-sm drawer-button"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             className="inline-block h-6 w-6 stroke-current"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4 6h16M4 12h16M4 18h16"
//             ></path>
//           </svg>
//         </label>
//       </div>

//       {/* Center: Brand */}
//       <div className="flex-1">
//         <a className="btn btn-ghost text-xl font-bold hover:scale-105 transition-transform">
//           Scan2Attend
//         </a>
//       </div>

//       {/* Right: Controls */}
//       <div className="flex gap-2 items-center relative">
//         {/* Desktop Search Input */}
//         <input
//           type="text"
//           placeholder="Search"
//           className="input input-bordered w-24 md:w-auto shadow-sm focus:shadow-md transition-shadow hidden md:block"
//         />

//         {/* Mobile Search Icon */}
//         {!mobileSearchOpen && (
//           <button
//             className="btn btn-ghost btn-circle md:hidden hover:bg-base-200 transition-colors shadow-sm"
//             title="Search"
//             aria-label="Search"
//             onClick={() => setMobileSearchOpen(true)}
//           >
//             <Search className="h-5 w-5" />
//           </button>
//         )}

//         {/* Expanded Mobile Search */}
//         {mobileSearchOpen && (
//           <div className="absolute right-12 bottom-0 translate-y-full z-10 md:hidden">
//             <div className="flex items-center bg-base-100 border border-base-300 shadow-lg rounded-full p-1 px-3">
//               <Search className="w-4 h-4 text-base-content/70" />
//               <input
//                 type="text"
//                 ref={inputRef}
//                 placeholder="Search..."
//                 className="input border-none focus:outline-none focus:ring-0 bg-transparent text-sm w-40"
//               />
//               <button
//                 onClick={() => setMobileSearchOpen(false)}
//                 className="ml-2 text-base-content/60 hover:text-error transition-colors"
//                 title="Close"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Palette Icon */}
//         <button
//           className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors shadow-sm"
//           title="Theme"
//           aria-label="Toggle Theme"
//         >
//           <Palette className="h-5 w-5" />
//         </button>

//         {/* Avatar Dropdown */}
//         <div className="dropdown dropdown-end">
//           <div
//             tabIndex={0}
//             role="button"
//             className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform shadow-sm"
//           >
//             <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
//               <img
//                 alt="User Avatar"
//                 src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//               />
//             </div>
//           </div>
//           <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content bg-base-100/95 rounded-xl z-[1] mt-3 w-52 p-2 shadow-xl border border-base-200"
//           >
//             <li>
//               <a className="justify-between hover:bg-base-200 rounded-lg transition-colors">
//                 Profile
//               </a>
//             </li>
//             <li>
//               <a className="hover:bg-base-200 rounded-lg transition-colors">
//                 Settings
//               </a>
//             </li>
//             <li>
//               <a className="hover:bg-base-200 rounded-lg transition-colors">
//                 Logout
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
