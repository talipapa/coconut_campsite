import axiosLab from 'axios';
import { getToken, setToken } from './TokenService';
import { router } from 'expo-router';


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

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && error.response?.data?.message === 'Unauthenticated.') {
            setToken(null).then(() => {
                router.replace('/login')
            })
        }
        return Promise.reject(error);
    }
)


export default axios;