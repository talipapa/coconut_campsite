import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
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
      }, 3000)
    } catch (error) {
      console.log("Error logging out", error)
      ToastMessage('error', 'Error logging out', (error as Error).toString())
    } finally {
      setIsLoading(false)
    }
  }

  const fullName = `${user?.first_name} ${user?.last_name}`


  return (
    <ScrollView>
      <View className=' min-h-[15vh] bg-[#64bdb7] rounded-3xl flex flex-row items-end justify-center px-5 pb-3'>
          <Text className='text-center text-black text-lg font-semibold'>Settings</Text>
      </View>
      <ContentBody>
        <View className='min-h-[70vh] flex flex-col justify-between'>
            <TouchableOpacity onPress={() => router.push("/profile")} className='flex flex-row bg-[#114844] rounded-xl items-center space-x-5 p-5 bg-slate-20'>
              <Image source={require('@/assets/logo.jpg')} className='w-12 h-12 rounded-full'/>
              <View>
                <Text className='text-slate-200'>{fullName.length > 20 ? fullName.substring(0, 20) + '...' : fullName}</Text>
                <Text className='font-bold text-white'>View Personal Info</Text>
              </View>
            </TouchableOpacity>

          
            <CustomButton title="Logout" handlePress={() => handleLogout()} containerStyles='bg-red-500 mt-10 w-full' textStyles='text-xs text-white' isLoading={isLoading}/>

        </View>
      </ContentBody>
    </ScrollView>
  )
}

export default index