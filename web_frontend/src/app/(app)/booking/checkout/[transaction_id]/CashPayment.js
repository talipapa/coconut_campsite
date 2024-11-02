import React from 'react'
import { Button, Alert } from 'antd'
import { useAuth } from '@/hooks/auth'
import { usePrice } from '@/hooks/prices'
import axios from '@/lib/axios'
import { useRouter } from "next/navigation"


const CashPayment = ({paymentType, totalPrice, bookId}) => {
  const { user } = useAuth({ middleware: 'auth' })
  const [invoiceEmail] = React.useState(user?.email)
  const router = useRouter()
  const {calculateFee, calculateTotalPrice} = usePrice()
  const [buttonLoading, setButtonLoading] = React.useState(false)
  const [paymentMethodVal] = React.useState("PH_GCASH")
  const subTotal = totalPrice

  const confirmBooking = async () => {
    setButtonLoading(true)
    axios.post('api/v1/transaction', {
      "email": invoiceEmail,
      "booking_id": bookId,
      "price": subTotal,
      // "price": calculateTotalPrice(subTotal, calculateFee(subTotal, paymentMethodVal)),
      "payment_type": paymentType,
      "paymentMethod": "CASH_ARRIVAL"

    })
    .then(() => {
      router.push('/view-booking')
    })
    .finally(() => {
      setButtonLoading(true)
      
    })
  }

  return (
    <div className='w-full flex flex-col space-y-6'>
        <Alert
          message="Informational Notes"
          description="Please pay the total amount to the front desk upon arrival. "
          type="info"
          showIcon
        />

        <div className='flex flex-col space-y-4'>

          <div className='w-full flex flex-row justify-between font-bold'>
            <span>Total Price</span>
            <span>P {subTotal}</span>
          </div>
        </div>
        

      <Button className="w-full" type="primary" size="large" onClick={confirmBooking} loading={buttonLoading}>Confirm Booking</Button>
    </div>
  )
}

export default CashPayment