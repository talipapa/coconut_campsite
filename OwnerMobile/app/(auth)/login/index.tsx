import { View, Text, Image } from 'react-native'
import { useContext, useState } from 'react'
import axios from '@/utils/axios'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'

const index = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const handleLogin = async () => {
        // Print baseUrl
        axios.get('/mobile/login', {
            data: {
                email: 'asdasd'
            }
        })
        .then(() => {
            console.log('Login success')
        })
        .catch((err) => {
            console.log(err.message)
        })
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
                    />
                    <FormField
                        title='Password'
                        placeholder='Enter your password'
                        value={form.password}
                        handleChangeText={(e) => setForm({...form, password: e})} 
                        otherStyles='mt-3'
                    />
                </View>
                <CustomButton title="Submit" handlePress={handleLogin} containerStyles='bg-[#5CBCB6] mt-12' />
            </View>
        </View>
    )
}

export default index