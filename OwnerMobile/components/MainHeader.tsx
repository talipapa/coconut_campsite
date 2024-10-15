import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import AuthContext, { useGlobalContext } from '@/Context/GlobalProvider'
import { loadUser } from '@/utils/AuthService'

interface MainHeaderProps {
  fullName: string
}


const MainHeader:React.FC<MainHeaderProps> = ({fullName}) => {
  return (
    <View className=' min-h-[16vh] bg-[#5CBCB6] flex flex-row items-end justify-between px-5 pb-3 border-b-2 border-[#57b4ae]'>
      <View className='w-full flex flex-row space-x-3 items-center justify-between'>
        <View className='flex flex-row items-center space-x-2'>
         <Image source={require('@/assets/logo.jpg')} className='w-10 h-10 rounded-full'/>
         
          <View className='flex flex-col items-start'>
            <Text className='text-white text-md font-semibold'>{fullName}</Text>
            <Text className='text-[#256560] text-sm font-semibold'>Owner</Text>
          </View>
        </View>
        <View className='flex flex-row items-center space-x-2'>
          <Image source={require('@/assets/icons/time.png')} tintColor={"#256560"} className='w-3 h-3'/>
          <Text className='text-white text-md font-semibold'>{new Date().toDateString()}</Text>
        </View>
      </View>
    </View>
  )
}

export default MainHeader