import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainHeader from '@/components/MainHeader'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { getDashboardData, getWalletData } from '@/utils/WalletService'
import ToastMessage from '@/components/ToastMessage'
import { RefreshControl } from 'react-native-gesture-handler'
import CustomButton from '@/components/CustomButton'
import { router, useFocusEffect } from 'expo-router'
import FormatCurrency from '@/utils/FormatCurrency'
import StatisticCard from '@/components/StatisticCard'

interface IDashboardData {
  'cancelledBookingThisMonth' : number,
  'cashRevenueThisMonth' : number,
  'ePaymentRevenueThisMonth' : number,
  'successBookingThisMonth' : number,
  'totalMonthEarnings' : number,
  'totalPreviousMonthEarnings' : number,
  'totalYearEarnings' : number,
  'xenditWallet' : number,
}




const index = () => {
  const { isLoggedIn, user, isLoading, setIsLoading } = useGlobalContext();
  const [dashboardData, setDashboardData] = useState<IDashboardData>();

  const refreshPageBooking = () => {
    setDashboardData(undefined)
    setIsLoading(true)
    getDashboardData()
      .then((res) => {
        setDashboardData(res)
      })
      .catch((err) => {
        ToastMessage("error", "Error fetching wallet data", err.response.data)
      })
      .finally(() => {
        setIsLoading(false)
      })

    console.log(dashboardData)
  }

  useFocusEffect(
    React.useCallback(() => {
      refreshPageBooking()
    }, [])
  )
  

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshPageBooking} progressViewOffset={50}/>}>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
      <View className='bg-[#5CBCB6] min-h-[15vh] px-5 py-3 flex flex-col relative mb-4'>
      {dashboardData ? (
        <View className='flex flex-row items-end justify-between'>
          <View className='space-y-1'>
            <View>  
              <Text className='text-slate-100 text-md'>Xendit Wallet</Text>
              <Text className='text-[#434343] text-2xl font-bold'>{FormatCurrency(dashboardData?.xenditWallet)}</Text>
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

      <ContentBody containerClass='items-center'>
        <StatisticCard title='Total Earnings' data={FormatCurrency(dashboardData?.totalMonthEarnings)} isLoading={isLoading} dataStyle='text-green-500'/>
        <StatisticCard title='Total Previous Earnings' data={FormatCurrency(dashboardData?.totalPreviousMonthEarnings)} dataStyle='text-slate-500' isLoading={isLoading}/>

        <Text className='mt-7 mb-4 text-lg text-slate-400 font-semibold'>This month statistics</Text>
        <StatisticCard title='Cash Revenue' data={FormatCurrency(dashboardData?.cashRevenueThisMonth)} isLoading={isLoading}/>
        <StatisticCard title='ePayment Revenue' data={FormatCurrency(dashboardData?.ePaymentRevenueThisMonth)} isLoading={isLoading} />
        <StatisticCard title='Successful Bookings' data={dashboardData?.successBookingThisMonth} isLoading={isLoading} dataStyle='text-green-500'/>
        <StatisticCard title='Cancelled Bookings' data={dashboardData?.cancelledBookingThisMonth} isLoading={isLoading} dataStyle='text-red-500'/>
      </ContentBody>
    </ScrollView>
  )
}

export default index