import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { useEffect } from 'react'
import MainHeader from '@/components/MainHeader'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider'
import CustomButton from '@/components/CustomButton'
import { logout } from '@/utils/AuthService'
import { router } from 'expo-router'
import ToastMessage from '@/components/ToastMessage'
import React from 'react'

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
    <View className='space-y-5 grow'>
      <View className='bg-[#56342A] rounded-b-xl flex flex-row items-end justify-center pb-4 px-5'>
          <Text className='text-center text-white text-lg font-semibold'>Settings</Text>
      </View>
      <View className='mx-5 mb-5 grow justify-between'>
        <View className='flex flex-col justify-between flex-1 space-y-4'>
            <View className='space-y-3'>
              {/* Manage caretaker */}
              <TouchableOpacity style={customStyle.shadow} onPress={() => router.push("/caretaker")} className='flex flex-row bg-[#f6f6f6] rounded-xl items-center space-x-5 py-4 px-5 bg-slate-20'>
                <View className='flex-row items-center gap-3 w-full'>
                  <Image source={require('@/assets/icons/admin-panel.png')} className='w-9 h-9 rounded-full' tintColor={"#0f0f0f"}/>
                  <Text className='text-black text-md font-bold'>Manage Caretakers</Text>
                </View>
              </TouchableOpacity>

              {/* Manage prices */}
              <TouchableOpacity style={customStyle.shadow} onPress={() => router.push("/prices")} className='flex flex-row bg-[#f6f6f6] rounded-xl items-center space-x-5 py-4 px-5 bg-slate-20'>
                <View className='flex-row items-center gap-3 w-full'>
                  <Image source={require('@/assets/icons/wallet.png')} className='w-9 h-9' tintColor={"#0f0f0f"}/>
                  <Text className='text-black text-md font-bold'>Manage Prices</Text>
                </View>
              </TouchableOpacity>

              {/* Manage Cabins */}
              <TouchableOpacity style={customStyle.shadow} onPress={() => router.push("/cabins")} className='flex flex-row bg-[#f6f6f6] rounded-xl items-center space-x-5 py-4 px-5 bg-slate-20'>
                <View className='flex-row items-center gap-3 w-full'>
                  <Image source={require('@/assets/icons/camping.png')} className='w-10 h-10 rounded-full' tintColor={"#0f0f0f"}/>
                  <Text className='text-black text-md font-bold'>Manage Cabins</Text>
                </View>
              </TouchableOpacity>



            </View>
            <View className='space-y-3 mb-8'>
              {/* Profile */}
              <TouchableOpacity style={customStyle.shadow} onPress={() => router.push("/profile")} className='flex flex-row rounded-xl bg-[#315f5c] items-center space-x-5 px-5 py-3'>
                <Image source={require('@/assets/logo.jpg')} className='w-12 h-12 rounded-full'/>
                <View>
                  <Text className='text-slate-300'>{fullName.length > 20 ? fullName.substring(0, 20) + '...' : fullName}</Text>
                  <Text className='font-bold text-white'>View Personal Info</Text>
                </View>
              </TouchableOpacity>
            </View>
        </View>
        <View className='items-end'>
          <CustomButton title="Logout" handlePress={() => handleLogout()} containerStyles='bg-red-500 h-[50px] w-full' textStyles='text-xs text-white' isLoading={isLoading}/>
        </View>
      </View>
    </View>
  )
}

export default index