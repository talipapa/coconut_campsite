import axiosLab from 'axios';

const axios = axiosLab.create({
    baseURL: `https://server.coconutcampsite.com/api/v1`,
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


axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && error.response?.data?.message === 'Unauthenticated.') {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
)


export default axios;