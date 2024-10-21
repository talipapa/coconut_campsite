import axios from "./axios";
import { getToken } from "./TokenService";

export const getWalletData = async () => {
    const token = await getToken()
    const response = await axios.get(`/mobile/wallet/balance`, {
        headers: {'Authorization': `Bearer ${token}`}})
    return response.data;
}

export const sendPayoutRequest = async (data: any) => {
    const token = await getToken()
    const response = await axios.post('/mobile/payout', data, {
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data;
}