import { View, Text, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import React = require("react");

import ContentBody from '@/components/ContentBody'
import { getWalletData, sendPayoutRequest } from '@/utils/WalletService';
import ToastMessage from '@/components/ToastMessage';
import { useGlobalContext } from '@/Context/GlobalProvider';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import FormField from '@/components/FormField';
import NumberField from '@/components/NumberField';
import CustomButton from '@/components/CustomButton';
import FormatCurrency from '@/utils/FormatCurrency';
import { router } from 'expo-router';

interface IWalletData {
  'XENDIT' : number,
  'VERIFIED_CASH' : number,
}

interface IFormData {
  'account_holder_name' : string,
  'account_number' : string,
  'amount' : string
}



const index = () => {
  const [ errors, setErrors ] = useState<{ account_holder_name?: string; account_number?: string, amount?: string }>({})
  const { isLoggedIn, user, isLoading, setIsLoading } = useGlobalContext();
  const [walletData, setWalletData] = useState<IWalletData>();

  const [formData, setFormData] = useState<IFormData>({
    'account_holder_name' : '',
    'account_number' : '',
    'amount' : '',
  })

  const refreshPageBooking = () => {
    setErrors({})
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


  const CashOutValidation = ({minValue, maxValue} : {minValue:number, maxValue: number}) => {
    if (!formData['amount']){
      return (
        <Text className='mx-3'>₱10 - {walletData && walletData.XENDIT !== undefined && walletData.XENDIT > 200000 ? "₱200000" : `₱${walletData?.XENDIT?.toFixed(2)}`} ang amount na pwedeng icash-out per transaction</Text>
      )
    }

    if (parseInt(formData['amount']) > maxValue) {
      return (
        <Text className='mx-3 text-red-600'>Mas malaki ang nilagay mong amount kaysa sa iyong available cash out balance</Text>
      )
    }
    
    if (parseInt(formData['amount']) < minValue){
      return (
        <Text className='mx-3 text-red-600'>₱10 - {walletData && walletData.XENDIT !== undefined && walletData.XENDIT > 200000 ? "₱200000" : `₱${walletData?.XENDIT?.toFixed(2)}`} ang amount na pwedeng icash-out per transaction</Text>
      )
    }
    
    if (!formData['amount']){
        return (
          <Text className='mx-3'>₱10 - {walletData && walletData.XENDIT !== undefined && walletData.XENDIT > 200000 ? "₱200000" : `₱${walletData?.XENDIT?.toFixed(2)}`} ang amount na pwedeng icash-out per transaction</Text>
        )
    }

    return (
      <Text className='mx-3'>₱10 - {walletData && walletData.XENDIT !== undefined && walletData.XENDIT > 200000 ? "₱200000" : `₱${walletData?.XENDIT?.toFixed(2)}`} ang amount na pwedeng icash-out per transaction</Text>
    )

  }




  const submitCashoutRequest = async () => {
    setErrors({})
    if (!formData.account_holder_name || !formData.account_number || !formData.amount) {
      ToastMessage('error', 'Validation error', 'Please fill up all fields')
      return
    }
    setIsLoading(true)
    Alert.alert(
      "Confirm Cashout", (
        `Please confirm the details \n\nAccount Name: ${formData.account_holder_name} \nAccount Number: ${formData.account_number} \nAmount: ${formData.amount}`
      ),
      [
        {
          text: "Cancel",
          onPress: () => setIsLoading(false),
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => sendPayoutRequestForm()

        }
      ]
    )
  }

  const sendPayoutRequestForm = () => {
    sendPayoutRequest(formData)
    .then(() => {
      alert(`Verify cashout request has been sent to the email address associated with xendit business account. Please confirm the cashout request in Xendit dashboard`)
      router.replace('/home')
    }) 
    .catch((error) => {
      if (error.response?.status !== 500) {
        setErrors(error.response.data.errors)
      } else if (error.response?.status !== 400) {
        setErrors(error.response.data.errors)
      } else {
        ToastMessage('error', 'Something went wrong', JSON.stringify(error.response?.data))
      }
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
      refreshPageBooking()
  }, [user])




  return (
    <>
    
      <View className='h-[12vh] bg-[#56342ae8]'>
        <View className='flex flex-col items-center justify-center h-full'>
          <Text className='text-white'>Available for Cash-out</Text>
          {walletData !== undefined ? <Text className='font-bold text-white text-lg'>{FormatCurrency(walletData.XENDIT)}</Text> : <Text className='bg-black rounded-md px-3 mt-2'>pending request</Text>}
        </View>
      </View>
      <ScrollView className='grow relative' refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshPageBooking}/>}>
        <ContentBody>
          <Text className='text-center font-black text-xl mb-5'>GCASH</Text>

          <View className='space-y-4'>

            <FormField errors={errors.account_holder_name} title='Account name' placeholder={`${user?.first_name} ${user?.last_name}`} value={formData['account_holder_name']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, account_holder_name: e }))} />

          </View>
          <View className='space-y-4 mt-5'>
            <NumberField errors={errors.account_number} title='Account Number' placeholder='09xxxxxxxxx' value={formData['account_number']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, account_number: e }))} />
          </View>

          <View className='space-y-4 mt-5'>
            <NumberField errors={errors.amount} title='Ilagay ang amount na gusto mo' placeholder='0.00' value={formData['amount']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, amount: e }))} />
              <View className='mt-3'>
                {walletData && <CashOutValidation minValue={5} maxValue={200000}/>}
              </View>
          </View>


          <CustomButton title='Confirm' containerStyles='bg-[#559D99] mt-10 py-3' textStyles='text-white' handlePress={submitCashoutRequest} isLoading={isLoading}/>
        </ContentBody>
      </ScrollView>
    </>
  )
}

export default index