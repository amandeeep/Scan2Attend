import { axiosInstance } from "./axios";


// login

export const login = async(loginData) => {
    const response = await axiosInstance.post("/api/auth/login",loginData);
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

// Onboard

export const onboard = async (onboardData) => {
    const res = await axiosInstance.post('/auth/onboard', onboardData);
    return res.data;
}

// profile

export const profile = async () => {
    const res = await axiosInstance.post('/profile/user');
    return res.data;
}

// addUser

export const addUser = async (data) => {
    const res = await axiosInstance.post('/auth/addUser', data);
    return res;
}


// upload avatar

export const uploadAvatar = async (data) => {
    const res = await axiosInstance.post('/auth/ua', post);
    return res;
}