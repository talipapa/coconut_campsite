import { Button, Radio, Alert, notification } from 'antd'
import React from 'react'
import { useAuth } from '@/hooks/auth'
import { usePrice } from '@/hooks/prices'
import { useLaravelBooking } from '@/hooks/booking'
import axios from '@/lib/axios'

const OnlinePayment = ({paymentType, totalPrice, bookId, calculateFee, calculateTotalPrice}) => {
  const { user } = useAuth({ middleware: 'auth' })
  const [invoiceEmail] = React.useState(user?.email)
  const [api, contextHolder] = notification.useNotification()
  const [buttonLoading, setButtonLoading] = React.useState(false)
  const {mutate} = useLaravelBooking(`api/v1/booking/${bookId}`)
  
  const [paymentMethodVal, setPaymentMethodVal] = React.useState("PH_GCASH")
  const subTotal = totalPrice

  const openErrorValidationNotification = (errorContent, errorType) => {
    if (errorType === 'object'){
      api['error']({
        message: errorContent.error_code,
        placement: 'bottomRight',
        showProgress: true,
        pauseOnHover: false,
        description:
        <>
          {errorContent.message}
        </>
      })
    } else{
      api['error']({
        message: 'Error',
        placement: 'bottomRight',
        showProgress: true,
        pauseOnHover: false,
        description:
        <>
          {errorContent}
        </>
      })
    }

  }



  // TODO LIST: REDIRECT TO SUCCESS PAYMENT ROUTE
  const confirmBooking = async () => {
    setButtonLoading(true)
    axios.post('api/v1/transaction', {
      "email": invoiceEmail,
      "price": subTotal,
      "payment_type": paymentType,
      "booking_id": bookId,
      "paymentMethod": paymentMethodVal
    })
    .then((response) => {
      // console.log(response.data.data)
      mutate('/api/v1/booking-check')
      window.location.href = response.data.data.actions.desktop_web_checkout_url
      setButtonLoading(true)
    })
    .catch((error) => {
      setButtonLoading(false)
      var errorData
      // check if errorData is string or object
      if (typeof error.response.data !== 'string') {
        console.log(error.response.data)
        errorData = JSON.parse(error.response.data)
        openErrorValidationNotification(errorData, 'object')
      } else{
        errorData = error.response.data
        openErrorValidationNotification(errorData, 'string')
      }
    })
      
  }

  const paymentMethod = [
    {
        label: "Gcash",
        value: "PH_GCASH"
    },
    {
        label: "GrabPay",
        value: "PH_GRABPAY"
    },
]
  return (
    <>
      {contextHolder}
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
                <span>P {subTotal}</span>
              </div>
              <div className='w-full flex flex-row justify-between text-slate-600'>
                <span>Xendit Fee</span>
                <span>P {calculateFee(subTotal, paymentMethodVal)}</span>
              </div>
            </div>
            <div className='w-full flex flex-row justify-between font-bold'>
              <span>Total Price</span>
              <span>P {calculateTotalPrice(subTotal, calculateFee(subTotal, paymentMethodVal))}</span>
            </div>
          </div>

        </div>
        <Button className="w-full" type="primary" size='large' onClick={confirmBooking} loading={buttonLoading}>Confirm Booking</Button>
      </div>
    </>
  )
}

export default OnlinePayment