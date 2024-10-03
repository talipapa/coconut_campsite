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
      router.push('/account')
      
    })
  }

  return (
    <div className='w-full h-full flex flex-col justify-between'>
        <Alert
          message="Informational Notes"
          description="Please pay the total amount to the front desk upon arrival. "
          type="info"
          showIcon
        />
        

      <Button className="w-full" type="primary" onClick={confirmBooking}>Confirm Booking</Button>
    </div>
  )
}

export default CashPayment