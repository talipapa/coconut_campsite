'use client'

import { useLaravelBooking } from "@/hooks/booking";
import { Breadcrumb, Button, Skeleton } from "antd";
import { usePrice } from "@/hooks/prices";
import CheckoutCard from "./CheckoutCard";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";


export default function Page({params}) {
    const [totalPrice, setTotalPrice] = useState(0)
    const { booking, error } = useLaravelBooking({routeLink: `api/v1/transaction/${params.transaction_id}`})

    const {adultPrice, checkInDate, childPrice, tentPitchPrice, bonfireKitPrice, cabinPrice, calcPricePerUnit} = usePrice()

    useEffect(() => {
        if (!booking) return;
        var total = 0;

        total += (adultPrice * booking.booking.adultCount);
        total += (childPrice * booking.booking.childCount);
        total += (tentPitchPrice * booking.booking.tent_pitching_count);
        total += (bonfireKitPrice * booking.booking.bonfire_kit_count);
    
        // Add cabin price if applicable
        if (booking.booking.is_cabin) {
            total += cabinPrice;
        }
    
        setTotalPrice(total.toFixed(2));
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
                <div className="m-[30px]">
                    <Skeleton paragraph={{ rows: 10 }}/>
                </div>
            </>
        )
    }

    
    return (
        <>
            {/* HEADER */}
            <header className="bg-white shadow">
                <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">

                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    <Breadcrumb
                        items={[
                        {
                            title: <a href="/" className="text-slate-400">Home</a>,
                        },
                        {
                            title: <a href="/booking" className="text-slate-400">Booking</a>,
                        },
                        {
                            title: <span className="text-black cursor-pointer">Checkout</span>,
                        }
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
                                <li>Check In Date: {booking.booking.check_in}</li>
                                <li className="capitalize">Booking Type: {checkInDate}</li>
                            </ul>
                            <ul className="space-y-1">
                                <li>First Name: {booking.booking.first_name}</li>
                                <li>Last Name: {booking.booking.last_name}</li>
                                <li>Email: {booking.booking.email}</li>
                                <li>Tel Number: {booking.booking.tel_number}</li>
                            </ul>
                            <ul className="space-y-1">
                                <li>{booking.booking.adultCount !== 0 && `Adult (${booking.booking.adultCount} pax * ${childPrice}) = P ${(booking.booking.adultCount * adultPrice).toFixed(2)}` }</li>

                                <li>{booking.booking.childCount !== 0 && `Child (${booking.booking.childCount} pax * ${childPrice}) = P ${calcPricePerUnit(childPrice, booking.booking.childCount)}` }</li>

                                <li>{booking.booking.tent_pitching_count !== 0 && `Tent pitching (${booking.booking.tent_pitching_count} * ${tentPitchPrice}) = P ${calcPricePerUnit(tentPitchPrice, booking.booking.tent_pitching_count)}` }</li>

                                <li>{booking.booking.bonfire_kit_count !== 0 && `Tent pitching (${booking.booking.bonfire_kit_count} * ${bonfireKitPrice}) = P ${calcPricePerUnit(bonfireKitPrice, booking.booking.bonfire_kit_count)}` }</li>
                                <li>{booking.booking.is_cabin && `Cabin (4-5 person) = P ${cabinPrice.toFixed(2)}`}</li>
                                <li className="font-bold">{`Total: P ${totalPrice}`}</li>
                                
                            </ul>
                            <ul>
                                { booking.booking.note && <li>Note: {booking.booking.note}</li>}
                            </ul>
                        </div>
                    </div>
                    <CheckoutCard totalPrice={totalPrice} booking_id={booking.booking.id}/>

                </div>
            </div>
        </>
    );
}