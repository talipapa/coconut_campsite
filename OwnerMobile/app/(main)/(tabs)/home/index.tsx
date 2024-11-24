import { View, Text, StyleSheet, Button, RefreshControl, TouchableOpacity, Image } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '@/components/MainHeader'
import { ScrollView } from 'react-native'
import AuthContext, { useGlobalContext } from '@/Context/GlobalProvider'
import ContentBody from '@/components/ContentBody'
import CustomButton from '@/components/CustomButton'
import { Href, Link, router, useFocusEffect } from 'expo-router';
import { BookingType } from '@/types/BookingType'
import BookingList from '@/components/home/BookingList'
import { fetchBookings, fetchWalletDetails } from '@/utils/BookingService'
import FormatCurrency from '@/utils/FormatCurrency'
import Toast from 'react-native-toast-message'
import StatisticCard from '@/components/StatisticCard'
import React from 'react'

interface walletSummaryType {
  wallet: number,
  successfulTotalBookingCount: number,
  pendingCash: number,
  pendingTotalBookingCount: number
}

const index = () => {
  const { user, isLoading, setIsLoading } = useGlobalContext();
  const [bookings, setBookings] = useState<BookingType[]>([])

  const [walletSummary, setWalletSummary] = useState<walletSummaryType | undefined>()

  const refreshWalletSummary = () => {
    setIsLoading(true)
    fetchWalletDetails()
      .then((data) => {
        setWalletSummary(data)
      })
      .catch((error) => {
        console.log(error)
      })

      fetchBookings(30)
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

  useFocusEffect(
    useCallback(() => {
      refreshWalletSummary()
    }, [])
  );

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshWalletSummary} progressViewOffset={50}/>}>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
        <View className='bg-[#56342A] h-[10vh] px-5 py-3 flex flex-col relative'>
          <TouchableOpacity className='absolute bottom-[-20px]  w-[100vw] h-24 px-3' activeOpacity={1} onPress={() => router.push('/scanned' as Href)}>
            <View className={`flex space-x-4 flex-row justify-between items-center rounded-xl shadow-xl p-5 mb-5 bg-[#256560] h-[100px] w-full mt-4`}>
                <Image source={require('@/assets/icons/camping.png')} tintColor={"#fcf2ef"} className='w-12 h-12'/>
                <View className='flex-1 grow'>
                    <Text className={`font-semibold text-xl text-[#fcf2ef]`}>View scanned bookings</Text>
                    {!isLoading ? 
                        <Text className={`font-semibold  w-full h-8 text-green-200 text-xs mt-1`}>View and confirm campers that visited your campsite here</Text> 
                      :
                        <View className={`font-semibold bg-slate-800 w-full rounded-lg grow`}/>
                    }
                </View>
            </View>
          </TouchableOpacity>
      </View>
      <ContentBody>
        <View className='mt-5'>

          <View className='flex flex-col justify-between mt-5'>
            <View>
              <Text className='text-xs text-slate-400'>Upcoming bookings</Text>
            </View>
            <View className='flex flex-col'>
              <View className='flex flex-row items-center justify-between'>
                <Text className='text-lg font-semibold'>Bookings</Text>
                {/* <Link className='text-blue-500 font-semibold text-md tracking-widest' href={"/home/bookings" as Href}>See all</Link> */}
                <Link className='text-blue-500 font-semibold text-md tracking-widest' href="/bookings">See all</Link>
              </View>
            </View>
          </View>

          <BookingList isLoading={isLoading} bookings={bookings}/>
        </View>
      </ContentBody>
    </ScrollView>
  )
}

export default index