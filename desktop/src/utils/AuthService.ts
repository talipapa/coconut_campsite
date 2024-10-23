import { useGlobalContext } from "../Context/GlobalProvider";
import axios from "./auth";
import { getToken, setToken } from "./TokenService";

interface credentialsIE {
    email: string;
    password: string;
    device_name: string;
}

export async function login(credentials: credentialsIE) {
    const { data } = await axios.post('/manager/login', credentials)
    await setToken(data.token)
}

export async function loadUser() {
    const token = await getToken();
    const { data: user} = await axios.get('/manager/user', {
        headers: {
            Authorization: `Bearer ${token}`
    }})

    return user;
}

export async function logout() {
    const token = await getToken();
    const {data: data} = await axios.post('/manager/logout', null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    window.electron.ipcRenderer.setWindowFullScreen(false)
    await setToken(null);
    return data;
}