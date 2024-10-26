import axiosLab from 'axios';
import { getToken } from './TokenService';

const axios = axiosLab.create({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/${process.env.EXPO_PUBLIC_BACKEND_API_VERSION}`,
    headers: {
        'Accept': 'application/json',
    }
})

axios.interceptors.request.use(
    async (config) => {
        const token = await getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


export default axios;