import { View, Text } from 'react-native'
import React, { useCallback, useRef } from 'react'
import CustomButton from '@/components/CustomButton'
import { refundBooking, rescheduleBooking } from '@/utils/BookingService'
import ToastMessage from '@/components/ToastMessage'
import { bookingSingleDetailType } from './[id]'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

const XenditBookingButtons = ({refresh, id, type, check_in} : {refresh: () => void, id: string, type: 'overnight'|'daytour', check_in: Date}) => {
    
    const refundBooking_localFunc = () => {
        refundBooking(id)
        .then((res) => {
            ToastMessage('success', 'Refund request', "Refund request has been sent")
        })
        .catch((err) => {
            ToastMessage('error', 'Replacing data failed', JSON.stringify(err))
        })
        .finally(() => {
            refresh()
        })
        
    }

    return (
        <>
            <View className='flex flex-row justify-start'>
                <CustomButton 
                    title='Refund booking' 
                    textStyles="text-xs text-white" 
                    containerStyles='ml-3 bg-red-400 px-3' 
                    handlePress={refundBooking_localFunc}/>
            </View>
        
        </>
    )
}

export default XenditBookingButtons