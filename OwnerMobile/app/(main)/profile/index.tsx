import { View, Text } from 'react-native'
import React, { useState } from 'react'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { changeAccountDetail, IUser } from '@/utils/AccountService';
import ToastMessage from '@/components/ToastMessage';
import { router } from 'expo-router';



const index = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading } = useGlobalContext();

  const [ errors, setErrors ] = useState<{ first_name?: string; last_name?: string, email?: string }>({})

  const [formData, setFormData] = useState<IUser>({
    'first_name' : user?.first_name || '',
    'last_name' : user?.last_name || '',
    'email' : user?.email || '',
  })

  const changeDetailFunc = () => {
    setIsLoading(true)
    changeAccountDetail(user?.id, formData)
      .then((res) => {
        ToastMessage('success', 'Updated successfully', 'Account details updated successfully')
      })
      .catch((err) => {
        setErrors(err.response.data.errors)
        ToastMessage('error', 'Error', 'An error occured, please try again')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <ContentBody>
      <CustomButton title="Change password" handlePress={() => router.push('/profile/change-password')} containerStyles='bg-blue-400 mb-7 w-full' textStyles='text-xs text-white'/>
      <View>
          <FormField errors={errors.first_name} title='First name' placeholder={`${user?.first_name}`} value={formData['first_name'] || ''} handleChangeText={(e) => setFormData((prev) => ({ ...prev, first_name: e }))} />
      </View>
      <View className='mt-4'>
          <FormField errors={errors.last_name} title='Last name' placeholder={`${user?.last_name}`} value={formData['last_name'] || ''} handleChangeText={(e) => setFormData((prev) => ({ ...prev, last_name: e }))} />
      </View>
      <View className='mt-4'>
          <FormField errors={errors.email} title='Email' placeholder={`${user?.email}`} value={formData['email'] || ''} handleChangeText={(e) => setFormData((prev) => ({ ...prev, email: e }))} />
      </View>

      <CustomButton title='Update Profile' handlePress={changeDetailFunc} isLoading={isLoading} containerStyles='bg-[#BC7B5C] mt-10 py-3' textStyles='text-white'/>
    </ContentBody>
  )
}

export default index