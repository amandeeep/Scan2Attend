import {useState} from 'react'
import toast, { Toaster } from 'react-hot-toast';
const AddUser = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [sem, setSem] = useState("");
    const [department, setDepartment] = useState("");
    const [branch, setBranch] = useState("");
    const [isLogging, setIsLogging] = useState(false);
    const [call, setCall] = useState("");
    const [roll, setRoll] = useState("");


    const handleClose = (e) => {
        setIsOpen(false);
        setBranch("");
        setCall("");
        setDepartment("");
        setEmail("");
        setGender("");
        setName("");
        setPassword("");
        setRoll("");
        setSem("");
    }
    const handleSubmit = (e) => {
        if(gender == "") toast("Please select a gender");
        
        
    }
  return (


// onClick={()=>setIsOpen(true)}
// open={isOpen}
// we dont need this because our dialog box works on checkbox

    <div className='' >
        <Toaster/>
        {/* The button to open modal */}



        
<label htmlFor="my_modal_6" className="btn bg-gradient-to-r from-primary to-secondary font-mono" >Add Student!</label>

{/* Put this part before </body> tag */}
<form action={handleSubmit} >
<input type="checkbox"  className="modal-toggle" id="my_modal_6"/>
<div className="modal" role="dialog">
        
  <div className="modal-box">
    <h3 className="text-xl font-bold m-2 mb-5 font-mono">Add New Student!</h3>
    <div className='flex flex-col gap-3 '>
    <div className='form-control w-full space-y-2'>
        <label>Full Name</label>
        <input type="text" placeholder="Name" className=' rounded border-2 ' value={name} onChange={(e) => setName(e.target.value) } required/>
    </div>
    <div className='form-control w-full space-y-2'>
        <label>Email</label>
        <input type="email" placeholder="Email" className=' rounded border-2 ' value={email} onChange={(e) => setEmail(e.target.value) } required/>
    </div>
    <div className='form-control w-full space-y-2'>
        <label>Password</label>
        <input type="password" placeholder="Password" className=' rounded border-2 ' value={password} onChange={(e) => setPassword(e.target.value) } required/>
    </div>
    <div className='form-control w-full space-y-2'>
        <label>Select Gender</label>
        <select className=' rounded border-2' value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select one</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="Others">Others</option>
        </select>
    </div>
    <div className='form-control w-full space-y-2'>
        <label>Semester</label>
        <input type="number" placeholder="Semester" className=' rounded border-2 ' value={sem} onChange={(e) => setSem(e.target.value) } required/>
    </div>
    <div className='form-control w-full space-y-2'>
        <label>Department</label>
        <input type="text" placeholder="Department" className=' rounded border-2 ' value={department} onChange={(e) => setDepartment(e.target.value) } required/>
    </div>
    <div className='form-control w-full space-y-2'>
        <label>Branch</label>
        <input type="text" placeholder="Branch" className=' rounded border-2 ' value={branch} onChange={(e) => setBranch(e.target.value) } required/>
    </div>
    <div className='form-control w-full space-y-2'>
        <label>Roll Number</label>
        <input type="number" placeholder="Roll Number" className=' rounded border-2 ' value={roll} onChange={(e) => setRoll(e.target.value) } required/>
    </div>
    <div className='form-control w-full space-y-2'>
        <label>Phone Number</label>
        <input type="number" placeholder="Phone Number" className=' rounded border-2 ' value={call} onChange={(e) => setCall(e.target.value) } required/>
    </div>
    </div>
    {/* <p className="py-4">This modal works with a hidden checkbox!</p> */}
    <div className="modal-action">
      <label htmlFor="my_modal_6" className="btn reset" onClick={handleClose}>Close!</label>
      <button type='button' onClick={handleSubmit}  className="btn btn-primary">Submit!</button>
    </div>
  </div>
</div>
</form>
    </div>
  )
}

export default AddUser