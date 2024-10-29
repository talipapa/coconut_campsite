import React from 'react'
import { Button } from 'antd';
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
      <div className='h-[100vh] w-[100vw] bg-[#5CBCB6] flex flex-col items-center justify-center pt-12 space-y-10 p-10'>
        <div className='flex flex-col items-center w-full'>
            <h1 className='text-4xl text-[#0000009d] font-bold'>Welcome to</h1>            
            <h1 className='text-4xl text-white font-bold uppercase'>COCONUT CAMPSITE</h1>            
        </div>
        <div className='flex flex-col space-y-9 w-full'>
            {serverAccountError && (
              <div className='text-black w-full bg-red-300 py-3 flex items-center justify-center'>
                <span className='text-xl font-semibold'>{serverAccountError}</span>
              </div>
            )}
            <div className='flex flex-col w-full items-center'>
            <TextField otherStyles='items-center w-[60%] flex flex-col' title='Email' placeholder='Enter your email' value={formData['email']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, email: e }))} errors={[errors.email]} />
            </div>
            <div className='flex flex-col w-full items-center'>
            <TextField otherStyles='items-center w-[60%] flex flex-col' title='Password' isPassword={true} placeholder='Enter your password' value={formData['password']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, password: e }))} errors={[errors.password]} />
            </div>
        </div>
        
        <Button type='primary' loading={isLoading} onClick={handleLogin} className='bg-[#BC7B5C] w-[60%] rounded-md py-7 text-white'>Login</Button>
      </div>
    );
}

export default Login