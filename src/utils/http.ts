import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:80',
    // Required by Laravel Sanctum
    withCredentials: true,
    withXSRFToken: true
});




export default http;