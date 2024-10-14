import axios from "@/utils/axios";
import { getToken, setToken } from "./TokenService";

interface credentialsIE {
    email: string;
    password: string;
    device_name: string;
}

export async function login(credentials: credentialsIE) {
    const { data } = await axios.post('/mobile/login', credentials)
    await setToken(data.token)
}

export async function loadUser() {
    const token = await getToken();
    const { data: user} = await axios.get('/mobile/user', {
        headers: {
            Authorization: `Bearer ${token}`
    }})

    return user;
}