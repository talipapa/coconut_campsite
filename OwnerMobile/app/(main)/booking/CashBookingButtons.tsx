import { View, Text } from 'react-native'
import React, { useCallback, useRef } from 'react'
import CustomButton from '@/components/CustomButton'
import axios from '@/utils/axios'
import ToastMessage from '@/components/ToastMessage'
import { cancelBooking, rescheduleBooking } from '@/utils/BookingService'
import { bookingSingleDetailType } from './[id]'
import BottomSheet from '@gorhom/bottom-sheet'


const CashBookingButtons = ({refresh, id, type, check_in} : {refresh: () => void, id: string, type: 'overnight'|'daytour', check_in: Date}) => {
    
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
        <CustomButton 
            title='Cancel booking' 
            textStyles="text-xs text-white" 
            containerStyles='bg-red-400 px-3' 
            handlePress={cancelBooking_localFunc}/>
    )
}

export default CashBookingButtons