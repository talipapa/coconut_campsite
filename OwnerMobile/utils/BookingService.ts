
import { BookingType } from '@/types/BookingType'
import axios from '@/utils/axios'
import { getToken } from '@/utils/TokenService'

export const fetchBookings = async () => {
    const token = await getToken()
    const response = await axios.get('/mobile/bookings', {headers:{
    'Authorization': `Bearer ${token}`
    }})
    return Object.values(response.data)[0] as BookingType[]
}

export const fetchWalletDetails = async () => {
    const token = await getToken()
    const response = await axios.get('/mobile/wallet-summary', {headers:{
    'Authorization': `Bearer ${token}`
    }})
    return response.data.summary;
}