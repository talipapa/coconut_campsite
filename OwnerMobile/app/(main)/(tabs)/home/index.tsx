import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '@/components/MainHeader'
import { ScrollView } from 'react-native'
import AuthContext, { useGlobalContext } from '@/Context/GlobalProvider'
import ContentBody from '@/components/ContentBody'
import CustomButton from '@/components/CustomButton'
import BookingCard from '@/components/BookingCard'
import { Href, Link, router } from 'expo-router';

const index = () => {
  const { user } = useGlobalContext();
  const redirectCashout = () => {
    router.navigate('/wallet')
  }

  return (
    <ScrollView>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
      <View className='bg-[#5CBCB6] h-[10vh] px-5 py-3 flex flex-col relative'>
        <View className='absolute bottom-[-40px]  w-[100vw] h-24 px-3'>
          <View className='w-full h-full bg-[#BC7B5C] rounded-xl p-3 flex flex-row items-center justify-around'>
            <View className='space-y-1'>
              <View>
                <Text className='text-slate-100 text-xs'>Wallet</Text>
                <Text className='text-[#e5ffb1] text-xl font-bold'>₱ 1,000.00</Text>
              </View>
              <View>
                <Text className='text-slate-100 text-xs'>Oct | 5 successful booking</Text>
              </View>
            </View>
            <View>
              <CustomButton handlePress={redirectCashout} title='Cash out' containerStyles='bg-[#256560] px-6' textStyles='text-white text-sm' />
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
            <View className='flex flex-row items-center justify-between'>
              <Text className='text-lg font-semibold'>Bookings</Text>
              {/* <Link className='text-blue-500 font-semibold text-md tracking-widest' href={"/home/bookings" as Href}>See all</Link> */}
              <Link className='text-blue-500 font-semibold text-md tracking-widest' href="/bookings">See all</Link>
            </View>
          </View>
          <BookingCard containerStyle="mt-6"/>
          <BookingCard containerStyle="mt-4"/>
        </View>

      </ContentBody>
    </ScrollView>
  )
}

export default index