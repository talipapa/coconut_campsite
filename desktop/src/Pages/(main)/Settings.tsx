import React, { useState } from 'react'
import PageWrapper from './PageWrapper'
import { Breadcrumb, Button, notification } from 'antd'
import { useGlobalContext } from '@/Context/GlobalProvider'
import TextField from '@/Components/TextField'
import axios from '@/utils/auth'

interface IError {
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}

const Settings = () => {
  const { user } = useGlobalContext()
  const [ firstName, setFirstName ] = React.useState(user?.first_name || '')
  const [ lastName, setLastName ] = React.useState(user?.last_name || '')
  const [ email, setEmail ] = React.useState(user?.email || '')
  const [ isLoading, setIsLoading ] = React.useState(false)
  const [ isPasswordLoading, setIsPasswordLoading ] = React.useState(false)

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [ errors, setErrors ] = useState<IError>({})


  const [api, contextHolder] = notification.useNotification();

  const openNotification = (notifType: 'success'|'error'|'warning'|'info', title: string, body: string) => {
    api.open({
      type: notifType,
      message: title,
      description: body,
      showProgress: true,
      pauseOnHover: false,
    });
  };

  
  
  const submitAccountEdit = () => {
    setIsLoading(true);
    axios.patch(`user/${user?.id}`, {
      first_name: firstName,
      last_name: lastName,
      email: email
    })
    .then(res => {
      openNotification('success', 'Profile changes', 'Profile has been changed successfuly'); // Trigger notification on success
    })
    .catch(err => {
      setErrors(err.response.data.errors);
      if (err.response.status === 422) {
        openNotification('error', 'Incorrect input', err.response.data.message); // Trigger notification on success
      } else{
        openNotification('error', 'Something went wrong', JSON.stringify(err)); // Trigger notification on success
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const changePassword = () => {
    setIsPasswordLoading(true);
    axios.patch(`user/change-password/${user?.id}`, {
      'password': password,
      'password_confirmation': confirmPassword
    })
    .then(res => {
      openNotification('success', 'Password changes', 'Password has been changed successfuly'); // Trigger notification on success
    })
    .catch(err => {
      setErrors(err.response.data.errors);
      if (err.response.status === 422) {
        openNotification('error', 'Incorrect input', err.response.data.message); // Trigger notification on success
      } else{
        openNotification('error', 'Something went wrong', JSON.stringify(err)); // Trigger notification on success
      }
    })
    .finally(() => {
      setIsPasswordLoading(false);
    });
  }
  

  return (
    <PageWrapper>
      <>
        {contextHolder}
        <Breadcrumb className='bg-slate-200 shadow-lg py-5 px-6 select-none'>
          <Breadcrumb.Item><span className='font-semibold'>Settings</span></Breadcrumb.Item>
        </Breadcrumb>
        <div className='flex flex-col px-6 py-8 space-y-10'>
          <div className='space-y-6 flex flex-col'>
            <span className='text-3xl font-bold'>Account settings</span>
            <div className='w-[60%] space-y-5'>
              <TextField title='First name' value={firstName} placeholder={firstName} handleChangeText={setFirstName} errors={errors?.first_name}/>
              <TextField title='Last name' errors={errors?.last_name} value={lastName} placeholder={lastName} handleChangeText={setLastName} />
              <TextField title='Email' errors={errors?.email} value={email} placeholder={email} handleChangeText={setEmail} />
            </div>
            <div className='flex justify-start'>
              <Button onClick={submitAccountEdit}  type='primary' className='w-[20%]' loading={isLoading}>Save</Button>
            </div>
          </div>
          <div className='space-y-6 flex flex-col'>
            <span className='text-3xl font-bold'>Change password</span>
            <div className='space-y-5'>
              <TextField isPassword title='New password' value={password} placeholder='New password' handleChangeText={setPassword} errors={errors?.password}/>
              <TextField isPassword title='Confirm password' value={confirmPassword} placeholder='Re-enter password' handleChangeText={setConfirmPassword} />
            </div>
            <div className='flex justify-start'>
              <Button onClick={changePassword}  type='primary' className='w-[20%]' loading={isPasswordLoading}>Save</Button>
            </div>
          </div>
        </div>
      </>
    </PageWrapper>
  )
}

export default Settings