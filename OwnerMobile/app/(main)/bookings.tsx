import { View, Text, ScrollView } from 'react-native'
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
        fetchBookings(0)
            .then((data) => {
                setBookings(data)
                setFilteredBookings(data)
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
        headerSearchBarOptions:{
            placeholder: "Search name",
            onChangeText: (e: any) => {
                handleFilter(e.nativeEvent.text)
            } 
        }
    })
  })

  const handleFilter = (searchText:string) => {
    if (isLoading) {
        setFilteredBookings([])
    }

    if (searchText.length == 0){
        setFilteredBookings(bookings)
    }

    setFilteredBookings(
        bookings.filter((booking: BookingType) => {
            return booking.full_name.toUpperCase().includes(searchText.toUpperCase())
        })
    )
  }

  const ActionHeaders = () => {
    return (
        <>
            <CustomButton title='Refresh' containerStyles='bg-[#BC7B5C] rounded-none' textStyles='text-white text-xs' handlePress={() => refreshPageBooking()}/>
        </>
    )
  }


  if (isLoading) {
      return (
          <ContentBody>
                <ActionHeaders/>
                <Text className='mt-4 text-center'>Loading...</Text>
          </ContentBody>
      )
  }

  return (
    <ScrollView>
      <ContentBody>
          {/* <Button title="Refresh" onPress={() => fetchBookings()} /> */}
          <ActionHeaders/>
            {filteredBookings.map((booking: BookingType, index: number) => (
                <BookingCard key={index} containerStyle="mt-4" booking={booking} />
            ))}
      </ContentBody>
    </ScrollView>
)
}

export default bookings