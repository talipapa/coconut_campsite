import axios from "./axios";
import { getToken } from "./TokenService";

export const getWalletData = async () => {
    const response = await axios.get(`/mobile/wallet/balance`)
    return response.data;
}

export const getDashboardData = async () => {
    const response = await axios.get(`/mobile/dashboard-summary`)
    return response.data;
}

export const sendPayoutRequest = async (data: any) => {
    const response = await axios.post('/mobile/payout', data)
    return response.data;
}