import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '@/Context/GlobalProvider';
import { router } from 'expo-router';

const bookings = () => {
  const { isLoggedIn, isLoading } = useGlobalContext();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.navigate('/')
    }
  }, [isLoading, isLoggedIn])

  return (
    <View>
      <Text>booking</Text>
    </View>
  )
}

export default bookings