import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import {useState} from 'react'

interface CalendarFieldProps {
    title: string;
    placeholder: string;
    value: Date;
    otherStyles?: string;
    handleChangeDate: (e: Date) => void;
    errors?: any;
}

const CalendarField: React.FC<CalendarFieldProps> = ({ title, placeholder, value, handleChangeDate, otherStyles, errors = [], ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className='text-base text-gray-800 font-medium'>{title}</Text>


            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-[#BC7B5C] flex flex-row items-center">


       

            </View>
            {errors.map((error:string) => {
            return <Text key={error} className='text-red-400'>{error}</Text>
            })}
        </View>
    )
}

export default CalendarField