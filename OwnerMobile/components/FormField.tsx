import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import {useState} from 'react'

interface FormFieldProps {
    title: string;
    placeholder: string;
    value: string;
    otherStyles?: string;
    handleChangeText: (e: string) => void;
    errors?: any;
}

const FormField: React.FC<FormFieldProps> = ({ title, placeholder, value, handleChangeText, otherStyles, errors = [], ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className='text-base text-gray-800 font-medium'>{title}</Text>
            {errors.map((error:string) => {
                return <Text key={error}>{error}</Text>
            })}

            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-[#BC7B5C] flex flex-row items-center">
                <TextInput
                className="flex-1 font-semibold text-base"
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#7B7B8B"
                onChangeText={handleChangeText}
                secureTextEntry={title === "Password" && !showPassword}
                {...props}
                />

                

                {title === "Password" && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Image
                    source={!showPassword ? require('@/assets/icons/eye.png') : require('@/assets/icons/eye-hide.png')}
                    className="w-6 h-6"
                    resizeMode="contain"
                    />
                </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default FormField