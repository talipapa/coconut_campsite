'use client'

import axios from "@/lib/axios"
import useSWR from "swr"


export const useLaravelBooking = ({ routeLink } = {}) => {
    const fetcher = async (url) => {
        try {
            // console.log('Fetching data from: ', url); // Add this
            const response = await axios.get(url)
            // console.log('Response status: ', response.status); // Add this
            return response.data

        } catch (res) {
            const error = new Error('An error occurred while fetching the data')
            error.info = await res.message
            throw error
        }
    
    }
    
    const { data: booking, error, mutate, } = useSWR(routeLink, fetcher)
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
