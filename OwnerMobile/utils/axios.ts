import axiosLab from 'axios';

const axios = axiosLab.create({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/${process.env.EXPO_PUBLIC_BACKEND_API_VERSION}`,
    headers: {
        'Accept': 'application/json',
    }
})

export default axios;