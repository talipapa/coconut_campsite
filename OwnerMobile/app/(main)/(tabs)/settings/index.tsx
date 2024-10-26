import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native'
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
    <ScrollView className='bg-slate-100'>
      <View className=' min-h-[15vh] bg-[#64bdb7] rounded-3xl flex flex-row items-end justify-center px-5 pb-3'>
          <Text className='text-center text-black text-lg font-semibold'>Settings</Text>
      </View>
      <ContentBody>
        <View className='min-h-[70vh] flex flex-col space-y-4'>
            <TouchableOpacity style={customStyle.shadow} onPress={() => router.push("/profile")} className='flex flex-row rounded-xl bg-white items-center space-x-5 p-5 '>
              <Image source={require('@/assets/logo.jpg')} className='w-12 h-12 rounded-full'/>
              <View>
                <Text className='text-slate-700'>{fullName.length > 20 ? fullName.substring(0, 20) + '...' : fullName}</Text>
                <Text className='font-bold text-black'>View Personal Info</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={customStyle.shadow} onPress={() => router.push("/caretaker")} className='flex flex-row bg-white rounded-xl items-center space-x-5 p-5 bg-slate-20'>
              <View className='justify-center items-center w-full'>
                <Image source={require('@/assets/icons/admin-panel.png')} className='w-12 h-12 rounded-full'/>
                <Text className='text-slate-800 text-lg font-bold'>Caretaker manager</Text>
              </View>
            </TouchableOpacity>

          
            <CustomButton title="Logout" handlePress={() => handleLogout()} containerStyles='bg-red-500 mt-10 w-full' textStyles='text-xs text-white' isLoading={isLoading}/>

        </View>
      </ContentBody>
    </ScrollView>
  )
}

export default index