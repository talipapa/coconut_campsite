'use client';

import { Button, Modal, DatePicker, Radio } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import InputError from '@/components/InputError';


const RescheduleButton = ({checkIn, bookingType}) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [checkInDate, setCheckInDate] = useState(dayjs(checkIn));
    const [localBookingType, setLocalBookingType] = useState(bookingType);

    const showModal = () => {
      setOpen(true);
    };

    const handleOk = () => {
        // Refund logic here



        // Refund is successful in this state
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
      console.log('Clicked cancel button');
      setOpen(false);
    };

    const bookingTypeOption = [
        {
          label: 'Day tour',
          value: "daytour",
        },
        {
          label: 'Overnight',
          value: "overnight",
        },
    ];
    

    return (
    <>
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
                        minDate={dayjs()}
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