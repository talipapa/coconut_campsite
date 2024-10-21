import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import axios from '../utils/auth';
import { useEffect, useState } from 'react';
import { loadUser, login, logout } from '../utils/AuthService';
import GlobalProvider, { useGlobalContext } from '../Context/GlobalProvider';
import ProtectedRoutes from './ProtectedRoutes';
import Dashboard from '../Pages/Dashboard';
import { refresh } from 'electron-debug';
import TextField from '../Components/TextField';

interface IFormData {
  'email': string;
  'password': string;
  'device_name': string;
}

function Hello() {
  const { user, setUser, isLoading, setIsLoading, setIsLoggedIn } = useGlobalContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IFormData>({
    email: '',
    password: '',
    device_name: 'desktop'
  })
  const [ errors, setErrors ] = useState<{ email?: string; password?: string }>({})

  useEffect(() => {
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
        if (error.response?.status === 422) {
            setErrors(error.response.data.errors)
          }
        setErrors(error.response.data.errors)
    } finally{
        setIsLoading(false)
    }
}

  const Logout = async () => {
    logout()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  return (
    <div className='h-[100vh] w-[100vw] bg-slate-200 flex flex-col items-center justify-center space-y-7'>
      {user?.first_name}
      <div className='flex flex-col'>
        <TextField title='Email' placeholder='Enter your email' value={formData['email']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, email: e }))} errors={[errors.email]} />
      </div>
      <div className='flex flex-col'>
        <TextField title='Password' placeholder='' value={formData['password']} handleChangeText={(e) => setFormData((prev) => ({ ...prev, password: e }))} errors={[errors.password]} />
      </div>
      <button onClick={handleLogin} className='bg-blue-500 rounded-md px-7 py-2 text-white'>Login</button>
      <button onClick={Logout} className='bg-blue-500 rounded-md px-7 py-2 text-white'>Logout</button>
    </div>
  );
}



export default function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route element={<ProtectedRoutes/>}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/" element={<Hello />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}
