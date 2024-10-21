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
    <div className="bg-white w-full h-full px-[30px] py-[50px] flex flex-col justify-between space-y-6">
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