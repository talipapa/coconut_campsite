import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import MainHeader from '@/components/MainHeader'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider'
import CustomButton from '@/components/CustomButton'
import { logout } from '@/utils/AuthService'

const index = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading } = useGlobalContext();

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      setIsLoggedIn(false)
      setUser(null)
    } catch (error) {
      console.log("Error logging out", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
      <ContentBody>
        <Text>Setting screen</Text>
        <CustomButton title="Submit" handlePress={() => handleLogout()} containerStyles='bg-[#5CBCB6] mt-12' />
      </ContentBody>
    </ScrollView>
  )
}

export default index