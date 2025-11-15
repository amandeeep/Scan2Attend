import { axiosInstance } from "./axios";

// get Student Subjects or student list

export const getStudentSubjects = async(data) => {
    const response = await axiosInstance.post('/subject/get-subjects/', data);
    return response.data;
}

// add subjcts

export const addSubject = async(data) => {
    const response = await axiosInstance.post('/subject/add', data);
    return response.data;
}

export const enrollStudent = async(data) => {
    const response = await axiosInstance.post('/subject/enroll', data);
    return response;
}