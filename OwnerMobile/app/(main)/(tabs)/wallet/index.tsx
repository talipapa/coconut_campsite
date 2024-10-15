import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MainHeader from '@/components/MainHeader'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider'

const index = () => {
  const { isLoggedIn, user, test, setTest } = useGlobalContext();
  return (
    <ScrollView>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
      <ContentBody>
        <Text>Wallet screen</Text>
      </ContentBody>
    </ScrollView>
  )
}

export default index