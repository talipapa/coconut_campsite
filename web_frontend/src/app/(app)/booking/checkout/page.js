'use client'

import { useLaravelBooking } from "@/hooks/booking";
import { useEffect } from "react";
import Header from "../../Header";
import { Breadcrumb, Skeleton } from "antd";

export default function Page() {
    
    const {booking} = useLaravelBooking()

    console.log(booking?.data.is_cabin)

    if (!booking) {
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


                First Name: {booking?.data.first_name}<br />
                Last Name: {booking?.data.last_name}<br />
                Email: {booking?.data.email}<br />
                Tel Number: {booking?.data.tel_number}<br />
                Adult Count: {booking?.data.adult_count}<br />
                Child Count: {booking?.data.child_count}<br />
                Check In Date: {booking?.data.check_in}<br />
                Booking Type: {booking?.data.booking_type}<br />
                Tent Pitching Count: {booking?.data.tent_pitching_count}<br />
                Bonfire Kit Count: {booking?.data.bonfire_kit_count}<br />
                Is Cabin: {booking?.data.is_cabin ? "Yes" : "No"}<br />
                Note: {booking?.data.note}<br />
            </div>
        </>
    );
}