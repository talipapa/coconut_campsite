import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useGlobalContext } from '../../Context/GlobalProvider';
import { Form, replace, useNavigate } from 'react-router-dom';
import { loadUser, login } from '../../Utils/AuthService';
import TextField from '../../Components/TextField';

interface IFormData {
    email: string;
    password: string;
    device_name: string;
}

const Login = () => {
    const { user, setUser, setIsLoggedIn, isLoggedIn } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<IFormData>({
        email: '',
        password: '',
        device_name: 'kiosk_device_1'
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [serverAccountError, setServerAccountError] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = window.localStorage.getItem('token');
        if (accessToken) {
            navigate('/dashboard');
        }
    }, []);

    const handleLogin = async (e?: any) => {
        if (e) {
            e.preventDefault();
        }
        setErrors({});
        setServerAccountError(null);
        setIsLoading(true);
        try {
            await login(formData);
            const user = await loadUser();
            setIsLoggedIn(true);
            setUser(user);
            navigate('/dashboard', {replace: true});
        } catch (error: any) {
            if (error.response?.status === 401) {
                setServerAccountError(error.response.data.message);
            }
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className='h-[100vh] w-[100vw] bg-[#56342A] flex flex-col items-center justify-center pt-12 space-y-10 p-10'>
            <div className='flex flex-col items-center w-full'>
                <h1 className='text-4xl text-[#e4dbdb9d] font-bold'>Welcome to</h1>            
                <h1 className='text-4xl text-white font-bold uppercase'>COCONUT CAMPSITE</h1>            
            </div>
            <div className='flex flex-col space-y-9 w-full'>
                {serverAccountError && (
                    <div className='text-white w-full bg-[#986B41] py-3 flex items-center justify-center'>
                        <span className='text-xl font-semibold'>{serverAccountError}</span>
                    </div>
                )}
                <div className='flex flex-col w-full items-center'>
                    <TextField otherStyles='items-center w-[60%] flex flex-col' title='Email' placeholder='Enter your email' value={formData.email} handleChangeText={(e) => setFormData(prev => ({ ...prev, email: e }))} errors={[errors.email]} />
                </div>
                <div className='flex flex-col w-full items-center'>
                    <TextField otherStyles='items-center w-[60%] flex flex-col' title='Password' isPassword={true} placeholder='Enter your password' value={formData.password} handleChangeText={(e) => setFormData(prev => ({ ...prev, password: e }))} errors={[errors.password]} />
                </div>
            </div>
            <Button type='primary' htmlType='submit' loading={isLoading} className=' w-full rounded-md py-7 text-white'>Login</Button>
        </form>
    );
};

export default Login;
