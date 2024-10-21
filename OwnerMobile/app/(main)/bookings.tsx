import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/Context/GlobalProvider';
import { router, useNavigation } from 'expo-router';
import ContentBody from '@/components/ContentBody';
import { BookingType } from '@/types/BookingType';
import { fetchBookings } from '@/utils/BookingService';
import Toast from 'react-native-toast-message';
import CustomButton from '@/components/CustomButton';
import BookingCard from '@/components/BookingCard';

const bookings = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [bookings, setBookings] = useState<BookingType[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingType[]>([]);

    const refreshPageBooking = () => {
        setIsLoading(true)
        fetchBookings(30)
            .then((data) => {
                if (Array.isArray(data)){
                    setBookings(data)
                    setFilteredBookings(data)
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
                bookings.filter((booking: BookingType) => {
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
                placeholder: "Search name",
                onChangeText: (e: any) => {
                    handleFilter(e.nativeEvent.text)
                }
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
                <Text>Not found</Text>
            </ContentBody>
        )
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshPageBooking} progressViewOffset={50}/>}>
            <ContentBody>
                {filteredBookings.length <= 0 ? (
                    <Text>Booking not found</Text>
                )
                    :
                    filteredBookings.map((booking: BookingType, index: number) => (
                        <BookingCard key={index} containerStyle="mb-4" booking={booking} />
                    ))
                }
            </ContentBody>
        </ScrollView>
    )
}

export default bookings;
