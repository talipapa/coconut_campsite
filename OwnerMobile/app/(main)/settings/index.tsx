import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import MainHeader from '@/components/MainHeader'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider'
import CustomButton from '@/components/CustomButton'
import { logout } from '@/utils/AuthService'
import { router } from 'expo-router'
import { showToast } from '@/components/ToastMessage'

const index = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading } = useGlobalContext();

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      showToast('success', 'Logging out', 'You will be logged out in a few seconds')
      setTimeout(() => {
        setIsLoggedIn(false)
        setUser(null)
        router.navigate('/login');
      }, 3000)
    } catch (error) {
      console.log("Error logging out", error)
      showToast('error', 'Error logging out', (error as Error).toString())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
      <ContentBody>
        <Text>Setting screen</Text>
        <CustomButton title="Submit" handlePress={() => handleLogout()} containerStyles='bg-[#5CBCB6] mt-12' isLoading={isLoading}/>
      </ContentBody>
    </ScrollView>
  )
}

export default index