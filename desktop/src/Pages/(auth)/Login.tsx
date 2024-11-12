import React from 'react'
import { Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalProvider';
import { useNavigate } from 'react-router-dom';
import { loadUser, login, logout } from '../../utils/AuthService';
import TextField from '../../Components/TextField';

interface IFormData {
    'email': string;
    'password': string;
    'device_name': string;
}

const Login = () => {
    const { user, setUser, isLoading, setIsLoading, setIsLoggedIn } = useGlobalContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<IFormData>({
      email: '',
      password: '',
      device_name: 'desktop'
    })
    const [ errors, setErrors ] = useState<{ email?: string; password?: string }>({})
    const [serverAccountError, setServerAccountError] = useState<string | null>(null)

    useEffect(() => {
        window.electron.ipcRenderer.setWindowSize(500,650)
        if (user) {
            navigate('/dashboard');
        }
    }, [user])
  
  
    const handleLogin = async () => {
      setErrors({})
      setIsLoading(true)
      try {
          await login(formData)
          const user = await loadUser();
          setIsLoggedIn(true)
          setUser(user)
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
      } catch (error: any) {
            if (error.response?.status === 401) setServerAccountError(error.response?.data.message)
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
                // ToastMessage('error', 'Incorrect credentials', error.response?.data.message)
            } else{
                // ToastMessage('error', 'Something went wrong', error.response?.data.message)
            }
        } finally{
            setIsLoading(false)
      }
    }
  
  
  
    return (
      <>
        <div className="min-h-screen grid md:grid-cols-3 md:justify-center sm:pt-0 bg-gray-100">
          <div className="w-full h-full px-6 py-4 col-span-2 bg-white shadow-md sm:rounded-lg items-center justify-center">
                <div className='h-full w-full flex flex-col items-center justify-center'>
                    <div className='w-[70%] max-w-[600px]'>
                        {serverAccountError && (
                          <div className='text-black w-full bg-red-300 py-3 flex items-center justify-center'>
                            <span className='text-xl font-semibold'>{serverAccountError}</span>
                          </div>
                        )}
                      <div className='w-full items-center flex flex-row justify-center text-center text-4xl mb-6'>
                          Login to Your Account
                      </div>
                      <div className='flex flex-col space-y-9 w-full'>
                            <div className='flex flex-col w-full'>
                            <TextField title='Email' placeholder='Enter your email' value={formData['email']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, email: e }))} errors={[errors.email]}  />
                            </div>
                            <div className='flex flex-col w-full'>
                            <TextField title='Password' isPassword={true} placeholder='Enter your password' value={formData['password']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, password: e }))} errors={[errors.password]} />
                            </div>
                        <Button type='primary' loading={isLoading} onClick={handleLogin} className='bg-[#BC7B5C] w-full rounded-md py-8 text-white'>Login</Button>
                      </div>
                    </div>
                </div>
            </div>
            <div className="md:flex overflow-y-hidden md:flex-col md:items-center md:justify-center hidden md:relative">
                <img src={require('../../../assets/login_banner.jpg')}  className='h-full w-full object-cover absolute' />
            </div>
        </div>

          
      </>
    );
}

export default Login