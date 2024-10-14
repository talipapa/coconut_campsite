import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '@/components/MainHeader'
import { ScrollView } from 'react-native'
import AuthContext, { useGlobalContext } from '@/Context/GlobalProvider'
import ContentBody from '@/components/ContentBody'

const index = () => {
  const { isLoggedIn, user, test } = useGlobalContext();

  return (
    <ScrollView>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
      <ContentBody>
        <Text>Home screen</Text>
      </ContentBody>
    </ScrollView>
  )
}

export default index