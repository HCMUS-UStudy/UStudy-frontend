import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    method: 'get',
    timeout: 1000,    
});

axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default instance;





