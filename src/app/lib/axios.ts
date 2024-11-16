'use server';
import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
})

axiosInstance.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axiosInstance.defaults.headers.post['Content-Type'] = 'Application/json';

axiosInstance.interceptors.request.use(
    function(request) {
        // const token = localStorage.getItem('accessToken');
        // if(!token) {
        //     return Promise.reject(new Error('Bạn không có quyền'));
        // }
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



