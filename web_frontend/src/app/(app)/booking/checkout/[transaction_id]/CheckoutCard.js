'use client'

import { useState } from 'react'
import {Radio} from "antd"
import OnlinePayment from './OnlinePayment'
import CashPayment from './CashPayment'
import { usePrice } from '@/hooks/prices'

const CheckoutCard = ({totalPrice, booking_id, calculateFee, calculateTotalPrice}) => {
  const [componentPaymentMethod, setComponentPaymentMethod] = useState("XENDIT")

  const paymentOptions = [
      {
          label: "E-wallet",
          value: "XENDIT"
      },
      {
          label: "Cash on site",
          value: "CASH"
      },
  ]
  return (
    <div className="col-span-2 h-full px-[50px] bg-white lg:px-[5vw] xl:px-[15vw] py-[50px] flex flex-col justify-center space-y-6 text-black">
    <Radio.Group
        block
        value={componentPaymentMethod}
        onChange={(e) => setComponentPaymentMethod(e.target.value)}
        options={paymentOptions}
        size="large"
        optionType="button"
        buttonStyle="solid"
    />
    {componentPaymentMethod === "CASH" ? <CashPayment calculateFee={calculateFee} calculateTotalPrice={calculateTotalPrice} paymentType={componentPaymentMethod} totalPrice={totalPrice} bookId={booking_id}/> : <OnlinePayment  calculateFee={calculateFee} calculateTotalPrice={calculateTotalPrice} paymentType={componentPaymentMethod} totalPrice={totalPrice} bookId={booking_id}/>}
    
    </div>
  )
}

export default CheckoutCard