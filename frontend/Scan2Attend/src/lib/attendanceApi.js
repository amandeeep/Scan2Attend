import { axiosInstance } from "./axios";


// get attendance

export const getAttendance = async(params) => {
    const response = await axiosInstance.get('/attendance/view', { params });
    return response.data;
}

// markAttendance

export const markAttendance = async(markData) => {
    const response = await axiosInstance.post('/attendance/mark', markData);
    return response.data;
}

// updateAttendance

export const updateAttendance = async (updateData) => {
    const response = await axiosInstance.put('/attendance/update', updateData);
}