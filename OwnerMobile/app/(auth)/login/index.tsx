import { View, Text, Image, Platform, ScrollView, SafeAreaView } from 'react-native'
import { useContext, useState } from 'react'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { login, loadUser } from '@/utils/AuthService'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { router } from 'expo-router'
import ToastMessage from '@/components/ToastMessage'
import { usePushNotifcations } from '@/utils/usePushNotifications'
import axios from '@/utils/axios'
import React from 'react'

const index = () => {
    const [ errors, setErrors ] = useState<{ email?: string; password?: string }>({})
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    
    const {expoPushToken, notification} = usePushNotifcations()

const { setIsLoggedIn, setUser } = useGlobalContext();

    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        setErrors({})
        setIsLoading(true)
        try {
            await login({
                email: form.email,
                password: form.password,
                device_name: `${Platform.OS} - ${Platform.Version}`
            })
            const user = await loadUser();
            ToastMessage('success', 'Login successful', 'You will be redirected to the home screen')
            setIsLoggedIn(true)
            setUser(user)

            

            await axios.post('/mobile/device-token', {
                token: expoPushToken?.data,
                device_name: `${Platform.OS} - ${Platform.Version}`
            })

            setTimeout(() => {
                router.replace('/home')
            }, 2000)
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
                ToastMessage('error', 'Incorrect credentials', error.response?.data.message)
            } else{
                ToastMessage('error', 'Something went wrong', error.response?.data.message)
            }
        } finally{
            setTimeout(() => {
                setIsLoading(false) 
            }, 5000);
        }
    }

    return (
        <SafeAreaView className='relative w-full h-full'>
            {/* <Image source={require('@/assets/logo.jpg')} className='w-full h-full top-0 absolute'/> */}
            <View className='p-8 justify-evenly grow'>
                <View className='flex flex-col items-center grow'>
                    <Image source={require('@/assets/logo.jpg')} className='w-12 h-12 rounded-full'/>
                    <Text className='text-2xl font-bold'>Coconut Campsite</Text>
                    <View className='mt-12 grow w-full'>
                        <View>
                            <FormField
                                title='Email'
                                placeholder='Enter your email'
                                value={form.email}
                                handleChangeText={(e) => setForm({...form, email: e})}
                                errors={errors.email} 
                            />
                            <FormField
                                title='Password'
                                placeholder='Enter your password'
                                value={form.password}
                                isPassword={true}
                                handleChangeText={(e) => setForm({...form, password: e})} 
                                otherStyles='mt-7'
                                errors={errors.password}
                            />
                        </View>
                    </View>
                </View>
                <CustomButton title="Submit" handlePress={handleLogin} containerStyles='bg-[#3E5F5D] mt-12 mb-6 py-3' isLoading={isLoading} textStyles='text-white font-semibold'/>
            </View>
        </SafeAreaView>
    )
}

export default index