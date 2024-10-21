
import ToastMessage from '@/components/ToastMessage'
import { BookingType } from '@/types/BookingType'
import axios from '@/utils/axios'
import { getToken } from '@/utils/TokenService'

export const fetchBookings = async (page:number) => {
    const token = await getToken()
    const response = await axios.get(`/mobile/bookings/${page}`, {headers:{
        'Authorization': `Bearer ${token}`
    }})
    return Object.values(response.data)[0] as BookingType[]
}

export const fetchSingleBooking = async (bookingId: string) => {
    const token = await getToken()
    const response = await axios.get(`/mobile/booking/${bookingId}`, {headers:{
        'Authorization': `Bearer ${token}`
    }})

    return response;
}

export const fetchWalletDetails = async () => {
    const token = await getToken()
    const response = await axios.get('/mobile/wallet-summary', 
        {headers:{'Authorization': `Bearer ${token}`}}
    )
    return response.data.summary;
}


export const rescheduleBooking = async (id: string, type: string, check_in: Date) => {
    const token = await getToken()
    const response = await axios.patch(`/mobile/reschedule/${id}`, {'booking_type': type, 'check_in': check_in}, 
        {headers:{'Authorization': `Bearer ${token}`}})
    return response.data;
}

export const cancelBooking = async (id: string) => {
    const token = await getToken()
    const response = await axios.post(`/mobile/cancel/${id}`, undefined, {
        headers: {'Authorization': `Bearer ${token}`}})
    return response.data;
}

export const refundBooking = async (id: string) => {
    const token = await getToken()
    const response = await axios.post(`/mobile/refund/${id}`, undefined, {
        headers:{'Authorization': `Bearer ${token}`}})
    return response.data;
}