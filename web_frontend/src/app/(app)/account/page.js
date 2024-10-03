"use client"

import { useLaravelBooking } from "@/hooks/booking";
import Header from "../Header";
import { useAuth } from '@/hooks/auth'

export default function Page() {
    const { user } = useAuth({middleware: 'auth'})
    const { booking } = useLaravelBooking()

    return (
        <div>
        <Header title="Account" />
        <div className="m-[30px]">
            Account setting page
        </div>
    </div>
    );
}