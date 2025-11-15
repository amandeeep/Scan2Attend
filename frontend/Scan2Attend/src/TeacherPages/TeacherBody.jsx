import { Outlet } from "react-router-dom";
import TeacherNavbar from './TeacherNavbar';
import TeacherSidebr from './TeacherSidebar';


const TeacherBody = () =>{
    return(
        <div>
            <TeacherNavbar/>
            <TeacherSidebr/>
            <Outlet/>
        </div>
    )
}

export default TeacherBody;