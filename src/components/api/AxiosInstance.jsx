import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://177.75.28.45:5000/api/',
});

export default axiosInstance;
