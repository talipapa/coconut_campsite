import React from 'react'
import { useAuth } from "@/hooks/auth"
import { useState } from "react"
import { Button, Input, notification } from "antd"
import InputError from "@/components/InputError"
import { UserOutlined } from '@ant-design/icons'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

const ChangePassword = () => {
    const router = useRouter()
    const { user } = useAuth({middleware: 'auth'})
    
    const [password, setNewPassword] = useState()
    const [password_confirmation, setPasswordConfirmation] = useState()
    const [buttonLoading, setButtonLoading] = useState(false)
    const [errors, setErrors] = useState([])
    
    const [api, contextHolder] = notification.useNotification()

    const submitForm = ((event) => {
        event.preventDefault()
        setButtonLoading(true)
        axios.get('/sanctum/csrf-cookie')
    
        axios.patch('api/v1/user/change-password/' + user.id, {
            password: password,
            password_confirmation: password_confirmation,
        })
        .then(() => {
            api['success']({
                message: 'Password change',
                placement: 'bottomRight',
                description:"You've successfully updated your password!, You will be logged out shortly"
            })
        })
        .catch((error) => {
            if (error.response.status !== 422) throw error
            setErrors(error.response.data.errors)
        })
        .finally(() => {
            setNewPassword('')
            setPasswordConfirmation('')
            setButtonLoading(false)
        })
    })

    return (
        <>
            {contextHolder}
            <div className="m-[30px] space-y-5 pt-5">
                <h2 className="font-bold text-xl">Change password</h2>

                <form onSubmit={submitForm} className="space-y-9">
                    <div className="grid md:grid-cols-1 gap-5">
                        <div>
                            <label htmlFor="password">New password</label>
                            <Input size="large" value={password} onChange={event=>setNewPassword(event.target.value)} prefix={<UserOutlined/>} id="password" placeholder="New password"/>
                            <InputError messages={errors.password} className="mt-2" />
                        </div>
                        <div>
                            <label htmlFor="password_confirmation">Confirm password</label>
                            <Input size="large" value={password_confirmation} onChange={event=>setPasswordConfirmation(event.target.value)} prefix={<UserOutlined/>} id="password_confirmation" placeholder="Enter your new password again"/>
                            <InputError messages={errors.password_confirmation} className="mt-2" />
                        </div>

                    </div>
                    <Button type="primary" htmlType="submit" className="w-full md:w-[30%]" loading={buttonLoading}>Change password</Button>
                </form>
            </div>
        </>
    )
}

export default ChangePassword