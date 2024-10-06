'use client'

import { Button, Popconfirm  } from 'antd'
import RescheduleButton from './ButtonComponent/RescheduleButton';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from '@/lib/axios';


const ActionButtons = ({checkIn, bookingType, bookingId}) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const showPopconfirm = () => {
        setOpen(true);
    };
    const handleOk = () => {
        // Refund logic here
        axios.post('/api/v1/booking/refund/' + bookingId, bookingId)
        .then((res) => {
            console.log(res)
        })

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

    return (
        <div className="space-x-4">
            <Button color="primary" variant="solid"><a href="https://www.facebook.com/profile.php?id=61558384738390" target="_blank">Contact Campsite</a></Button>
            <RescheduleButton checkIn={checkIn} bookingType={bookingType}/>
            <Popconfirm
                open={open}
                onConfirm={handleOk}
                okButtonProps={{
                loading: confirmLoading,
                }}
                onCancel={handleCancel}
                title="Refund this booking?"
                description="Are you sure you want to refund this booking?"
                icon={
                <QuestionCircleOutlined
                    style={{
                    color: 'red',
                    }}
                />
                }
            >
                <Button color="danger" variant="outlined" onClick={showPopconfirm}>Refund</Button>
            </Popconfirm>
        </div>
    )
}

export default ActionButtons