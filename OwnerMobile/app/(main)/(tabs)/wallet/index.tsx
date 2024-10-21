import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainHeader from '@/components/MainHeader'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { getWalletData } from '@/utils/WalletService'
import ToastMessage from '@/components/ToastMessage'
import { RefreshControl } from 'react-native-gesture-handler'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'

interface IWalletData {
  'XENDIT' : number,
  'VERIFIED_CASH' : number,
}


const index = () => {
  const { isLoggedIn, user, isLoading, setIsLoading } = useGlobalContext();
  const [walletData, setWalletData] = useState<IWalletData>();

  const refreshPageBooking = () => {
    setWalletData(undefined)
    setIsLoading(true)
    getWalletData()
      .then((res) => {
        setWalletData(res)
      })
      .catch((err) => {
        ToastMessage("error", "Error fetching wallet data", err.response.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }


  useEffect(() => {
      refreshPageBooking()
    }, [user])
    
  

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshPageBooking} progressViewOffset={50}/>}>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
      <View className='bg-[#5CBCB6] min-h-[15vh] px-5 py-3 flex flex-col relative mb-4'>
      {walletData ? (
        <View className='flex flex-row items-end justify-between'>
          <View className='space-y-1'>
            <View>  
              <Text className='text-slate-100 text-md'>Xendit Wallet</Text>
              <Text className='text-[#434343] text-2xl font-bold'>₱ {(walletData?.XENDIT)?.toFixed(2)}</Text>
            </View>
          </View>
          <View>
            <CustomButton handlePress={() => router.push('/cashout')} title='Cash out' containerStyles='bg-[#BC7B5C] px-6' textStyles='text-white text-sm' />
          </View>
        </View>
      ) : (
          <ActivityIndicator size="large" />
      )}
      </View>

      <ContentBody>
        <Text></Text>

      </ContentBody>
    </ScrollView>
  )
}

export default index