import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { deleteManager, getSingleManager, updateManager } from '@/utils/Caretaker'
import ToastMessage from '@/components/ToastMessage'
import ContentBody from '@/components/ContentBody'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export interface IUser {
  first_name : string,
  last_name : string,
  email : string
}

const index = () => {
  const { id } = useLocalSearchParams() as { id: string | string[] }
  const [manager, setManager] = React.useState<IUser|null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [ errors, setErrors ] = useState<{ first_name?: string; last_name?: string, email?: string }>({})

  const navigation = useNavigation()

  
  const [formData, setFormData] = useState<IUser>({
    'first_name' : manager?.first_name || '',
    'last_name' : manager?.last_name || '',
    'email' : manager?.email || '',
  })

  const changeDetailFunc = () => {
    setIsLoading(true)
    updateManager(id.toString(), formData)
      .then((res) => {
        ToastMessage('success', 'Updated successfully', 'Account details updated successfully')
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

  const deleteManagerFunc = () => {
    setIsLoading(true)
    deleteManager(id.toString())
      .then((res) => {
        ToastMessage('success', 'Deleted successfully', 'Manager deleted successfully')
        router.back()
      })
      .catch((err) => {
        ToastMessage('error', 'Error', 'An error occured, please try again')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setIsLoading(true)
    getSingleManager(id.toString())
    .then((response) => {
      setManager(response)
    })
    .catch((error) => {
      console.log(error)
      ToastMessage('error', 'Error', JSON.stringify(error))
    })
    .finally(() => {
      setIsLoading(false)
    })

  }, [])

  useEffect(() => {
    if (manager) {
      setFormData({
        first_name: manager.first_name,
        last_name: manager.last_name,
        email: manager.email,
      });
    }
  }, [manager]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CustomButton title='Save' handlePress={changeDetailFunc} isLoading={isLoading} containerStyles='bg-[#BC7B5C] px-4' textStyles='text-white'/>
      ),
    })
  }, [navigation, changeDetailFunc])

  return (
    <ScrollView>
      <ContentBody>
        { isLoading && manager === null ? <ActivityIndicator size="large" className='mt-10'/> : (
          <>

            <View>
                <FormField errors={errors.first_name} title='First name' placeholder={`${manager?.first_name}`} value={formData['first_name']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, first_name: e }))} />
            </View>
            <View className='mt-4'>
                <FormField errors={errors.last_name} title='Last name' placeholder={`${manager?.last_name}`} value={formData['last_name']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, last_name: e }))} />
            </View>
            <View className='mt-4'>
                <FormField errors={errors.email} title='Email' placeholder={`${manager?.email}`} value={formData['email']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, email: e }))} />
            </View>
            <CustomButton title="Change password" handlePress={() => router.push('/caretaker/change-password')} containerStyles='bg-blue-400 mt-7 py-4 w-full' textStyles='text-xs text-white'/>
            <CustomButton title="Delete" handlePress={() => deleteManagerFunc()} containerStyles='bg-red-600 mt-7 py-4 w-full' textStyles='text-xs text-white'/>
          </>
        )}


      </ContentBody>
    </ScrollView>
  )
}

export default index