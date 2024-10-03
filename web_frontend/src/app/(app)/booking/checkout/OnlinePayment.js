import { Button, Radio, Input, Alert } from 'antd'
import React from 'react'
import MailFilled from '@ant-design/icons/MailFilled'
import { useAuth } from '@/hooks/auth'
import { usePrice } from '@/hooks/prices'
import { useLaravelBooking } from '@/hooks/booking'
import axios from '@/lib/axios'

const OnlinePayment = (componentPaymentMethod) => {
  const { user } = useAuth({ middleware: 'auth' })
  const [invoiceEmail, setInvoiceEmail] = React.useState(user?.email)
  
  const {booking} = useLaravelBooking()
  const {calculateSubPrice, calculateFee, calculateTotalPrice} = usePrice()
  const [paymentMethodVal, setPaymentMethodVal] = React.useState("PH_GCASH")
  const subTotal = calculateSubPrice()

 // TODO LIST: REDIRECT TO SUCCESS PAYMENT ROUTE
  const confirmBooking = async () => {
    axios.post('api/v1/transaction', {
      email: invoiceEmail,
      booking_id: booking.data.id,
      price: calculateTotalPrice(subTotal, calculateFee(subTotal, paymentMethodVal)),
      payment_type: componentPaymentMethod['paymentType'],
      paymentMethod: paymentMethodVal
    })
    .then((response) => {
      // console.log(response.data.data.)
      window.location.href =
      response.data.data.actions.desktop_web_checkout_url
    })
  }
  

  const paymentMethod = [
    {
        label: "Gcash",
        value: "PH_GCASH"
    },
    {
        label: "Paymaya",
        value: "PH_PAYMAYA"
    },
    {
        label: "GrabPay",
        value: "PH_GRABPAY"
    },
]


  return (
    <div className='w-full h-full flex flex-col justify-between space-y-5'>
      <div className='w-full flex flex-col space-y-6'>
        <Alert
          message="Informational Notes"
          description="You will be redirected to a trusted payment gateway to complete the transaction. You can still reschedule booking or refund before the scheduled date."
          type="info"
          showIcon
        />

        <Radio.Group
            block
            value={paymentMethodVal}
            onChange={(e) => setPaymentMethodVal(e.target.value)}
            options={paymentMethod}
            size="large"
            optionType="button"
            buttonStyle="solid"
        />

        <div className='flex flex-col space-y-4'>
          <div>
            <div className='w-full flex flex-row justify-between'>
              <span>Subtotal</span>
              <span>P {calculateSubPrice()}</span>
            </div>
            <div className='w-full flex flex-row justify-between text-slate-600'>
              <span>Xendit Fee</span>
              <span>P {calculateFee(calculateSubPrice(), paymentMethodVal)}</span>
            </div>
          </div>
          <div className='w-full flex flex-row justify-between font-bold'>
            <span>Total Price</span>
            <span>P {calculateTotalPrice(subTotal, calculateFee(subTotal, paymentMethodVal))}</span>
          </div>
        </div>




      </div>
      <Button className="w-full" type="primary" size='large' onClick={confirmBooking}>Confirm Booking</Button>
    </div>
  )
}

export default OnlinePayment