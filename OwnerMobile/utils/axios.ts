import axiosLab from 'axios';

const axios = axiosLab.create({
    baseURL: 'http://192.168.2.106:8000/api/v1',
    headers: {
        'Accept': 'application/json',
    }
})

export default axios;