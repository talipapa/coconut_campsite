import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import MainHeader from '@/components/MainHeader'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider'
import CustomButton from '@/components/CustomButton'
import { logout } from '@/utils/AuthService'
import { router } from 'expo-router'
import ToastMessage from '@/components/ToastMessage'

const index = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading } = useGlobalContext();

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      ToastMessage('success', 'Logging out', 'You will be logged out in a few seconds')
      setTimeout(() => {
        setIsLoggedIn(false)
        setUser(null)
        router.replace('/login');
      }, 1000)
    } catch (error) {
      console.log("Error logging out", error)
      ToastMessage('error', 'Error logging out', (error as Error).toString())
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        
      }, 10000);
    }
  }

  const customStyle = StyleSheet.create({
    shadow: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.41,
      shadowRadius: 9.11,

      elevation: 14,
    }
  })

  const fullName = `${user?.first_name} ${user?.last_name}`


  return (
    <View className='space-y-10 grow'>
      <View className='bg-[#56342A] py-6 rounded-b-xl flex flex-row items-end justify-center px-5 pb-5'>
          <Text className='text-center text-white text-lg font-semibold'>Settings</Text>
      </View>
      <View className='m-5 grow justify-between'>
        <View className='flex flex-col space-y-4'>
            <TouchableOpacity style={customStyle.shadow} onPress={() => router.push("/profile")} className='flex flex-row rounded-xl bg-white items-center space-x-5 p-5'>
              <Image source={require('@/assets/logo.jpg')} className='w-12 h-12 rounded-full'/>
              <View>
                <Text className='text-slate-700'>{fullName.length > 20 ? fullName.substring(0, 20) + '...' : fullName}</Text>
                <Text className='font-bold text-black'>View Personal Info</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={customStyle.shadow} onPress={() => router.push("/caretaker")} className='flex flex-row bg-[#559D99] rounded-xl items-center space-x-5 p-5 bg-slate-20'>
              <View className='justify-center items-center w-full'>
                <Image source={require('@/assets/icons/admin-panel.png')} className='w-12 h-12 rounded-full' tintColor={"#ffffff"}/>
                <Text className='text-white text-lg font-bold'>Caretaker manager</Text>
              </View>
            </TouchableOpacity>
        </View>
        <View className='items-end'>
          <CustomButton title="Logout" handlePress={() => handleLogout()} containerStyles='bg-red-500 h-[50px] w-full' textStyles='text-xs text-white' isLoading={isLoading}/>
        </View>
      </View>
    </View>
  )
}

export default index