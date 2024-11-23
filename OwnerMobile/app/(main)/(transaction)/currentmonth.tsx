import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import { useEffect, useState } from 'react'
import React = require("react");

import { useGlobalContext } from '@/Context/GlobalProvider';
import { router, useNavigation } from 'expo-router';
import ContentBody from '@/components/ContentBody';
import { fetchBookings, fetchCurrentMonthBookingHistory, fetchSuccessfulBookingHistory } from '@/utils/BookingService';
import Toast from 'react-native-toast-message';
import CustomButton from '@/components/CustomButton';
import BookingCard from '@/components/BookingCard';
import TransactionCard from '@/components/TransactionCard';
import NoBookingFound from '@/components/NoBookingFound';



interface VerifiedBookingType {
  id: number,
  full_name: string;
  email: string,
  tel_number: string
  first_name: string,
  last_name: string,
  check_in: string,
  check_out: string,
  status: string,
}

interface PaginatedBookingType {
  data: VerifiedBookingType[],
  total: number,
  page: number
}

const currentmonth = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [bookings, setBookings] = useState<VerifiedBookingType[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<VerifiedBookingType[]>([]);




    const refreshPageBooking = () => {
        setIsLoading(true)
        fetchCurrentMonthBookingHistory(100)
            .then((res: { data: VerifiedBookingType[] }) => {
                if (Array.isArray(res.data)){
                    setBookings(res.data)
                    setFilteredBookings(res.data)
                    setIsLoading(false)
                } else {
                    setBookings([])
                    setFilteredBookings([])
                }
            })
            .catch((error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: `Something went wrong: ${JSON.stringify(error)}`,
                })
                setIsLoading(false)
            })
    }

    useEffect(() => {
        refreshPageBooking()
    }, [])

    const handleFilter = (searchText: string | undefined) => {
        setIsLoading(true)
        if (searchText === undefined) {
            return
        }

        if (searchText.length === 0) {
            setFilteredBookings(bookings)
        } else {
            setFilteredBookings(
                bookings.filter((booking: VerifiedBookingType) => {
                    return booking.full_name.toUpperCase().includes(searchText.toUpperCase())
                })
            )
        }
        setIsLoading(false)
    }

    useEffect(() => {
        // Ensure handleFilter is available when setting options
        navigation.setOptions({
            headerSearchBarOptions: {
                placeholder: "Search via name",
                onChangeText: (e: any) => {
                    handleFilter(e.nativeEvent.text)
                },
                placement: 'inline',
                textColor: '#ffffff',
                shouldShowHintSearchIcon: false,
                tintColor: '#ffffff',
            }
        })
    }, [navigation, bookings])


    if (isLoading) {
        return (
            <ContentBody>
                <ActivityIndicator size="large" className='mt-10' />
            </ContentBody>
        )
    }
    
    if (!isLoading && filteredBookings.length === 0){
        return (
            <ContentBody>
                <NoBookingFound/>
            </ContentBody>
        )
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshPageBooking} progressViewOffset={50}/>}>
            <ContentBody>
                {filteredBookings.length <= 0 ? (
                    <NoBookingFound/>
                )
                    :
                    filteredBookings.map((booking: VerifiedBookingType, index: number) => (
                        <TransactionCard key={index} containerStyle="mb-4" booking={booking} />
                    ))
                }
            </ContentBody>
        </ScrollView>
    )
}

export default currentmonth;
