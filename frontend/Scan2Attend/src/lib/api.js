import { axiosInstance } from "./axios";


// login

export const login = async(loginData) => {
    const response = await axiosInstance.post("/auth/login",loginData);
    return response.data;
}


// signup

export const signup = async (signupData) => {
    const res = await axiosInstance.post("/auth/signup", signupData);
    return res.data;
}


// otp

export const otpSend = async (otpData) => {
    const res = await axiosInstance.post("/auth/send-otp", otpData);
    return res.data;
}


// verify-otp

export const verifyOtp = async (verifyOtpData) => {
    const res = await axiosInstance.post('/auth/verify-otp', verifyOtpData);
    return res.data;
}


// reset password 

export const resetPass = async (resetPassData) => {
    const res = await axiosInstance.post('/auth/reset-password', resetPassData);
    return res.data;
}

// logout

export const logout = async () => {
    const res = await axiosInstance.post('/auth/logout')
    return res.data;
}

export const studentOnboard = async (studentOnboardData) => {
    const res = await axiosInstance.post('/auth/studentOnboard', studentOnboardData);
    return res.data;
}

export const profile = async () => {
    const res = await axiosInstance.post('/profile/student');
    return res.data;
}