'use client'

import axios from "@/lib/axios"
import useSWR from "swr";

export const useLaravelBooking = () => {
    const { data: booking, error, mutate, } = useSWR('/api/v1/booking-check', () =>
        axios
            .get('/api/v1/booking-check')
            .then(res => res.data)
            .catch(error => {
               throw error
            }),
    )
    // True = user has existing booking

    // Api version
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION




    return {
        booking,
        apiVersion,
        error,
        mutate
    }
}
