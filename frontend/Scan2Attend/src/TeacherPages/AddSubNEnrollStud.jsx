import {useState} from 'react';
import { addSubject, enrollStudent } from '../lib/subjectApi';
import TagInput from "../components/TagInput";

const AddSubNEnrollStud = () => {
    const [addSub, setAddSub] = useState({
        name: "",
        code: "",
        semester: "",
        department: "",
    });
    const [enrollStud, setEnrollStud] = useState({
        subjectCode: "",
        studentIds: []
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('addSubject'); // Tab state

    const addFxn = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccessMessage(null);
            setLoading(true);
            
            const data = {
                name: addSub.name.trim(),
                department: addSub.department,
                code: addSub.code,
                semester: addSub.semester,
            };
            
            const res = await addSubject(data);
            
            setAddSub({
                name: "",
                code: "",
                semester: "",
                department: "",
            });
            
            setSuccessMessage("Subject added successfully!");
            document.getElementById("success_modal").showModal();
        } catch (err) {
            console.error("Error in the addFxn", err);
            setError(err.message || "Error adding subject");
        } finally {
            setLoading(false);
        }
    };

    const enrollFxn = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccessMessage(null);
            setLoading(true);
            
            if (enrollStud.studentIds.length === 0) {
                setError("Please add at least one student ID");
                return;
            }
            
            const data = {
                subjectCode: enrollStud.subjectCode,
                studentIds: enrollStud.studentIds,
            };

            const res = await enrollStudent(data);
            
            setEnrollStud({
                subjectCode: "",
                studentIds: []
            });
            
            setSuccessMessage(`${enrollStud.studentIds.length} student(s) enrolled successfully!`);
            document.getElementById("success_modal").showModal();
        } catch (err) {
            console.error("Error in the enrollFxn", err);
            setError(err.message || "Error enrolling students");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
                
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-2">
                        📚 Subject Management
                    </h1>
                    <p className="text-sm sm:text-base text-base-content/70">
                        Add new subjects and enroll students efficiently
                    </p>
                </div>

                
                {error && (
                    <div className="alert alert-error shadow-lg mb-4 sm:mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm sm:text-base">{error}</span>
                        <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>✕</button>
                    </div>
                )}

                {/* Tabs for Mobile/Tablet */}
                <div className="tabs tabs-boxed bg-base-100 shadow-md mb-6 p-1 flex lg:hidden">
                    <a 
                        className={`tab flex-1 text-sm sm:text-base ${activeTab === 'addSubject' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('addSubject')}
                    >
                        ➕ Add Subject
                    </a>
                    <a 
                        className={`tab flex-1 text-sm sm:text-base ${activeTab === 'enrollStudent' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('enrollStudent')}
                    >
                        👥 Enroll Students
                    </a>
                </div>

                {/* Two Column Layout for Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    
                    {/* Add Subject Card */}
                    <div className={`${activeTab === 'addSubject' ? 'block' : 'hidden'} lg:block lg:h-full`}>
                        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
                            <div className="card-body p-4 sm:p-6 flex flex-col">
                                <h2 className="card-title text-xl sm:text-2xl mb-4 flex items-center gap-2">
                                    <span className="text-2xl sm:text-3xl">➕</span>
                                    <span>Add Subject</span>
                                </h2>
                                
                                <form onSubmit={addFxn} className="space-y-4 flex-grow">
                                    {/* Subject Name */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-sm sm:text-base">Subject Name</span>
                                            <span className="label-text-alt text-error text-xs sm:text-sm">*</span>
                                        </label>
                                        <input 
                                            type="text"
                                            placeholder="e.g., DATA STRUCTURES"
                                            className="input input-bordered w-full text-sm sm:text-base"
                                            value={addSub.name}
                                            onChange={(e) => setAddSub({...addSub, name: e.target.value.toUpperCase()})}
                                            required
                                        />
                                    </div>

                                    {/* Subject Code */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-sm sm:text-base">Subject Code</span>
                                            <span className="label-text-alt text-error text-xs sm:text-sm">*</span>
                                        </label>
                                        <input 
                                            type="text"
                                            placeholder="e.g., CS201"
                                            className="input input-bordered w-full text-sm sm:text-base"
                                            value={addSub.code}
                                            onChange={(e) => setAddSub({...addSub, code: e.target.value.toUpperCase().replace(/\s+/g,'')})}
                                            required
                                        />
                                        <label className="label">
                                            <span className="label-text-alt text-xs">No spaces allowed</span>
                                        </label>
                                    </div>

                                    {/* Semester and Department Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Semester */}
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold text-sm sm:text-base">Semester</span>
                                                <span className="label-text-alt text-error text-xs sm:text-sm">*</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full text-sm sm:text-base"
                                                value={addSub.semester}
                                                onChange={(e) => setAddSub({...addSub, semester: e.target.value})}
                                                required
                                            >
                                                <option value="" disabled>Select Semester</option>
                                                <option value="ALL">ALL</option>
                                                <option value="1">Semester 1</option>
                                                <option value="2">Semester 2</option>
                                                <option value="3">Semester 3</option>
                                                <option value="4">Semester 4</option>
                                                <option value="5">Semester 5</option>
                                                <option value="6">Semester 6</option>
                                                <option value="7">Semester 7</option>
                                                <option value="8">Semester 8</option>
                                            </select>
                                        </div>

                                        {/* Department */}
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold text-sm sm:text-base">Department</span>
                                                <span className="label-text-alt text-error text-xs sm:text-sm">*</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full text-sm sm:text-base"
                                                value={addSub.department}
                                                onChange={(e) => setAddSub({...addSub, department: e.target.value})}
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

                                    {/* Submit Button */}
                                    <div className="card-actions justify-end pt-4 mt-auto">
                                        <button 
                                            type="submit" 
                                            className={`btn btn-primary w-full sm:w-auto text-sm sm:text-base ${loading ? 'loading' : ''}`}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Add Subject
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Enroll Students Card */}
                    <div className={`${activeTab === 'enrollStudent' ? 'block' : 'hidden'} lg:block lg:h-full`}>
                        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
                            <div className="card-body p-4 sm:p-6 flex flex-col">
                                <h2 className="card-title text-xl sm:text-2xl mb-4 flex items-center gap-2">
                                    <span className="text-2xl sm:text-3xl">👥</span>
                                    <span>Enroll Students</span>
                                </h2>
                                
                                <form onSubmit={enrollFxn} className="space-y-4 flex-grow">
                                    {/* Subject Code */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-sm sm:text-base">Subject Code</span>
                                            <span className="label-text-alt text-error text-xs sm:text-sm">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g., CS201" 
                                            className="input input-bordered w-full text-sm sm:text-base"
                                            value={enrollStud.subjectCode} 
                                            onChange={(e) => setEnrollStud({...enrollStud, subjectCode: e.target.value.toUpperCase().replace(/\s+/g,'')})}
                                            required
                                        />
                                        <label className="label">
                                            <span className="label-text-alt text-xs">Enter existing subject code</span>
                                        </label>
                                    </div>

                                    {/* Student IDs */}
                                    <div className="form-control">
                                        <TagInput
                                            label="Student IDs"
                                            value={enrollStud.studentIds}
                                            onChange={(values) => setEnrollStud({...enrollStud, studentIds: values})}
                                        />
                                        <label className="label">
                                            <span className="label-text-alt text-xs">
                                                💡 Type ID and press Enter to add multiple students
                                            </span>
                                            <span className="label-text-alt text-xs font-semibold">
                                                {enrollStud.studentIds.length} student{enrollStud.studentIds.length !== 1 ? 's' : ''} added
                                            </span>
                                        </label>
                                    </div>

                                    {/* Student IDs Preview */}
                                    {enrollStud.studentIds.length > 0 && (
                                        <div className="alert alert-info shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5 sm:w-6 sm:h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <div className="text-xs sm:text-sm">
                                                <span className="font-semibold">Ready to enroll:</span>
                                                <span className="ml-2">{enrollStud.studentIds.length} student(s) to {enrollStud.subjectCode || '[Subject Code]'}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="card-actions justify-end pt-4 mt-auto">
                                        <button 
                                            type="submit" 
                                            className={`btn btn-success w-full sm:w-auto text-sm sm:text-base ${loading ? 'loading' : ''}`}
                                            disabled={loading || enrollStud.studentIds.length === 0}
                                        >
                                            {loading ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                    </svg>
                                                    Enroll Students
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 sm:mt-8">
                    <div className="stat bg-base-100 shadow-md rounded-lg p-4">
                        <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <div className="stat-title text-xs sm:text-sm">Quick Tip</div>
                        <div className="stat-value text-primary text-lg sm:text-2xl">Add</div>
                        <div className="stat-desc text-xs">Create subjects first, then enroll</div>
                    </div>
                    
                    <div className="stat bg-base-100 shadow-md rounded-lg p-4">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <div className="stat-title text-xs sm:text-sm">Bulk Action</div>
                        <div className="stat-value text-secondary text-lg sm:text-2xl">Enroll</div>
                        <div className="stat-desc text-xs">Multiple students at once</div>
                    </div>

                    <div className="stat bg-base-100 shadow-md rounded-lg p-4 sm:col-span-2 lg:col-span-1">
                        <div className="stat-figure text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div className="stat-title text-xs sm:text-sm">Status</div>
                        <div className="stat-value text-accent text-lg sm:text-2xl">Ready</div>
                        <div className="stat-desc text-xs">System operational</div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <dialog id="success_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-success flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Success!
                    </h3>
                    <p className="py-4">{successMessage}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-success">OK</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AddSubNEnrollStud;