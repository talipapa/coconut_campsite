import { View, Text } from 'react-native'
import React from "react";
import ContentBody from '@/components/ContentBody'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import axios from '@/utils/axios'
import { ScrollView } from 'react-native-gesture-handler'
import ToastMessage from '@/components/ToastMessage'
import { router } from 'expo-router'

interface IErrors {
    first_name?: string | undefined,
    last_name?: string | undefined,
    email?: string | undefined,
    password?: string | undefined,
}

const add = () => {
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [errors, setErrors] = React.useState<IErrors>({})
    const [isLoading, setIsLoading] = React.useState(false)

    const submitForm = () => {
        setIsLoading(true)
        setErrors({})
        axios.post('/mobile/manager', {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            password_confirmation: confirmPassword,
        }).then((response) => {
            ToastMessage('success', 'Manager added successfully', response.data.message)
            router.back()
        }).catch((error) => {
            console.log(error)
            setErrors(error.response.data.errors)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <ScrollView>
            <ContentBody>
                <View>
                    <FormField
                    otherStyles='mb-4'
                    title="First name"
                    placeholder="Enter first name"
                    value={firstName}
                    handleChangeText={setFirstName}
                    errors={errors?.first_name}
                    />

                    <FormField
                    otherStyles='mb-4'
                    title="Last name"
                    placeholder="Enter last name"
                    value={lastName}
                    handleChangeText={setLastName}
                    errors={errors?.last_name}
                    />

                    <FormField
                    otherStyles='mb-4'
                    title="Email"
                    placeholder="Enter email"
                    value={email}
                    handleChangeText={setEmail}
                    errors={errors?.email}
                    />

                    <FormField
                    otherStyles='mb-4'
                    title="Password"
                    placeholder="Enter password"
                    isPassword={true}
                    value={password}
                    handleChangeText={setPassword}
                    errors={errors?.password}
                    />

                    <FormField
                    otherStyles='mb-4'
                    title="Confirm password"
                    placeholder="Enter confirm password"
                    isPassword={true}
                    value={confirmPassword}
                    handleChangeText={setConfirmPassword}
                    errors={errors?.password}
                    />
                </View>

                <CustomButton textStyles='text-white' containerStyles='bg-[#559D99] py-4 mt-4' title='Submit'  handlePress={submitForm} isLoading={isLoading} />
            </ContentBody>
        </ScrollView>
    )
}

export default add