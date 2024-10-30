import axiosLab from 'axios';
import { safeStorage } from 'electron';

const axios = axiosLab.create({
    baseURL: `http://localhost:8000/api/v1`,
    headers: {
        'Accept': 'application/json',
    }
})

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
)



export default axios;