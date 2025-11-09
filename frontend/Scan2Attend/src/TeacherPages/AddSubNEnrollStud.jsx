import {useState} from 'react';
import { addSubject, enrollStudent } from '../lib/subjectApi';
import TagInput from "../components/TagInput";
const AddSubNEnrollStud = () => {
    const[addSub, setAddSub] = useState({
        name : "",
        code : "",
        semester : "",
        department : "",
    });
    const[enrollStud, setEnrollStud] = useState({
        subjectCode : "",
        studentIds : []
    })
    const[error, setError] = useState(null);
    const[loading, setLoading] = useState(false);
console.log(addSub)
    const addFxn = async (e) =>{
        e.preventDefault()
       console.log("addfxn")
       console.log(addSub)
        try{
            setError(null);
            setLoading(true);
            const data = {
                name: addSub.name.trim(),
                department: addSub.department,
                code: addSub.code,
                semester: addSub.semester,
            }
            const res = await addSubject(data);
            setAddSub({
            name: "",
            code: "",
            semester: "",
            department: "",
            });

        }catch(err){
            console.log("Error in the addFxn "+err.message);
            setError("Error in add subject "+err.message);
        }
        finally{
            setLoading(false);
        }
    }
    const enrollFxn = async (e) => {
        e.preventDefault();
        try{
            setError(null);
            setLoading(true);
            const data = {
                subjectCode: enrollStud.subjectCode,
                studentIds: enrollStud.studentIds,
            }

            const res = await enrollStudent(data);
            setEnrollStud({
                subjectCode : "",
                studentIds : []
            })

        }catch(err){
            console.log("Error in the addFxn "+err.message);
            setError("Error in add subject "+err.message);
        }
        finally{
            setLoading(false);
            
        }
    }
    console.log(enrollStud)
    return(
        <div>
            <div>
                <h2>Add Subject</h2>
                <form onSubmit={addFxn}>
                    <div>
                    <div>
                    <label>Name : </label>
                    <input 
                    type="text"
                    placeholder='One at a time'
                    value = {addSub.name}
                    onChange={(e)=> setAddSub({...addSub, name: e.target.value.toUpperCase()})}
                    required
                    />
                    </div><div>
                    <label>Code : </label>
                    <input 
                    type="text"
                    placeholder='One at a time'
                    value = {addSub.code}
                    onChange={(e)=> setAddSub({...addSub, code: e.target.value.toUpperCase().replace(/\s+/g,'')})}
                    required
                    />
                    </div>
                    <div>
                        <label>Semester : </label>
                        <select
                        value = {addSub.semester}
                        onChange = {(e)=>setAddSub({...addSub, semester: e.target.value})}
                        required
                        >
                            <option value="" disabled>Select Semester</option>
                            <option value="ALL">ALL</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label>Department : </label>
                            <select
                                className="select select-bordered w-full"
                                value={addSub.department}
                                onChange={(e) => setAddSub({ ...addSub, department: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select Department</option>
                                <option value="ALL">ALL</option>
                                <option value="CSE">CSE</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="MECHANICAL">MECHANICAL</option>
                                <option value="IT">IT</option>
                                <option value="ECE">ECE</option>
                            </select>
                        </div>
                    </div>
                    <button type='submit'>Add</button>
                </form>
            </div>
            <div>
                <h2>Enroll Students</h2>
                <form onSubmit =  {enrollFxn}>
                    <div>
                        <div>
                            <div>
                            <label>Subject Code</label>
                            <input type="text" placeholder='Code' required value={enrollStud.subjectCode} onChange={(e) => setEnrollStud({...enrollStud, subjectCode: e.target.value.toUpperCase().replace(/\s+/g,'')})} />
                            </div>
                            <div>
                                <TagInput
                                        label="Add StudentIds"
                                        value={enrollStud.studentIds}
                                        onChange={(values) =>setEnrollStud({ ...enrollStud, studentIds: values })}

                                      />
                            </div>
                        </div>
                        <div>
                            <button type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default AddSubNEnrollStud;
