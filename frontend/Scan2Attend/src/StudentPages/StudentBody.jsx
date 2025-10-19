import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Sidebar } from "lucide-react";
import StudentSidebar from "./StudentSidebar";
const StudentBody = () =>{
    return(
        <>
        <Navbar/>
        <StudentSidebar/>
        
        </>
    )
}

export default StudentBody;