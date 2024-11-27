import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import MainHeader from '@/components/MainHeader'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { getDashboardData, getWalletData } from '@/utils/WalletService'
import ToastMessage from '@/components/ToastMessage'
import { RefreshControl } from 'react-native-gesture-handler'
import CustomButton from '@/components/CustomButton'
import { Href, router, useFocusEffect } from 'expo-router'
import FormatCurrency from '@/utils/FormatCurrency'
import StatisticCard from '@/components/StatisticCard'
import React from 'react'

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
  }

  const getCurrentMonthName = () => {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' });
  };

  const getPreviousMonthName = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1); // Set to the previous month
    return date.toLocaleString('default', { month: 'long' });
  };

  useEffect(() => {
    refreshPageBooking()
  }, [])


  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshPageBooking} progressViewOffset={30}/>}>
      <MainHeader fullName={`${user?.first_name} ${user?.last_name}`} />
      <View className='bg-[#56342A] min-h-[12vh] px-5 py-8 flex flex-col relative mb-4'/>

      <View className='relative'>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='absolute top-[-80px]'>
            <View className='flex flex-row items-center justify-center'>
              <TouchableOpacity activeOpacity={1} onPress={() => router.push('/scanned' as Href)}>
                <StatisticCard title={`Scanned bookings`} data="View and confirm campers that visited your campsite here" isLoading={isLoading} dataStyle='text-green-500 text-xs mt-1' titleStyle='text-slate-200' rootStyle='bg-[#256560] h-[100px] w-[220px] ml-5'/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => router.push('/allsuccessful' as Href)}>
                <StatisticCard title={`Total Revenue`} data={FormatCurrency(dashboardData?.totalYearEarnings)} isLoading={isLoading} dataStyle='text-green-500' titleStyle='text-slate-200' rootStyle='bg-[#559D99] h-[100px] w-[220px] ml-5'/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => router.push('/currentmonth' as Href)}>
                <StatisticCard title={`${getCurrentMonthName()} revenue`} data={FormatCurrency(dashboardData?.totalMonthEarnings)} isLoading={isLoading} dataStyle='text-green-500' titleStyle='text-slate-300' rootStyle='h-[100px] w-[250px] ml-5 bg-slate-700'/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => router.push('/previousmonth' as Href)}>
                <StatisticCard title={`${getPreviousMonthName()} revenue`} data={FormatCurrency(dashboardData?.totalPreviousMonthEarnings)} isLoading={isLoading} rootStyle='h-[100px] w-[250px] mx-5 bg-slate-200'/>
              </TouchableOpacity>
            </View>
        </ScrollView>

        


        <ContentBody containerClass='items-center mt-[40px]'>
          {dashboardData ? (
            <View className='w-full h-[12vh] bg-[#56342A] rounded-xl p-3 flex flex-row items-center justify-around'>
              <View>
                <View>  
                  <Text className='text-slate-100 text-md'>Xendit Wallet</Text>
                  {/* Convert to php cash */}

                  <Text className='text-[#e5ffb1] text-xl font-bold'>{FormatCurrency(dashboardData?.xenditWallet)}</Text>
                </View>
              </View>
              <View>
                {
                  dashboardData?.xenditWallet <= 50 ? (
                    <CustomButton isDisabled={true} handlePress={() => router.push('/cashout')} title='Cash out' containerStyles='bg-[#B3CCCA] px-6' textStyles='text-slate-400 text-sm' />
                  ) : (
                    <CustomButton handlePress={() => router.push('/cashout')} title='Cash out' containerStyles='bg-[#559D99] px-6' textStyles='text-white text-sm' />
                  )
                }
              </View>
            </View>
          ) : (
              <ActivityIndicator size="large" />
          )}
          <Text className='mt-7 mb-4 text-lg text-slate-400 font-semibold'>This month statistics</Text>
          <TouchableOpacity className='w-full' activeOpacity={1} onPress={() => router.push('/cashonly' as Href)}>
            <StatisticCard title='Cash Revenue' data={FormatCurrency(dashboardData?.cashRevenueThisMonth)} isLoading={isLoading}/>
          </TouchableOpacity>
          <TouchableOpacity className='w-full' activeOpacity={1} onPress={() => router.push('/ewalletonly' as Href)}>
            <StatisticCard title='ePayment Revenue' data={FormatCurrency(dashboardData?.ePaymentRevenueThisMonth)} isLoading={isLoading} />
          </TouchableOpacity>
          <TouchableOpacity className='w-full' activeOpacity={1} onPress={() => router.push('/successfulcurrentmonth' as Href)}>
            <StatisticCard title='Successful Bookings' data={dashboardData?.successBookingThisMonth} isLoading={isLoading} dataStyle='text-green-500'/>
          </TouchableOpacity>
          <TouchableOpacity className='w-full' activeOpacity={1} onPress={() => router.push('/cancelledcurrentmonth' as Href)}>
            <StatisticCard title='Cancelled Bookings' data={dashboardData?.cancelledBookingThisMonth} isLoading={isLoading} dataStyle='text-red-500'/>
          </TouchableOpacity>
        </ContentBody>
      </View>

    </ScrollView>
  )
}

export default index