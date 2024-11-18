import { cookies } from "next/headers"
import QrCard from "./QrCard"
import ActionButtons from "./ActionButtons"
import { redirect } from "next/navigation"
import dayjs from "dayjs"
import { Alert } from "antd"
import DrawerComponent from "./DrawerComponent"


const getData = async () => {
    // MAKE SURE REFERER IS PROPERLY SET IN HEADERS OR YOU WILL BE LIKE ME DEBUGGING THIS FOR HALF A DAY
    let bookingFetchPath = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/booking"
    let priceFetchPath = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/price"


    
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`)
    
    const options = {
        method: "GET",
        credentials: "include",
        headers: {
            'Accept' : "application/json",
            'Referer' : process.env.APP_URL,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Cookie: "XSRF-TOKEN=" + cookies().get('XSRF-TOKEN').value + ";coconut_campsite_session="+cookies().get('coconut_campsite_session').value,
            Authorization: "Bearer " + cookies().get('XSRF-TOKEN').value
            
        },
    }
    
    const bookingRaw = await fetch(bookingFetchPath, options)
    const pricesRaw = await fetch(priceFetchPath, options)
    
    return {
        bookingData: await bookingRaw.json(),
        pricesData: await pricesRaw.json()
    }
}

const getXenditData = async (xenditId) => {
    let xenditFetchPath = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/v1/xendit/${xenditId}`
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`)
    
    const options = {
        method: "GET",
        credentials: "include",
        headers: {
            'Accept' : "application/json",
            'Referer' : process.env.APP_URL,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Cookie: "XSRF-TOKEN=" + cookies().get('XSRF-TOKEN').value + ";coconut_campsite_session="+cookies().get('coconut_campsite_session').value,
            Authorization: "Bearer " + cookies().get('XSRF-TOKEN').value
            
        },
    }
    const xenditRaw = await fetch(xenditFetchPath, options)
    return await xenditRaw.json()
}



export default async function Page() {
    const {bookingData, pricesData} = await getData()
    
    if (bookingData.message === 'No bookings found'){
        redirect("/booking")
    }

    var xenditData 
    console.log(bookingData)
    
    if (bookingData){
        if (bookingData.data.transactionStatus === 'XENDIT' && bookingData.data.xendit_id !== null){
            xenditData = await getXenditData(bookingData.data.xendit_id)
        }
    }
    
    const calculateItem = (price, count) => {
        return (price * count).toFixed(2)
    }
    const exclutedStatus = ["CANCELLED", "VOIDED", "REFUNDED", "VERIFIED", "CASH_CANCELLED", "REFUND_PENDING"]

    return (
        <>
            
            <div className="p-[30px] w-full space-y-5">
                {/* CTA Buttons */}
                {!exclutedStatus.includes(bookingData.data.transactionStatus) && bookingData.data.status !== 'SCANNED' && (
                    <ActionButtons checkIn={bookingData.data.check_in} bookingType={bookingData.data.booking_type} bookingId={bookingData.data.id} bookingDataStatus={bookingData.data.status}/>
                )}

                {
                    bookingData.data.status === 'SCANNED' && (
                        <>
                            <div className="mb-4">
                                <Alert
                                message="Thank you for booking in our campsite! 🎉🎉🎉"
                                description="Enjoy your stay at Coconut Campsite. Any issues or concerns, please contact the caretaker of the campsite."
                                type="success"
                                showIcon
                                />
                            </div>
                        </>
                    )
                }
                    

                <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10">
                    <div className="flex-auto md:w-[70vw] xl:w-[50vw] space-y-5">
                        <QrCard value={bookingData.data.qr_code_value}/>
                    </div>

                    <div className="w-full flex flex-col space-y-5">
                        {!bookingData.data.is_log_submitted && (
                            <DrawerComponent remainingLogNamesToBeSubmitted={bookingData.data.remaining_log_submissions} bookingId={bookingData.data.id} reservationHolderName={`${bookingData.data.first_name} ${bookingData.data.last_name}`} campersCount={bookingData.data.adult_count + bookingData.data.child_count}/>
                        )}

                        <div className='w-full h-full shadow-xl rounded-xl'>
                            <iframe className="rounded-xl border-2 border-green-700" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13607.431373242382!2d121.18812472764765!3d14.72558446589735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397bda85647cc8f%3A0xbd1a2f816c06b4c6!2sCoconut%20Campsite!5e0!3m2!1sen!2sph!4v1727672350142!5m2!1sen!2sph" width="100%" height="400px" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                        </div>

                        <div className="w-full flex flex-col space-y-5 bg-white shadow-lg p-7 rounded-2xl divide-y-2">
                            <h1 className="uppercase font-bold">Booking details</h1>
                            <div className="flex flex-col pt-2 space-y-3">
                                <div className="flex flex-col items-start">
                                    <div className="text-[#555555]">
                                        Check in
                                    </div>
                                    <div className="bg-yellow-300 px-2 rounded-md">
                                        {dayjs(bookingData.data.check_in).format("MMMM DD, YYYY")}
                                    </div>
                                </div>     
                                <div className="flex flex-col items-start">
                                    <div className="text-[#555555]">
                                        Check out
                                    </div>
                                    <div className="bg-yellow-100 px-2 rounded-md">
                                        {dayjs(bookingData.data.check_out).format("MMMM DD, YYYY")}
                                    </div>
                                </div>     
                                <div>
                                    <div className="text-[#555555]">
                                        Stay duration
                                    </div>
                                    <div className="capitalize">
                                        {bookingData.data.booking_type}
                                    </div>
                                </div>         
                                <div>
                                    <div className="text-[#555555]">
                                        Booking status
                                    </div>
                                    <div className="capitalize">
                                        {bookingData.data.status}
                                    </div>
                                </div>         
                            </div>
                            <div className="grid grid-cols-1 pt-2">
                                <div className="flex flex-row justify-between ">
                                    <div>
                                        Adult x {bookingData.data.adult_count}
                                    </div>
                                    <div>
                                        ₱ {calculateItem(pricesData.data[0].price.toFixed(1), bookingData.data.adult_count)}
                                    </div>
                                </div>
                                { bookingData.data.child_count > 0 && (
                                    <div className="flex flex-row justify-between ">
                                        <div>
                                            Child x {bookingData.data.child_count}
                                        </div>
                                        <div>
                                            ₱ {calculateItem(pricesData.data[1].price.toFixed(1), bookingData.data.child_count)}
                                        </div>
                                    </div>
                                ) }
                                { bookingData.data.tent_pitching_count > 0 && (
                                    <div className="flex flex-row justify-between ">
                                        <div>
                                            Tent pitching x {bookingData.data.tent_pitching_count}
                                        </div>
                                        <div>
                                            ₱ {calculateItem(pricesData.data[3].price.toFixed(2), bookingData.data.tent_pitching_count)}
                                        </div>
                                    </div>
                                ) }
                                { bookingData.data.bonfire_kit_count > 0 && (
                                    <div className="flex flex-row justify-between ">
                                        <div>
                                            Bonfire kit x {bookingData.data.bonfire_kit_count}
                                        </div>
                                        <div>
                                            ₱ {calculateItem(pricesData.data[3].price.toFixed(4), bookingData.data.bonfire_kit_count)}
                                        </div>
                                    </div>
                                ) }
                                { bookingData.data.cabin && (
                                    <div className="flex flex-row justify-between ">
                                        <div>
                                            {bookingData.data.cabin.name}
                                        </div>
                                        <div>
                                            ₱ {bookingData.data.cabin.price}.00
                                        </div>
                                    </div>
                                ) }

            
                            </div>
                            <div className="grid grid-cols-1 pt-2">
                                <div className="flex flex-row justify-between text-slate-500 text-md font-semibold">
                                    <div>
                                        Fee
                                    </div>
                                    <div>
                                        ₱ {Number(bookingData.data.fee).toFixed(2)}
                                    </div>
                                </div>
            
                                <div className="flex flex-row justify-between text-lg font-bold">
                                    <div>
                                        Booking Total
                                    </div>
                                    <div>
                                        ₱ {Number(bookingData.data.price).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow-lg p-7 rounded-2xl space-y-5">
                            <h1 className="uppercase font-bold">Reservation Holder</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                                <div>
                                    <div className="text-[#555555]">
                                        First Name
                                    </div>
                                    <div>
                                        {bookingData.data.first_name}
                                    </div>
                                </div>     
                                <div>
                                    <div className="text-[#555555]">
                                        Last Name
                                    </div>
                                    <div className="capitalize">
                                        {bookingData.data.last_name}
                                    </div>
                                </div>     
                                <div>
                                    <div className="text-[#555555]">
                                        Email
                                    </div>
                                    <div>
                                        {bookingData.data.email}
                                    </div>
                                </div>    
                                <div>
                                    <div className="text-[#555555]">
                                        Contact Number
                                    </div>
                                    <div className="capitalize">
                                        {bookingData.data.tel_number}
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div className="bg-white shadow-lg p-7 rounded-2xl space-y-5">
                            <h1 className="uppercase font-bold">Transaction Details</h1>
                            <div className="grid grid-cols-1 gap-2 w-full">
                                <div>
                                    <div className="text-[#555555]">
                                        Transaction id
                                    </div>
                                    <div>
                                        {bookingData.data.transaction_id}
                                    </div>
                                </div>  
                                <div>
                                    <div className="text-[#555555]">
                                        Payment gateway
                                    </div>
                                    <div>
                                        {bookingData.data.transactionType}
                                    </div>
                                </div>    
                                <div>
                                    <div className="text-[#555555]">
                                        Status
                                    </div>
                                    <div className="capitalize">
                                        {bookingData.data.transactionStatus}
                                    </div>
                                </div>   
                            </div>
                        </div>


                        {bookingData.data.xendit_id && (
                            <div className="bg-white shadow-lg p-7 rounded-2xl space-y-5">
                                <h1 className="uppercase font-bold">Transaction details</h1>
                                <div className="grid grid-cols-1 gap-2 w-full">
                                    <div className="grid grid-cols-1">
                                        <div className="text-[#555555]">
                                            Reference ID
                                        </div>
                                        <div>
                                            {xenditData.reference_id}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="grid grid-cols-1">
                                            <div className="text-[#555555]">
                                                Currency
                                            </div>
                                            <div>
                                                {xenditData.currency}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1">
                                            <div className="text-[#555555]">
                                                Charged Amount
                                            </div>
                                            <div>
                                                P {xenditData.charge_amount}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}