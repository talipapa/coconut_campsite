import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from '@/components/CustomButton'
import axios from '@/utils/axios'
import ToastMessage from '@/components/ToastMessage'
import { cancelBooking, rescheduleBooking } from '@/utils/BookingService'
import { bookingSingleDetailType } from './[id]'


const CashBookingButtons = ({refresh, id, type, check_in} : {refresh: () => void, id: string, type: 'overnight'|'daytour', check_in: Date}) => {

    const rescheduleBooking_localFunc = () => {
        rescheduleBooking(id, type, check_in)
        .then((res) => {
            ToastMessage('success', 'Rescheduling', "Rescheduling has been changed successfully")
            
        })
        .catch((err) => {
            ToastMessage('error', 'Replacing booking data failed', JSON.stringify(err))
        })
        .finally(() => {
            refresh()
        })
    }
    
    const cancelBooking_localFunc = () => {
        cancelBooking(id)
        .then((res) => {
            ToastMessage('success', "Booking cancellation", "Booking has been cancelled successfully")
            refresh()
        })
        .catch((err) => {
            if (err.response.status === 400) ToastMessage('error', "Cancellation request existed", err.response.data.message)
                else ToastMessage('error', 'Replacing booking data failed', JSON.stringify(err))
        })
        .finally(() => {
            refresh()
        })
    }


    return (
        <View className='flex flex-row justify-start'>
            <CustomButton 
                title='Reschedule' 
                textStyles='text-xs text-white' 
                containerStyles='bg-[#BC7B5C] px-3' 
                handlePress={rescheduleBooking_localFunc}/>
            <CustomButton 
                title='Cancel' 
                textStyles="text-xs text-white" 
                containerStyles='ml-3 bg-red-400 px-3' 
                handlePress={cancelBooking_localFunc}/>
        </View>
    )
}

export default CashBookingButtons