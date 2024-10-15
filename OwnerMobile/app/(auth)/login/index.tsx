import { View, Text, Image, Platform } from 'react-native'
import { useContext, useState } from 'react'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import axios from '@/utils/axios'
import { login, loadUser } from '@/utils/AuthService'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { showToast } from '@/components/ToastMessage'
import { router } from 'expo-router'

const index = () => {
    const [ errors, setErrors ] = useState<{ email?: string; password?: string }>({})
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const { setIsLoggedIn, setUser } = useGlobalContext();

    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        setErrors({})
        setIsLoading(true)
        try {
            await login({
                email: form.email,
                password: form.password,
                device_name: `${Platform.OS} ${Platform.Version}`
            })
            const user = await loadUser();
            showToast('success', 'Login successful', 'You will be redirected to the home screen')
            setIsLoggedIn(true)
            setUser(user)
            setTimeout(() => {
                router.replace('/home')
            }, 2000)
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
            showToast('error', 'Incorrect credentials', error.response?.data.message)
        } finally{
            setIsLoading(false)
        }
    }

    return (
        <View className='space-y-8'>
            <View className='flex flex-row space-x-2 items-center'>
                <Image source={require('@/assets/logo.jpg')} className='w-12 h-12 rounded-full' />
                <Text className='text-2xl font-bold'>Coconut Campsite</Text>
            </View>
            <View className='space-y-3'>
                <Text className='text-2xl font-semibold'>Login</Text>
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
                        handleChangeText={(e) => setForm({...form, password: e})} 
                        otherStyles='mt-3'
                        errors={errors.password}
                    />
                </View>
                <CustomButton title="Submit" handlePress={handleLogin} containerStyles='bg-[#5CBCB6] mt-12' isLoading={isLoading}/>
            </View>
        </View>
    )
}

export default index