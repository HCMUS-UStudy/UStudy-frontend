import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    method: 'get',
    timeout: 1000,    
});

axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'Application/json';

axios.interceptors.request.use(
    function(request) {
        const token = localStorage.getItem('accessToken');
        if(!token) {
            return Promise.reject(new Error('Bạn không có quyền'));
        }
        return request;
    },
    function(error) {
        return Promise.reject(error);
    }
);

export default instance;





