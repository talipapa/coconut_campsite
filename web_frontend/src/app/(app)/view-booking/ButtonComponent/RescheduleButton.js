'use client'

import { Button, Modal, DatePicker, Radio, notification,  } from 'antd'
import { useState } from 'react'
import dayjs from 'dayjs'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'


const RescheduleButton = ({checkIn, bookingType, bookingId}) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [checkInDate, setCheckInDate] = useState(dayjs(checkIn))
    const [localBookingType, setLocalBookingType] = useState(bookingType)

    const showModal = () => {
      setOpen(true)
    }

    const openSuccessNotification = () => {
        api['success']({
          message: 'Rescheduled successfully!',
          placement: 'bottomRight',
          description:
            "Your booking will  be rescheduled shortly!"
        })
    }

    const openErrorNotification = () => {
        api['error']({
          message: 'Oops!',
          placement: 'bottomRight',
          description:
            "Something went wrong"
        })
    }

    const handleOk = () => {
        // Refund logic here

        const payload = {
            "check_in": checkInDate,
            "booking_type": localBookingType
        }

        axios.patch('/api/v1/booking/reschedule/' + bookingId, payload)
        .then(() => {
            openSuccessNotification()
            router.refresh()
        })
        .catch(() => {
            openErrorNotification()
        })


        // Refund is successful in this state
        setConfirmLoading(true)
        setTimeout(() => {
            setOpen(false)
            setConfirmLoading(false)
        }, 2000)
    }

    const handleCancel = () => {
      setOpen(false)
    }

    const bookingTypeOption = [
        {
          label: 'Day tour',
          value: "daytour",
        },
        {
          label: 'Overnight',
          value: "overnight",
        },
    ]
    
    const [api, contextHolder] = notification.useNotification()


    return (
    <>
        {contextHolder}
        <Button color="default" variant="outlined" onClick={showModal}>
            Reschedule booking
        </Button>

        <Modal
            title="Reschedule"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
        >
            <div className="space-y-3">
                <div className="space-y-2">
                    <label htmlFor="checkInDate">Check in</label>
                    <DatePicker className="w-full"
                        id="checkInDate"
                        minDate={dayjs().add(2, 'day')}
                        value={checkInDate}
                        onChange={date => setCheckInDate(date)}
                        maxDate={dayjs().add(3, 'month')}
                        format="MMMM DD, YYYY"
                    />
                    {/* <InputError messages={errors.checkInDate} className="mt-2" /> */}
                </div>
                
                <div className="space-y-2">
                    <div className="space-x-4">
                        <label htmlFor="bookingType">Booking type</label>
                        {/* <span className="text-[#555555]">Price ₱ {isCabin ? cabinPrice : "0.00"}</span> */}
                    </div>
                    <Radio.Group value={localBookingType} onChange={event => setLocalBookingType(event.target.value)} block options={bookingTypeOption} optionType="button" buttonStyle="solid" size="large" id="bookingType" />
                    {/* <InputError messages={errors.bookingType} className="mt-2" /> */}
                </div>
            </div>
        </Modal>
    </>
  )
}

export default RescheduleButton