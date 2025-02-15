'use client'

import { useLaravelBooking } from "@/hooks/booking"
import { Breadcrumb, Skeleton, Spin } from "antd"
import { usePrice } from "@/hooks/prices"
import CheckoutCard from "./CheckoutCard"
import { useEffect, useState } from "react"
import dayjs from "dayjs"


export default function Page({params}) {
    const [totalPrice, setTotalPrice] = useState(0)
    const { booking, error } = useLaravelBooking({routeLink: `api/v1/transaction/${params.transaction_id}`})
    const {adultPrice, childPrice, tentPitchPrice, bonfireKitPrice, calcPricePerUnit, calculateFee, calculateTotalPrice} = usePrice()

    useEffect(() => {
        if (!booking) return
        var total = 0

        total += (adultPrice * booking.booking.adultCount)
        total += (childPrice * booking.booking.childCount)
        total += (tentPitchPrice * booking.booking.tent_pitching_count)
        total += (bonfireKitPrice * booking.booking.bonfire_kit_count)
    
        // Add cabin price if applicable
        if (booking.booking.cabin_id) {
            total += booking.booking.cabin_price
        }
        setTotalPrice(total.toFixed(2))
    }, [booking])

    if (error) {
        return (
            <div className="m-[30px]">
                <h1>Error</h1>
                <p>{error.message}</p>
            </div>
        )
    }
    
    if (!booking && booking?.data == undefined) {
        return (
            <>
                <main className='min-h-[100vh] p-[100px] flex flex-col items-center'>
                    <Spin size="large" />
                </main>
            </>
        )
    }

    
    return (
        <>
            {/* BODY */}
            <div>
                <header className="shadow bg-[#986B41]">
                    <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">

                        <h2 className="font-semibold text-xl leading-tight">
                        <Breadcrumb
                            items={[
                            {
                                title: <a href="/" className="!text-[#dddddd]">Home</a>,
                            },
                            {
                                title: <a href="/booking" className="!text-[#dddddd]">Booking</a>,
                            },
                            {
                                title: <span className="text-[#98F7F0] cursor-pointer">Checkout</span>,
                            }
                            ]}
                        />
                        </h2>
                    </div>
                </header>
                <div className="grid grid-cols-1  md:grid-cols-3 min-h-[100vh]">
                    <div className="flex flex-col space-y-5 order-last md:order-first h-full bg-[#256560] ">
                        <div className="px-[30px] py-[50px]  space-y-4 text-center md:text-left text-white">
                            <h1 className="text-2xl font-semibold">Booking Summary</h1>
                            <div className="space-y-5">
                                <ul className="space-y-1">
                                    <li>Check In Date:
                                        <span className="font-bold ml-1">
                                            {dayjs(booking.booking.check_in).format('dddd | MMMM DD, YYYY')}
                                        </span>
                                    </li>
                                    <li className="capitalize">Booking Type: {booking.booking.booking_type}</li>
                                </ul>
                                <ul className="space-y-1">
                                    <li>First Name: {booking.booking.first_name}</li>
                                    <li>Last Name: {booking.booking.last_name}</li>
                                    <li>Email: {booking.booking.email}</li>
                                    <li>Tel Number: {booking.booking.tel_number}</li>
                                </ul>
                                <ul className="space-y-1">
                                    <li>{booking.booking.adultCount !== 0 && `Adult (${booking.booking.adultCount} pax * ${adultPrice}) = P ${(booking.booking.adultCount * adultPrice).toFixed(2)}` }</li>

                                    <li>{booking.booking.childCount !== 0 && `Child (${booking.booking.childCount} pax * ${childPrice}) = P ${calcPricePerUnit(childPrice, booking.booking.childCount)}` }</li>

                                    <li>{booking.booking.tent_pitching_count !== 0 && `Tent pitching (${booking.booking.tent_pitching_count} * ${tentPitchPrice}) = P ${calcPricePerUnit(tentPitchPrice, booking.booking.tent_pitching_count)}` }</li>

                                    <li>{booking.booking.bonfire_kit_count !== 0 && `Tent pitching (${booking.booking.bonfire_kit_count} * ${bonfireKitPrice}) = P ${calcPricePerUnit(bonfireKitPrice, booking.booking.bonfire_kit_count)}` }</li>
                                    {booking.booking.cabin_id && <li>{booking.booking.cabin_name}: P {booking.booking.cabin_price}</li>}
                                    <li className="font-bold">{`Total: P ${totalPrice}`}</li>
                                    
                                </ul>
                                <ul>
                                    { booking.booking.note && <li>Note: {booking.booking.note}</li>}
                                </ul>
                            </div>
                        </div>

                    </div>
                    <CheckoutCard totalPrice={totalPrice} booking_id={booking.booking.id} calculateFee={calculateFee} calculateTotalPrice={calculateTotalPrice}/>

                </div>
            </div>
        </>
    )
}