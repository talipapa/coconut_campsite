import axios from "@/utils/axios";
import { getToken, setToken } from "./TokenService";
import { config } from "@/components/ui/gluestack-ui-provider/config";
import { usePushNotifcations } from "./usePushNotifications";

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
    const { data: user} = await axios.get('/mobile/user')

    return user;
}

export async function logout() {
    const {data: data} = await axios.post('/mobile/logout', null)
    await setToken(null);
    return data;
}