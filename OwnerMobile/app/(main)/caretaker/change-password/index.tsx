import { View, Text } from 'react-native'
import React, { useState } from 'react'
import ContentBody from '@/components/ContentBody'
import FormField from '@/components/FormField'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { changeAccountPassword, IPassword } from '@/utils/AccountService'
import ToastMessage from '@/components/ToastMessage'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'



const index = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading } = useGlobalContext();

  const [ errors, setErrors ] = useState<{ password?: string; password_confirmation?: string }>({})

  const [formData, setFormData] = useState<IPassword>({
    'password' : '',
    'password_confirmation' : '',
  })

  const changePasswordFunc = () => {
    setIsLoading(true)
    changeAccountPassword(user?.id, formData)
      .then((res) => {
        ToastMessage('success', 'Password success', 'Password has been changed successfully')
        router.back()
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
      <View>
          <FormField errors={errors.password} title='Password' placeholder='' value={formData['password'] || ''} isPassword={true} handleChangeText={(e) => setFormData((prev) => ({ ...prev, password: e }))} />
      </View>
      <View className='mt-4'>
          <FormField errors={errors.password_confirmation} title='Confirm password' placeholder='' isPassword={true} value={formData['password_confirmation'] || ''} handleChangeText={(e) => setFormData((prev) => ({ ...prev, password_confirmation: e }))} />
      </View>

      <CustomButton title='Change password' handlePress={changePasswordFunc} isLoading={isLoading} containerStyles='bg-[#BC7B5C] mt-10 py-3' textStyles='text-white'/>
    </ContentBody>
  )
}

export default index