'use client'

import { Button, Popconfirm, notification  } from 'antd'
import RescheduleButton from './ButtonComponent/RescheduleButton'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import axios from '@/lib/axios'


const ActionButtons = ({checkIn, bookingType, bookingId, transactionStatus}) => {
    const [open, setOpen] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const showPopconfirm = () => {
        setOpen(true)
    }

    const [api, contextHolder] = notification.useNotification()
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
        // Refund or Cancel logic here
        switch (transactionStatus) {
            case 'CASH_PENDING':
                axios.post('/api/v1/booking/cancel/' + bookingId, bookingId)
                .then(() => {
                    window.location.reload()
                })
                .catch(() => {
                    window.location.reload()
                })
                break
            case 'PAID':
                axios.post('/api/v1/booking/refund/' + bookingId, bookingId)
                .then(() => {
                    window.location.reload()
                })
                .catch(() => {
                    window.location.reload()
                })
                break
            default:

                break
        }
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
    return (
        <>
            {contextHolder}
            <div className="space-x-4">
                <Button color="primary" variant="solid"><a href="https://www.facebook.com/profile.php?id=61558384738390" target="_blank" rel="noreferrer">Contact Campsite</a></Button>
                <RescheduleButton checkIn={checkIn} bookingType={bookingType} bookingId={bookingId}/>
                <Popconfirm
                    open={open}
                    onConfirm={handleOk}
                    okButtonProps={{
                    loading: confirmLoading,
                    }}
                    onCancel={handleCancel}
                    title="Refund or cancel this booking?"
                    description="Are you sure you want to refund/cancel this booking?"
                    icon={
                    <QuestionCircleOutlined
                        style={{
                        color: 'red',
                        }}
                    />
                    }
                >
                    {transactionStatus != 'CASH_PENDING' ? <Button color="danger" variant="outlined" onClick={showPopconfirm}>Refund</Button> : <Button color="danger" variant="outlined" onClick={showPopconfirm}>Cancel booking</Button>}
                    
                </Popconfirm>
            </div>
        </>
    )
}

export default ActionButtons