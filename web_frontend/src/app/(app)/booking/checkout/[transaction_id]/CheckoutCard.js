'use client'

import { useState } from 'react'
import {Radio} from "antd"
import OnlinePayment from './OnlinePayment'
import CashPayment from './CashPayment'

const CheckoutCard = ({totalPrice, booking_id}) => {
  const [componentPaymentMethod, setComponentPaymentMethod] = useState("XENDIT")
  const paymentOptions = [
      {
          label: "Online payment",
          value: "XENDIT"
      },
      {
          label: "Cash on site",
          value: "CASH"
      },
  ]
  return (
    <div className="col-span-2 h-full px-[50px] bg-white lg:px-[200px] py-[50px] flex flex-col justify-center space-y-6 text-black">
    <Radio.Group
        block
        value={componentPaymentMethod}
        onChange={(e) => setComponentPaymentMethod(e.target.value)}
        options={paymentOptions}
        size="large"
        optionType="button"
        buttonStyle="solid"
    />
    {componentPaymentMethod === "CASH" ? <CashPayment paymentType={componentPaymentMethod} totalPrice={totalPrice} bookId={booking_id}/> : <OnlinePayment paymentType={componentPaymentMethod} totalPrice={totalPrice} bookId={booking_id}/>}
    
    </div>
  )
}

export default CheckoutCard