import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'

import BookingCard from '@/components/BookingCard'
import Toast from 'react-native-toast-message'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { BookingType } from '@/types/BookingType'
import { fetchBookings } from '@/utils/BookingService'

const BookingList = () => {
    const { user } = useGlobalContext();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [bookings, setBookings] = useState<BookingType[]>([]);


    useEffect(() => {
        setIsLoading(true)
        fetchBookings()
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
            })
    }, [])

    if (isLoading) {
        return <Text>Loading...</Text>
    }


    return (
        <>
            {/* <Button title="Refresh" onPress={() => fetchBookings()} /> */}
            {bookings.map((booking: BookingType, index: number) => (
                <BookingCard key={index} containerStyle="mt-4" booking={booking} />
            ))}
        </>
    )
}

export default BookingList