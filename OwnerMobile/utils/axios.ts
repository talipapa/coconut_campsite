import axiosLab from 'axios';

const axios = axiosLab.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {
        'Accept': 'application/json',
    }
})

export default axios;