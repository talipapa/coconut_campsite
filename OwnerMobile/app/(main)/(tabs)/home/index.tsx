import { View, Text, StyleSheet, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '@/components/MainHeader'
import { ScrollView } from 'react-native'
import AuthContext, { useGlobalContext } from '@/Context/GlobalProvider'
import ContentBody from '@/components/ContentBody'
import CustomButton from '@/components/CustomButton'
import { Href, Link, router } from 'expo-router';
import { BookingType } from '@/types/BookingType'
import BookingList from '@/components/home/BookingList'
import { fetchWalletDetails } from '@/utils/BookingService'

interface walletSummaryType {
  wallet: number,
  successfulTotalBookingCount: number,
  pendingCash: number,
  pendingTotalBookingCount: number
}

const index = () => {
  const { user } = useGlobalContext();
  const redirectCashout = () => {
    router.navigate('/wallet')
  }



  const [walletSummary, setWalletSummary] = useState<walletSummaryType | undefined>()

  
  useEffect(() => {
    fetchWalletDetails()
      .then((data) => {
        setWalletSummary(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])


  return (
    <ScrollView>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
      <View className='bg-[#5CBCB6] h-[10vh] px-5 py-3 flex flex-col relative'>
        <View className='absolute bottom-[-40px]  w-[100vw] h-24 px-3'>
          <View className='w-full h-full bg-[#256560] rounded-xl p-3 flex flex-row items-end justify-around'>
            <View className='space-y-1'>
              <View>
                <Text className='text-slate-100 text-xs'>₱ {Number(walletSummary?.pendingCash).toFixed(2)} (Pending) | {walletSummary?.pendingTotalBookingCount} bookings </Text>
              </View> 
              <View>  
                <Text className='text-slate-100 text-md'>Wallet</Text>
                <Text className='text-[#e5ffb1] text-xl font-bold'>₱ {walletSummary?.wallet}</Text>
              </View>
            </View>
            <View>
              <CustomButton handlePress={() => router.push('/settings')} title='Cash out' containerStyles='bg-[#BC7B5C] px-6' textStyles='text-white text-sm' />
            </View>
          </View>
        </View>
      </View>
      <ContentBody>
        <View className='mt-10'>
          <View className='flex flex-col justify-between'>
            <View>
              <Text className='text-xs text-slate-400'>Your recent bookings</Text>
            </View>
            <View className='flex flex-col'>
              <View className='flex flex-row items-center justify-between'>
                <Text className='text-lg font-semibold'>Bookings</Text>
                {/* <Link className='text-blue-500 font-semibold text-md tracking-widest' href={"/home/bookings" as Href}>See all</Link> */}
                <Link className='text-blue-500 font-semibold text-md tracking-widest' href="/bookings">See all</Link>
              </View>
            </View>
          </View>
          <BookingList/>
        </View>
      </ContentBody>
    </ScrollView>
  )
}

export default index