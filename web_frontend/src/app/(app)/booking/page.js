"use client"

import axios from "@/lib/axios";
import Input from "antd/es/input/Input";
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { Button, DatePicker, InputNumber, Radio, notification, Space, Breadcrumb, message } from "antd";

import { usePrice } from "@/hooks/prices";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import InputError from "@/components/InputError";
import { useAuth } from "@/hooks/auth";
import { useLaravelBooking } from "@/hooks/booking";
import { useRouter } from 'next/navigation';



export default function Page() {
    const { user } = useAuth()
    const router = useRouter()
    const { adultPrice, childPrice, tentPitchPrice, bonfireKitPrice, cabinPrice, calcPricePerUnit } = usePrice()
    const {
        booking,
        apiVersion,
        error,
        mutate,
    } = useLaravelBooking({routeLink: '/api/v1/booking-check'})
    const [first_name, setFirstName] = useState(user.first_name)
    const [last_name, setLastName] = useState(user.last_name)
    const [email, setEmail] = useState(user.email)
    const [telNumber, setTelNumber] = useState('')
    const [adultCount, setAdultCount] = useState(1)
    const [childCount, setChildCount] = useState(0)
    const [checkInDate, setCheckInDate] = useState('') 
    const [bookingType, setBookingType] = useState('daytour')
    const [tentPitchingCount, setTentPitchingCount] = useState(0)
    const [bonfireKitCount, setBonfireKitCount] = useState(0)
    const [isCabin, setIsCabin] = useState(false)
    const [note, setNote] = useState('')
    const [errors, setErrors] = useState([])
    const [price, setPrice] = useState(0)
    const [buttonLoading, setButtonLoading] = useState(false)

    useEffect(() => {
        if (!booking) return;
        if (booking.status === "PAID"){
            router.push('/view-booking')
        }
        
        if (booking.transactionStatus === "CASH_PENDING"){
            router.push('/view-booking')
        }

        if (booking.status === "PENDING"){
            setFirstName(booking.first_name)
            setLastName(booking.last_name)
            setEmail(booking.email)
            setTelNumber(booking.tel_number)
            setAdultCount(booking.adult_count)
            setChildCount(booking.child_count)
            setCheckInDate(dayjs(booking.check_in))
            setBookingType(booking.booking_type)
            setTentPitchingCount(booking.tent_pitching_count)
            setBonfireKitCount(booking.bonfire_kit_count)
            setIsCabin(booking.is_cabin)
            setNote(booking.note)
        } 
        
    }, [booking])


    const calculateSubPrice = () => {
        const adultTotal = adultPrice * adultCount
        const childTotal = childPrice * childCount
        const tentPitchTotal = tentPitchPrice * tentPitchingCount
        const bonfireKitTotal = bonfireKitPrice * bonfireKitCount
        var cabinTotal = 0
        
        if (isCabin === true) {
            cabinTotal = cabinPrice
        }
        return (adultTotal + childTotal + tentPitchTotal + bonfireKitTotal + cabinTotal).toFixed(2)
    }


    // Display feedback notification
    const [api, contextHolder] = notification.useNotification();
    const openErrorValidationNotification = ({errors}) => {
        api['error']({
          message: 'Something is wrong!',
          placement: 'bottomRight',
          description:
            <>
                {Object.keys(errors).map((key) => (
                    <>
                        {errors[key].map((error) => (
                            <p>{error}</p>
                        ))}
                    </>
                ))}
            </>
        });
    }
    const openErrorExistingNotification = () => {
        api['error']({
          message: 'Existing booking detected!',
          placement: 'bottomRight',
          description: "You already have existing booking!"
          
        });
    }
    
    const openSuccessNotification = () => {
        api['success']({
          message: 'You will be redirected shortly!',
          placement: 'bottomRight',
          description:
            "Thank you for booking with us!, You will be redirected to Payment page in a few seconds."
        });
    }

    const createBooking = async () => {
        setButtonLoading(true)
        setPrice(calculateSubPrice())
        const bookingData = {
            first_name,
            last_name,
            email,
            price,
            telNumber,
            adultCount,
            childCount,
            checkInDate,
            bookingType,
            tentPitchingCount,
            bonfireKitCount,
            isCabin,
            note,
            errors,
            setErrors,
        }
        
        try {
            setErrors([])
            const response = await axios.post('api/' + apiVersion + "/booking", bookingData)
            mutate();
            switch (response.status) {
                case 200:
                    openSuccessNotification()
                    
                    setTimeout(() => {
                        
                        router.push(`/booking/checkout/${response.data.transaction_id}`)
                    }, 300)
                    
                    break;
                case 201:
                    openSuccessNotification()
                    setTimeout(() => {
                        router.push('/booking/checkout')
                    }, 300)
                    
                    break;
                case 203:
                    openSuccessNotification()
                    setTimeout(() => {
                        router.push('/booking/checkout')
                    }, 300)
                    
                    break;
                case 204:
                    openSuccessNotification()
                    setTimeout(() => {
                        router.push('/booking/checkout')
                    }, 300)
                    break;
                default:
                    openErrorValidationNotification({errors: "Something went wrong!"})
                    break;
            }
        } catch (error) {
            switch (error.response.status) {
                case 400:
                    openErrorExistingNotification()
                    break;
                case 404:
                    break;
                case 422:
                    openErrorValidationNotification({errors: error.response.data.errors})
                    setErrors(error.response.data.errors)
                    break;
                default:
                    throw error
            }
            setButtonLoading(false)

        }

        

    }

    const editBooking = async () => {
        const bookingData = {
            first_name,
            last_name,
            user_id: user?.id,
            email,
            telNumber,
            adultCount,
            childCount,
            checkInDate,
            bookingType,
            tentPitchingCount,
            bonfireKitCount,
            isCabin,
            note,
            errors,
            setErrors,
        }

        try {
            setErrors([])
            const response = await axios.patch('api/' + apiVersion + "/booking/" + booking.id, bookingData)
            mutate();
            if (response.status === 200 || response.status === 201 || response.status === 203 || response.status === 204){
                openSuccessNotification()
                setTimeout(() => {
                    router.push(`/booking/checkout/${response.data.transaction_id}`)
                }, 2000)
            }

        } catch (error) {
            console.log(error)
            switch (error.response?.status) {
                case 400:
                    openErrorExistingNotification()
                    break;
                case 422:
                    openErrorValidationNotification({errors: error.response.data.errors})
                    setErrors(error.response.data.errors)
                    break;
                default:
                    throw error
            }
        }


    }



    const submitForm = event => {
        event.preventDefault()
        if (error) {
            createBooking()
            
        } else{
            editBooking()
        }
        
    }

    const bookingTypeOption = [
        {
          label: 'Day tour',
          value: "daytour",
        },
        {
          label: 'Overnight',
          value: "overnight",
        },
    ];

    const cabinOption = [
        {
          label: 'No',
          value: false,
        },
        {
          label: 'Yes',
          value: true,
        },
    ];

 

    return (
        <>
            {contextHolder}
            <div>
                <header className="bg-white shadow">
                    <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">

                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        <Breadcrumb
                            items={[
                            {
                                title: <a href="/" className="text-slate-400">Home</a>,
                            },
                            {
                                title: <span className="text-black cursor-pointer">Booking</span>,
                            },
                            {
                                title: <a href="/booking" className="text-slate-400">Checkout</a>,
                            }
                            ]}
                        />
                        </h2>
                    </div>
                </header>
                <div className="m-[30px] my-[60px] space-y-14">
                    <div className="space-y-1">
                        <h2 className="font-bold">Campsite Booking Confirmation</h2>
                        <p className="text-[#555555]">Thank you for choosing Coconut Campsite for your forthcoming visit to Wawa Dam. It is our pleasure to confirm your reservation!</p>
                    </div>

                    {/* Reservation holder details */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full">
                        <div className="1/4">
                            <span className="font-semibold">Reservation holder details</span>
                        </div>
                        <div className="basis-1/2 grid grid-cols-2 gap-5">
                            {/* First name field */}
                            <div className="space-y-2">
                                <label htmlFor="first_name">First name</label>
                                <Input size="large" value={first_name} onChange={event=>setFirstName(event.target.value)} prefix={<UserOutlined/>} id="first_name" placeholder="Enter your first name"/>
                                <InputError messages={errors.first_name} className="mt-2" />
                            </div>
                            {/* Last name field */}
                            <div className="space-y-2">
                                <label htmlFor="last_name">Last name</label>
                                <Input size="large" value={last_name} onChange={event=>setLastName(event.target.value)} prefix={<UserOutlined/>} id="last_name" placeholder="Enter your Last name"/>
                                <InputError messages={errors.last_name} className="mt-2" />
                            </div>
                            {/* Email field */}
                            <div className="space-y-2">
                                <label htmlFor="email">Email</label>
                                <Input size="large" value={email} onChange={event=>setEmail(event.target.value)} prefix={<MdOutlineEmail/>} id="email" placeholder="Enter your first name"/>
                                <InputError messages={errors.email} className="mt-2" />
                            </div>
                            {/* Tel num field */}
                            <div className="space-y-2">
                                <label htmlFor="telNumber">Telephone number</label>
                                <Input size="large" value={telNumber} onChange={event=>setTelNumber(event.target.value)} addonBefore="+63" id="telNumber" placeholder="992 5606 298"/>
                                <InputError messages={errors.telNumber} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Booking date */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full">
                        <div className="1/4">
                            <span className="font-semibold">When would you like to make the reservation?</span>
                        </div>
                        <div className="basis-1/2 grid grid-cols-1 gap-5">
                            {/* Check in field */}
                            <div className="space-y-2">
                                <label htmlFor="checkInDate">Check in</label>
                                <DatePicker className="w-full"
                                    id="checkInDate"
                                    minDate={dayjs()}
                                    value={checkInDate}
                                    onChange={date => setCheckInDate(date)}
                                    maxDate={dayjs().add(3, 'month')}
                                    format="MMMM DD, YYYY"
                                    // disabledDate={disabledDate}
                                    // disabledTime={disabledDateTime}
                                />
                                <InputError messages={errors.checkInDate} className="mt-2" />
                            </div>
                            {/* Booking type field */}
                            <div className="space-y-2">
                                <div className="space-x-4">
                                    <label htmlFor="bookingType">Booking type</label>
                                    {/* <span className="text-[#555555]">Price ₱ {isCabin ? cabinPrice : "0.00"}</span> */}
                                </div>
                                <Radio.Group value={bookingType} onChange={event => setBookingType(event.target.value)} block options={bookingTypeOption} defaultValue="daytour" optionType="button" buttonStyle="solid" size="large" id="bookingType" />
                                <InputError messages={errors.bookingType} className="mt-2" />

                            </div>
                        </div>
                    </div>

                    {/* PAX Counts */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full">
                        <div className="1/4">
                            <span className="font-semibold">How many persons you booking for?</span>
                        </div>
                        <div className="basis-1/2 grid grid-cols-1 gap-5">
                            {/* Adult count field */}
                            <div className="space-y-2">
                                <label htmlFor="adultCount">Adult</label>
                                <div className="space-x-5">
                                    <InputNumber min={1} size="large" prefix={<UserOutlined/>} value={adultCount} onChange={event => setAdultCount(event)} id="adultCount" className="w-64"/>
                                    <span className="text-[#555555]">Price ₱ {calcPricePerUnit(adultPrice, adultCount)}</span>
                                </div>
                                <InputError messages={errors.adultCount} className="mt-2" />

                            </div>
                            <div className="space-y-2">
                                <label htmlFor="childCount">Child</label>
                                <div className="space-x-5">
                                    <InputNumber min={0} size="large" prefix={<UserOutlined/>} value={childCount} onChange={event => setChildCount(event)} id="childCount" className="w-64"/>
                                    <span className="text-[#555555]">Price ₱ {calcPricePerUnit(childPrice, childCount)}</span>
                                </div>
                                <InputError messages={errors.childCount} className="mt-2" />

                            </div>
        

                        </div>
                    </div>

                    {/* Camping setup */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full">
                        <div className="1/4">
                            <span className="font-semibold">Camping setup</span>
                        </div>
                        <div className="basis-1/2 grid grid-cols-1 gap-5">
                            {/* Tent pitching count field */}
                            <div className="space-y-2">
                                <label htmlFor="tentPitching">Tent pitching</label>
                                <div className="space-x-5">
                                    <InputNumber min={0} size="large" prefix={<UserOutlined/>} value={tentPitchingCount} onChange={event => setTentPitchingCount(event)} id="tentPitching" className="w-64"/>
                                
                                    <span className="text-[#555555]">Price ₱ {calcPricePerUnit(tentPitchPrice, tentPitchingCount)}</span>
                                </div>
                                <InputError messages={errors.tentPitching} className="mt-2" />

                            </div>
                            {/* Bonfire count field */}

                            <div className="space-y-2">
                                <label htmlFor="bonfireKit">Bonfire Kit</label>
                                <div className="space-x-5">
                                    <InputNumber min={0} size="large" prefix={<UserOutlined/>} value={bonfireKitCount} onChange={event => setBonfireKitCount(event)} id="bonfireKit" className="w-64"/>
                                    <span className="text-[#555555]">Price ₱ {calcPricePerUnit(bonfireKitPrice, bonfireKitCount)}</span>
                                </div>
                                <InputError messages={errors.bonfireKit} className="mt-2" />

                            </div>
                            {/* Cabin radio field */}
                            <div className="space-y-2">
                                <div className="space-x-4">
                                    <label htmlFor="bonfireKit">Cabin (4-5 pax)</label>
                                    <span className="text-[#555555]">Price ₱ {isCabin ? cabinPrice.toFixed(2) : "0.00"}</span>
                                </div>
                                <Radio.Group value={isCabin} onChange={event => setIsCabin(event.target.value)} block options={cabinOption} defaultValue={false} optionType="button" buttonStyle="solid" size="large" />
                            </div>
                            <InputError messages={errors.isCabin} className="mt-2" />

        

                        </div>
                    </div>

                    {/* Note */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full">
                        <div className="1/4">
                            <span className="font-semibold">Notes</span>
                        </div>
                        <div className="w-full basis-1/2 grid grid-cols-1 gap-5">
                            {/* Note field */}
                            <div className="space-y-2">
                                <div className="space-x-5">
                                    <TextArea
                                        showCount
                                        maxLength={100}
                                        value={note}
                                        onChange={event => setNote(event.target.value)}
                                        placeholder="Write your notes here"
                                        style={{
                                        height: 120,
                                        resize: 'none',
                                        }}
                                    />     
                                </div>
                                <InputError messages={errors.note} className="mt-2" />

                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col">
                        <Button type="primary" className="py-6" onClick={submitForm} loading={buttonLoading}>Submit</Button>

                    </div>

                </div>
            </div>
        </>
    );
}