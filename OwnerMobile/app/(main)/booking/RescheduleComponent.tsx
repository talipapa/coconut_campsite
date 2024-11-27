import { View, Text, Image } from 'react-native'
import { useState } from 'react'
import React from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '@/components/CustomButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { rescheduleBooking } from '@/utils/BookingService';
import ToastMessage from '@/components/ToastMessage';

const RescheduleComponent = ({id, checkInDate, bookingType, refreshData} : {id: string, checkInDate: Date, bookingType: 'overnight'|'daytour', refreshData: () => void}) => {
    const [date, setDate] = useState(new Date(checkInDate));
    const [requestBookingType, setRequestBookingType] = useState(bookingType)
    const [mode, setMode] = useState<any>('date');
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    
  
    const onChange = (event: any, selectedDate: any) => {
      const currentDate = selectedDate;
      setShow(false);
      setDate(currentDate);
    };
  
    const showMode = (currentMode: string) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };

    const rescheduleBooking_localFunc = () => {
        setIsLoading(true)
        rescheduleBooking(id, requestBookingType, date)
        .then((res) => {
            ToastMessage('success', 'Rescheduling', "Rescheduling has been changed successfully")
        })
        .catch((err) => {
            ToastMessage('error', 'Replacing booking data failed', JSON.stringify(err))
        })
        .finally(() => {
            setIsLoading(false)
            refreshData()
        })
    }

    const changeBookingType = (type:'overnight'|'daytour') => {
        setRequestBookingType(type)
    }
  
    return (
        <>
            <View className='h-full justify-between'>
                <View className='space-y-5'>
                    <View className='space-y-2'>
                        <Text className='font-semibold'>Check in</Text>
                        <TouchableOpacity onPress={showDatepicker} className='w-[90vw] flex-row items-center space-x-4 bg-blue-500 border-1 px-4 py-2'>
                            <Image source={require("@/assets/icons/check-in.png")} tintColor="#FFFFFF" className='h-6 w-6'/>
                            <Text className='text-xl text-white'>{date.toDateString()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View className='space-y-2'>
                        <Text className='font-semibold'>Booking type</Text>
                        <View className='flex-row w-full flex justify-center items-center'>

                            <TouchableOpacity onPress={() => changeBookingType('daytour')}  className={`${requestBookingType === "daytour" ? 'bg-blue-500' : 'bg-slate-300'} w-[45vw] h-[40px] flex items-center justify-center`}>
                                <Text className={`${requestBookingType === "daytour" ? 'text-white' : 'text-slate-500'} text-center`}>Daytour</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => changeBookingType('overnight')} className={`${requestBookingType === "overnight" ? 'bg-blue-500' : 'bg-slate-300'} w-[45vw] h-[40px] flex items-center justify-center`}>
                                <Text className={`${requestBookingType === "overnight" ? 'text-white' : 'text-slate-500'} text-center`}>Overnight</Text>
                            </TouchableOpacity>
                        </View>
   
                        
                    </View>
                </View>


                <CustomButton 
                    title='Reschedule' 
                    handlePress={rescheduleBooking_localFunc}
                    containerStyles='bg-[#BC7B5C] w-full'
                    textStyles='text-white text-xs'
                    isLoading={isLoading}
                />

            </View>
            {show && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
                minimumDate={new Date()}
                />
            )}
        </>
    )
    }

export default RescheduleComponent