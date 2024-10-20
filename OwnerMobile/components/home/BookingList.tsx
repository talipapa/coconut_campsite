import { View, Text, Button, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'

import BookingCard from '@/components/BookingCard'
import Toast from 'react-native-toast-message'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { BookingType } from '@/types/BookingType'
import { fetchBookings } from '@/utils/BookingService'
import CustomButton from '../CustomButton'

const BookingList = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [bookings, setBookings] = useState<BookingType[]>([]);

    const refreshPageBooking = () => {
        setIsLoading(true)
        fetchBookings(10)
            .then((data) => {
                setBookings(data)
            })
            .catch((error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: `Something went wrong: ${JSON.stringify(error)}`,
                })
            })
            .finally(() => {
                setIsLoading(false)
            }
        )
    }


    useEffect(() => {
        refreshPageBooking()
    }, [])

    if (isLoading) {
        return (
            <>
                <CustomButton title='Refresh' containerStyles='bg-[#BC7B5C] mt-5 rounded-none' textStyles='text-white text-xs' handlePress={() => refreshPageBooking()}/>
                <ActivityIndicator size="large" className='mt-10'/>
            </>
        )
    }


    return (
        <>
            {/* <Button title="Refresh" onPress={() => fetchBookings()} /> */}
            <CustomButton title='Refresh' containerStyles='bg-[#BC7B5C] mt-5 rounded-none' textStyles='text-white text-xs' handlePress={() => refreshPageBooking()}/>
            {bookings.map((booking: BookingType, index: number) => (
                <BookingCard key={index} containerStyle="mt-4" booking={booking} />
            ))}
        </>
    )
}

export default BookingList