import axios, { AxiosError } from 'axios';
import { getAccessToken } from './storage';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        "Content-Type": "application/json"
    }
})

axiosInstance.interceptors.request.use(
    async function(request) {
        console.log(request.url);
        if(request.url !== '/auth/user/login') {
            const token = getAccessToken();
            if(!token) {
                return Promise.reject({
                    message: 'AT not found'
                });
            }
            request.headers.Authorization = `Bearer ${token}`; 
        }
        return request;
    },
    function(error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function(response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    }, 
    function(error:AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        const customError = {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        }
        return Promise.reject(customError);
    }
)

export default axiosInstance;