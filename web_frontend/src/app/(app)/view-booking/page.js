import { cookies } from "next/headers";
import QrCard from "./QrCard";
import { Button } from "antd";



const getData = async () => {
    // MAKE SURE REFERER IS PROPERLY SET IN HEADERS OR YOU WILL BE LIKE ME DEBUGGING THIS FOR HALF A DAY
    let bookingFetchPath = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/booking"
    let priceFetchPath = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/price"
    
    await fetch("http://localhost:8000/sanctum/csrf-cookie")
    
    const options = {
        method: "GET",
        credentials: "include",
        headers: {
            'Accept' : "application/json",
            'Referer' : process.env.APP_URL,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Cookie: "XSRF-TOKEN=" + cookies().get('XSRF-TOKEN').value + ";laravel_session="+cookies().get('laravel_session').value,
            Authorization: "Bearer " + cookies().get('XSRF-TOKEN').value
            
        },
    }
    
    const bookingRaw = await fetch(bookingFetchPath, options);
    const pricesRaw = await fetch(priceFetchPath, options);
    
    return {
        bookingData: await bookingRaw.json(),
        pricesData: await pricesRaw.json()
    }
}

const getXenditData = async (xenditId) => {
    let xenditFetchPath = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/v1/xendit/${xenditId}`
    await fetch("http://localhost:8000/sanctum/csrf-cookie")
    
    const options = {
        method: "GET",
        credentials: "include",
        headers: {
            'Accept' : "application/json",
            'Referer' : process.env.APP_URL,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Cookie: "XSRF-TOKEN=" + cookies().get('XSRF-TOKEN').value + ";laravel_session="+cookies().get('laravel_session').value,
            Authorization: "Bearer " + cookies().get('XSRF-TOKEN').value
            
        },
    }
    const xenditRaw = await fetch(xenditFetchPath, options);
    return await xenditRaw.json()
}


export default async function Page() {
    const {bookingData, pricesData} = await getData();
    const xenditData = await getXenditData(bookingData.data.xendit_id)
    // console.log(xenditData)
    // console.log(pricesData.data[1].price)

    const calculateItem = (price, count) => {
        return (price * count).toFixed(2)
    }


    const adultTotal = calculateItem(pricesData.data[0].price.toFixed(1), bookingData.data.adult_count)
    const childTotal = calculateItem(pricesData.data[1].price.toFixed(1), bookingData.data.child_count)
    const tentPitchingTotal = calculateItem(pricesData.data[3].price.toFixed(2), bookingData.data.tent_pitching_count)
    const bonfireKitTotal = calculateItem(pricesData.data[3].price.toFixed(4), bookingData.data.bonfire_kit_count)
    const cabinTotal = pricesData.data[4].price.toFixed(2)


    return (
        <div className="p-[30px] w-full space-y-5">
            {/* CTA Buttons */}
            <div className="space-x-4">
                <Button color="primary" variant="solid"><a href="https://www.facebook.com/profile.php?id=61558384738390" target="_blank">Contact Campsite</a></Button>
                <Button color="default" variant="outlined">
                    Reschedule booking
                </Button>
                <Button color="danger" variant="outlined">Refund</Button>
            </div>
            <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10">
                <div className="flex-auto md:w-[70vw] xl:w-[50vw] space-y-5">
                    <QrCard id={bookingData.data.id}/>
                    <div className="w-full flex flex-col space-y-5 bg-white shadow-lg p-7 rounded-2xl divide-y-2">
                        <h1 className="uppercase font-bold">Booking details</h1>
                        <div className="flex flex-row justify-between pt-2">
                            <div>
                                <div className="text-[#555555]">
                                    Check in
                                </div>
                                <div>
                                    {bookingData.data.check_in}
                                </div>
                            </div>     
                            <div>
                                <div className="text-[#555555]">
                                    Booking type
                                </div>
                                <div className="capitalize text-end">
                                    {bookingData.data.booking_type}
                                </div>
                            </div>         
                        </div>
                        <div className="grid grid-cols-1 pt-2">
                            <div className="flex flex-row justify-between ">
                                <div>
                                    Adult x {bookingData.data.adult_count}
                                </div>
                                <div>
                                    P {calculateItem(pricesData.data[0].price.toFixed(1), bookingData.data.adult_count)}
                                </div>
                            </div>
                            { bookingData.data.child_count > 0 && (
                                <div className="flex flex-row justify-between ">
                                    <div>
                                        Child x {bookingData.data.child_count}
                                    </div>
                                    <div>
                                        P {calculateItem(pricesData.data[1].price.toFixed(1), bookingData.data.child_count)}
                                    </div>
                                </div>
                            ) }
                            { bookingData.data.tent_pitching_count > 0 && (
                                <div className="flex flex-row justify-between ">
                                    <div>
                                        Tent pitching x {bookingData.data.tent_pitching_count}
                                    </div>
                                    <div>
                                        P {calculateItem(pricesData.data[3].price.toFixed(2), bookingData.data.tent_pitching_count)}
                                    </div>
                                </div>
                            ) }
                            { bookingData.data.bonfire_kit_count > 0 && (
                                <div className="flex flex-row justify-between ">
                                    <div>
                                        Bonfire kit x {bookingData.data.bonfire_kit_count}
                                    </div>
                                    <div>
                                        P {calculateItem(pricesData.data[3].price.toFixed(4), bookingData.data.bonfire_kit_count)}
                                    </div>
                                </div>
                            ) }
                            { bookingData.data.is_cabin && (
                                <div className="flex flex-row justify-between ">
                                    <div>
                                        Cabin (4-5 Person)
                                    </div>
                                    <div>
                                        P {pricesData.data[4].price.toFixed(2)}
                                    </div>
                                </div>
                            ) }

        
                        </div>
                    </div>

                </div>
                <div className="w-full flex flex-col space-y-5">
                    <div className="bg-white shadow-lg p-7 rounded-2xl space-y-5">
                        <h1 className="uppercase font-bold">Reservation Holder</h1>
                        <div className="grid grid-cols-2 gap-2 w-full">
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
                </div>
            </div>
        </div>
    );
}