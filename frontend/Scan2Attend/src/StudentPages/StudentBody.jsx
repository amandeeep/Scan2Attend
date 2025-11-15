import { Outlet } from "react-router-dom";
import Navbar from "./StudentNavbar";
import { Sidebar } from "lucide-react";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
const StudentBody = () =>{
    return(
        <>
        <StudentNavbar/>
        <StudentSidebar/>
        <Outlet/>
        
        </>
    )
}

export default StudentBody;