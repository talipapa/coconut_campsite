import { View, Text, Button, ActivityIndicator, Image } from 'react-native'
import React from "react";

import { useEffect, useState } from 'react'

import BookingCard from '@/components/BookingCard'
import Toast from 'react-native-toast-message'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { BookingType } from '@/types/BookingType'
import { fetchBookings } from '@/utils/BookingService'
import CustomButton from '../CustomButton'

const BookingList = ({isLoading, bookings}: {isLoading: boolean, bookings:BookingType[]}) => {


    if (!isLoading && bookings.length === 0) {
        return (
            <>
                <View className='items-center mt-24'>
                    <Text className='text-xl font-bold text-slate-400 text-center'>No bookings available at the moment.</Text>
                </View>
            </>
        )
    }


    return (
        <>
            {bookings.map((booking: BookingType, index: number) => (
                <BookingCard key={index} containerStyle="mt-4" booking={booking} />
            ))}
        </>
    )
}

export default BookingList