'use client'

import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import { Button } from 'antd'

const Page = () => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    })

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [buttonLoading, setButtonLoading] = useState(false)

    const submitForm = event => {
        event.preventDefault()
        setButtonLoading(true)
        forgotPassword({ setButtonLoading, email, setErrors, setStatus })
    }

    return (
        <div className="w-full sm:max-w-md px-6 py-4 bg-white shadow-2xl overflow-hidden sm:rounded-lg">
            <div className="mb-4 text-sm text-gray-600">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that
                will allow you to choose a new one.
            </div>

            {/* Session Status */}
            <AuthSessionStatus className="mb-4" status={status} />

            <form onSubmit={submitForm}>
                {/* Email Address */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.email} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Button type='primary' className="px-10 ml-3" disabled={buttonLoading}>Email Password Reset Link</Button>
                </div>
            </form>
        </div>
    )
}

export default Page
