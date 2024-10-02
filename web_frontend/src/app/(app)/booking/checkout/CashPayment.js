import React from 'react'
import { Button, Alert } from 'antd'

const CashPayment = () => {
  return (
    <div className='w-full h-full flex flex-col justify-between'>
        <Alert
          message="Informational Notes"
          description="Please pay the total amount to the front desk upon arrival. "
          type="info"
          showIcon
        />
        

      <Button className="w-full" type="primary">Confirm Booking</Button>
    </div>
  )
}

export default CashPayment