import axios from 'axios'
import { backendUrl } from '../utils/constants'
export const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
})