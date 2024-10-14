import { View, Text, Image } from 'react-native'
import React from 'react'

const MainHeader = () => {
  return (

    <View className='w-full min-h-[15vh] bg-[#5CBCB6] flex flex-row items-center justify-between px-5 pt-4'>
      <View className='flex flex-row space-x-3 items-center'>
        <Image source={require('@/assets/images/account.png')} className='w-12 h-12 rounded-full'/>
        <View>
          <Text className='text-white text-md font-bold'>Manager</Text>
          <Text className='text-white text-md font-bold'>John Davila</Text>
        </View>
      </View>
    </View>
  )
}

export default MainHeader