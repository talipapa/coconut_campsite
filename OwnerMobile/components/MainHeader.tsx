import { View, Text, Image, StyleSheet, StatusBar } from 'react-native'
import { useContext, useState } from 'react'

import AuthContext, { useGlobalContext } from '@/Context/GlobalProvider'
import { loadUser } from '@/utils/AuthService'
import React from 'react'

interface MainHeaderProps {
  fullName: string
}


const MainHeader:React.FC<MainHeaderProps> = ({fullName}) => {
  return (
    <>
        <StatusBar barStyle="light-content" backgroundColor="#56342A" />

        <View className='bg-[#56342A] pt-6 flex flex-row items-end justify-between px-5 pb-3'>
          <View className='w-full flex flex-row space-x-3 items-end justify-between'>
            <View className='flex flex-row items-center space-x-2'>
            <Image source={require('@/assets/logo.jpg')} className='w-10 h-10 rounded-full'/>
            
              <View className='flex flex-col items-start'>
                {/* Limit the name in case the letters exceeds over 12 */}
                <Text className='text-white text-md font-semibold'>{fullName.length > 20 ? fullName.substring(0, 16) + '...' : fullName}</Text>
                <Text className='text-white text-sm font-semibold'>Owner</Text>
              </View>
            </View>
            <View className='flex flex-row items-center space-x-2'>
              <Image source={require('@/assets/icons/time.png')} tintColor={"#f9f9f9"} className='w-3 h-3'/>
              <Text className='text-white text-sm font-semibold'>{new Date().toDateString()}</Text>
            </View>
          </View>
        </View>
    </>
  )
}

export default MainHeader