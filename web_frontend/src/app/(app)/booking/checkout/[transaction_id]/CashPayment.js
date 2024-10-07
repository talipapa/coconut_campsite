import React from 'react'
import { Button, Alert } from 'antd'
import { useAuth } from '@/hooks/auth'
import { usePrice } from '@/hooks/prices'
import { useLaravelBooking } from '@/hooks/booking'
import axios from '@/lib/axios'
import { useRouter } from "next/navigation";

import { mutate } from 'swr'



const CashPayment = ({paymentType, totalPrice, bookId}) => {
  const { user } = useAuth({ middleware: 'auth' })
  const [invoiceEmail, setInvoiceEmail] = React.useState(user?.email)
  const router = useRouter()
  const {booking, mutate} = useLaravelBooking(`api/v1/booking/${bookId}`)
  const {calculateSubPrice, calculateFee, calculateTotalPrice} = usePrice()
  const [buttonLoading, setButtonLoading] = React.useState(false)
  const [paymentMethodVal, setPaymentMethodVal] = React.useState("PH_GCASH")
  const subTotal = totalPrice

  const confirmBooking = async () => {
    setButtonLoading(true)
    axios.post('api/v1/transaction', {
      "email": invoiceEmail,
      "booking_id": bookId,
      "price": calculateTotalPrice(subTotal, calculateFee(subTotal, paymentMethodVal)),
      "payment_type": paymentType,
      "paymentMethod": "CASH_ARRIVAL"

    })
    .then((response) => {
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
          <div>
            <div className='w-full flex flex-row justify-between'>
              <span>Subtotal</span>
              <span>P {totalPrice}</span>
            </div>
            <div className='w-full flex flex-row justify-between text-slate-600'>
              <span>Xendit Fee</span>
              <span>P 0.00</span>
            </div>
          </div>
          <div className='w-full flex flex-row justify-between font-bold'>
            <span>Total Price</span>
            <span>P {calculateTotalPrice(subTotal, calculateFee(subTotal, paymentMethodVal))}</span>
          </div>
        </div>
        

      <Button className="w-full" type="primary" size="large" onClick={confirmBooking} loading={buttonLoading}>Confirm Booking</Button>
    </div>
  )
}

export default CashPayment