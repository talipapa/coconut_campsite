import { View, Text, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AuthContext, { useGlobalContext } from '@/Context/GlobalProvider'
import { loadUser } from '@/utils/AuthService'

interface MainHeaderProps {
  fullName: string
}

const MainHeader:React.FC<MainHeaderProps> = ({fullName}) => {
  return (
    <View className='w-full min-h-[15vh] bg-[#5CBCB6] flex flex-row items-center justify-between px-5 pt-4'>
      <View className='flex flex-row space-x-3 items-center'>
        <Image source={require('@/assets/images/account.png')} className='w-12 h-12 rounded-full'/>
        <View>
          <Text className='text-white text-md font-bold'>Manager</Text>
          <Text className='text-white text-md font-bold'>{`${fullName}`}</Text>
        </View>
      </View>
    </View>
  )
}

export default MainHeader