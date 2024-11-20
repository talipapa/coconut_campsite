import React from 'react'
import { View, Text } from 'react-native'

const NoBookingFound = () => {
  return (
    <View className='items-center mt-24'>
        <Text className='text-xl font-bold text-slate-400 text-center'>No bookings available at the moment.</Text>
    </View>
  )
}

export default NoBookingFound