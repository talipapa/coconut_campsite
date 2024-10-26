import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContentBody from '@/components/ContentBody'
import { getWalletData, sendPayoutRequest } from '@/utils/WalletService';
import ToastMessage from '@/components/ToastMessage';
import { useGlobalContext } from '@/Context/GlobalProvider';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import FormField from '@/components/FormField';
import NumberField from '@/components/NumberField';
import CustomButton from '@/components/CustomButton';
import FormatCurrency from '@/utils/FormatCurrency';

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
    setIsLoading(true)
    sendPayoutRequest(formData)
    .then(() => {
      ToastMessage('success', 'Success', 'Cashout has been sent successfully')
    }) 
    .catch((error) => {
      ToastMessage('error', 'Something went wrong', error.response?.data.message)
      setErrors(error.response.data.errors)
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
      refreshPageBooking()
  }, [user])




  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshPageBooking}/>}>
      <View className='h-[15vh] bg-[#5CBCB6]'>
        <View className='flex flex-col items-center justify-center h-full'>
          <Text className='text-white'>Available for Cash-out</Text>
          {walletData !== undefined ? <Text className='font-bold text-white text-lg'>{FormatCurrency(walletData.XENDIT)}</Text> : <Text className='bg-black rounded-md px-3 mt-2'>pending request</Text>}
        </View>
      </View>
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


        <CustomButton title='Confirm' containerStyles='bg-[#BC7B5C] mt-10' textStyles='text-white' handlePress={submitCashoutRequest} isLoading={isLoading}/>
      </ContentBody>
    </ScrollView>
  )
}

export default index