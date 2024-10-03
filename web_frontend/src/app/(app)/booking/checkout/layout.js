'use client'

import { useLaravelBooking } from "@/hooks/booking";
import {useRouter} from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({children}) {
    const route = useRouter();
    const {booking, error, mutate} = useLaravelBooking()

    async function fetchBooking() {
        try {
            const resolvedBooking = await booking; // Await the promise to resolve
            // Check booking['message'] after promise is resolved
            if (resolvedBooking.message === false) {
                route.push('/booking');
            }
            if (resolvedBooking.data && Object.keys(resolvedBooking.data).includes('transactionStatus')){
                route.push('/view-booking');
            }
        } catch (err) {
            console.error('Error fetching booking data:', err);
        }
    }

    useEffect(() => {
        fetchBooking();
    }, [booking]);


    if (booking === undefined) {
        return (
            <>
            </>
        );
    }

    return (
        <section>
            {children}
        </section>
    );
}