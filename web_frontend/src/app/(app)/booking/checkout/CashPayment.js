import React from 'react'
import { Button, Alert } from 'antd'
import { useAuth } from '@/hooks/auth'
import { usePrice } from '@/hooks/prices'
import { useLaravelBooking } from '@/hooks/booking'
import axios from '@/lib/axios'
import { useRouter } from "next/navigation";



const CashPayment = ({paymentType}) => {
  const { user } = useAuth({ middleware: 'auth' })
  const [invoiceEmail, setInvoiceEmail] = React.useState(user?.email)
  const router = useRouter()
  
  const {booking} = useLaravelBooking()
  const {calculateSubPrice, calculateFee, calculateTotalPrice} = usePrice()
  const [paymentMethodVal, setPaymentMethodVal] = React.useState("PH_GCASH")
  const subTotal = calculateSubPrice()

  const confirmBooking = async () => {
    axios.post('api/v1/transaction', {
      email: invoiceEmail,
      booking_id: booking.data.id,
      price: calculateTotalPrice(subTotal, calculateFee(subTotal, paymentMethodVal)),
      payment_type: paymentType,
      paymentMethod: "CASH_ARRIVAL"

    })
    .then((response) => {
      // console.log(response.data.data.)
      router.push('/view-booking')
      
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
              <span>P {calculateSubPrice()}</span>
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
        

      <Button className="w-full" type="primary" onClick={confirmBooking}>Confirm Booking</Button>
    </div>
  )
}

export default CashPayment