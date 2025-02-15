'use client'

import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import { Button } from 'antd'

const Page = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/booking',
    })

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])
    const [buttonLoading, setButtonLoading] = useState(false)

    const submitForm = event => {
        event.preventDefault()
        setButtonLoading(true)
        register({
            firstName,
            lastName,
            email,
            setButtonLoading,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    return (
        <div className="w-full sm:max-w-md px-6 py-4 bg-white shadow-2xl overflow-hidden sm:rounded-lg">
            <div className="w-full flex flex-col items-center text-center my-3 space-y-2">
                <h2 className="text-center text-2xl font-semibold tracking-widest">Register</h2>
            </div>
            <form onSubmit={submitForm}>
                {/* First name */}
                <div>
                    <Label htmlFor="firstName">First name</Label>

                    <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        className="block mt-1 w-full"
                        onChange={event => setFirstName(event.target.value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.name} className="mt-2" />
                </div>

                {/* Last name */}
                <div className="mt-4">
                    <Label htmlFor="lastName">Last name</Label>

                    <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        className="block mt-1 w-full"
                        onChange={event => setLastName(event.target.value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.name} className="mt-2" />
                </div>

                {/* Email Address */}
                <div className="mt-4">
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                    />

                    <InputError messages={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="new-password"
                    />

                    <InputError messages={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                    <Label htmlFor="passwordConfirmation">
                        Confirm Password
                    </Label>

                    <Input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        className="block mt-1 w-full"
                        onChange={event =>
                            setPasswordConfirmation(event.target.value)
                        }
                        required
                    />

                    <InputError
                        messages={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href="/login"
                        className="underline text-sm text-gray-600 hover:text-gray-900">
                        Already registered?
                    </Link>

                    <Button type='primary' htmlType='submit' className="px-10 ml-3" disabled={buttonLoading}>Register</Button>
                </div>
            </form>
        </div>
    )
}

export default Page
