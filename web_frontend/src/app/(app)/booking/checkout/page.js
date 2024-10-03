'use client'

import { useLaravelBooking } from "@/hooks/booking";
import { Breadcrumb, Button, Radio, Skeleton } from "antd";
import { usePrice } from "@/hooks/prices";
import OnlinePayment from "./OnlinePayment";
import { useEffect, useState } from "react";
import CashPayment from "./CashPayment";
import { redirect } from 'next/navigation'

export default function Page() {

    const {booking} = useLaravelBooking()
    const {adultPrice, checkInDate, childPrice, tentPitchPrice, bonfireKitPrice, cabinPrice, calcPricePerUnit, calculateSubPrice} = usePrice()
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

    
    if (!booking) {
        return (
            <>
                <div className="m-[30px]">
                    <Skeleton paragraph={{ rows: 10 }}/>
                </div>
            </>
        )
    }

    console.log(booking)
    
    
    return (
        <>
            {/* HEADER */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    <Breadcrumb
                        items={[
                        {
                            title: <a href="/">Home</a>,
                        },
                        {
                            title: <a href="/booking">Booking</a>,
                        },
                        {
                            title: "Checkout",
                        },
                        ]}
                    />
                    </h2>
                </div>
            </header>

            {/* BODY */}
            <div className="m-[30px]">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col space-y-5 order-last md:order-first">
                        <h1 className="text-2xl font-semibold">Booking Summary</h1>
                        <div className="space-y-5">
                            <ul className="space-y-1">
                                <li>Check In Date: {booking?.data?.check_in}</li>
                                <li className="capitalize">Booking Type: {checkInDate}</li>
                            </ul>
                            <ul className="space-y-1">
                                <li>First Name: {booking?.data.first_name}</li>
                                <li>Last Name: {booking?.data.last_name}</li>
                                <li>Email: {booking?.data.email}</li>
                                <li>Tel Number: {booking?.data.tel_number}</li>
                            </ul>
                            <ul className="space-y-1">
                                <li>{booking?.data.adult_count !== 0 && `Adult (${booking?.data.adult_count} pax * ${childPrice}) = P ${(booking?.data.adult_count * adultPrice).toFixed(2)}` }</li>

                                <li>{booking?.data.child_count !== 0 && `Child (${booking?.data.child_count} pax * ${childPrice}) = P ${calcPricePerUnit(childPrice, booking?.data.child_count)}` }</li>

                                <li>{booking?.data.tent_pitching_count !== 0 && `Tent pitching (${booking?.data.tent_pitching_count} * ${tentPitchPrice}) = P ${calcPricePerUnit(tentPitchPrice, booking?.data.tent_pitching_count)}` }</li>

                                <li>{booking?.data.bonfire_kit_count !== 0 && `Tent pitching (${booking?.data.bonfire_kit_count} * ${bonfireKitPrice}) = P ${calcPricePerUnit(bonfireKitPrice, booking?.data.bonfire_kit_count)}` }</li>
                                <li>{booking?.data.is_cabin ? `Cabin (4-5 person) = P ${cabinPrice.toFixed(2)}` : "No"}</li>
                                <li className="font-bold">{`Total: P ${calculateSubPrice()}`}</li>
                            </ul>
                            <ul>
                                <li>Note: {booking?.data.note}</li>
                            </ul>
                        </div>
                    </div>
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

                        {componentPaymentMethod === "CASH" ? <CashPayment paymentType={componentPaymentMethod}/> : <OnlinePayment paymentType={componentPaymentMethod}/>}
                        
                    </div>
                </div>
            </div>
        </>
    );
}