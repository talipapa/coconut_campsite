import { useLaravelBooking } from "@/hooks/booking";

const fetchBooking = async () => {
    const res = await axios.get('api/v1/booking')
    return res.data
}


export default function Page() {

    const booking = fetchBooking()
    console.log(booking)
    
    return (
        <>
            <div>This is where the user can edit their booking</div>
        </>
    );
}