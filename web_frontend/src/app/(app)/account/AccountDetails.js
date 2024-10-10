import React from 'react'
import { useAuth } from "@/hooks/auth"
import { useState } from "react"
import { Button, Input, notification } from "antd"
import InputError from "@/components/InputError"
import { UserOutlined } from '@ant-design/icons'
import axios from '@/lib/axios'


const AccountDetails = () => {
    const { user } = useAuth({middleware: 'auth'})
    
    const [first_name, setFirstName] = useState(user.first_name)
    const [last_name, setLastName] = useState(user.last_name)
    const [email, setEmail] = useState(user.email)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [errors, setErrors] = useState([])

    const [api, contextHolder] = notification.useNotification()

    
    const submitForm = ((event) => {
        event.preventDefault()
        setButtonLoading(true)
        axios.get('/sanctum/csrf-cookie')
        axios.patch('api/v1/user/' + user.id, {
            first_name: first_name,
            last_name: last_name,
            email: email,
        })
        .then(() => {
            setErrors([])
            api['success']({
              message: 'User details changed successfully',
              placement: 'bottomRight',
              description:
                "You've successfully updated your account details"
            })
        })
        .catch((error) => {
            if (error.response.status !== 422) throw error
            setErrors(error.response.data.errors)
        })
        .finally(() => {
            setButtonLoading(false)
        })
    })

    return (
        <>
            {contextHolder}
            <div className="m-[30px] space-y-5">
                <h2 className="font-bold text-xl">Account setting</h2>

                <form onSubmit={submitForm} className="space-y-9">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="first_name">First name</label>
                            <Input size="large" value={first_name} onChange={event=>setFirstName(event.target.value)} prefix={<UserOutlined/>} id="first_name" placeholder="Enter your first name"/>
                            <InputError messages={errors.first_name} className="mt-2" />
                        </div>
                        <div>
                            <label htmlFor="last_name">Last name</label>
                            <Input size="large" value={last_name} onChange={event=>setLastName(event.target.value)} prefix={<UserOutlined/>} id="last_name" placeholder="Enter your first name"/>
                            <InputError messages={errors.first_name} className="mt-2" />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <Input size="large" value={email} onChange={event=>setEmail(event.target.value)} prefix={<UserOutlined/>} id="email" placeholder="Enter your email"/>
                            <InputError messages={errors.email} className="mt-2" />
                        </div>

                    </div>
                    <Button type="primary" htmlType="submit" className="w-full md:w-[20%]" loading={buttonLoading}>Save</Button>
                </form>
            </div>
        </>
    )
}

export default AccountDetails