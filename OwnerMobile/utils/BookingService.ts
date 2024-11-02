
import ToastMessage from '@/components/ToastMessage'
import { BookingType } from '@/types/BookingType'
import axios from '@/utils/axios'
import { getToken } from '@/utils/TokenService'

export const fetchBookings = async (page:number) => {
    const response = await axios.get(`/mobile/bookings/${page}`)
    return Object.values(response.data)[0] as BookingType[]
}

export const fetchSingleBooking = async (bookingId: string) => {

    const response = await axios.get(`/mobile/booking/${bookingId}`)

    return response;
}

export const fetchWalletDetails = async () => {
    const response = await axios.get('/mobile/wallet-summary')
    return response.data.summary;
}


export const rescheduleBooking = async (id: string, type: string, check_in: Date) => {
    const response = await axios.patch(`/mobile/reschedule/${id}`, {'booking_type': type, 'check_in': check_in})
    return response.data;
}

export const cancelBooking = async (id: string) => {
    const response = await axios.post(`/mobile/cancel/${id}`, undefined)
    return response.data;
}

export const refundBooking = async (id: string) => {
    const response = await axios.post(`/mobile/refund/${id}`, undefined)
    return response.data;
}

export const bookingActionConfirmation = async (id: string, action: string) => {
    const response = await axios.patch(`/mobile/booking/action/${id}`, {'action': action})
    return response.data;
}


export const fetchSuccessfulBookingHistory = async (itemCount: number) => {
    const response = await axios.get(`/mobile/bookings/verified/${itemCount}`)
    return response.data;
}

export const fetchCurrentMonthBookingHistory = async (itemCount: number) => {
    const response = await axios.get(`/mobile/bookings/current-month/${itemCount}`)
    return response.data;
}

export const fetchPreviousMonthBookingHistory = async (itemCount: number) => {
    const response = await axios.get(`/mobile/bookings/previous-month/${itemCount}`)
    return response.data;
}

export const fetchCashOnlyBookingHistory = async (itemCount: number) => {
    const response = await axios.get(`/mobile/bookings/cash-only/${itemCount}`)
    return response.data;
}

export const fetchEwalletOnlyBookingHistory = async (itemCount: number) => {
    const response = await axios.get(`/mobile/bookings/ewallet-only/${itemCount}`)
    return response.data;
}

export const fetchVerifiedCurrentMonthBookingHistory = async (itemCount: number) => {
    const response = await axios.get(`/mobile/bookings/verified-only/${itemCount}`)
    return response.data;
}

export const fetchCancelledCurrentMonthBookingHistory = async (itemCount: number) => {
    const response = await axios.get(`/mobile/bookings/cancelled-only/${itemCount}`)
    return response.data;
}