"use client"

import axios from "@/lib/axios"
import Input from "antd/es/input/Input"
import { CloseCircleFilled, CloseSquareFilled, UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react"
import { MdOutlineEmail } from "react-icons/md"
import { Button, DatePicker, InputNumber, Radio, notification, Breadcrumb, Modal, Checkbox, List, Drawer, Space, Image } from "antd"
import 'app/Calendar.css'
import { usePrice } from "@/hooks/prices"
import dayjs from "dayjs"
import TextArea from "antd/es/input/TextArea"
import InputError from "@/components/InputError"
import { useAuth } from "@/hooks/auth"
import { useLaravelBooking } from "@/hooks/booking"
import { useRouter } from 'next/navigation'
import Calendar from "react-calendar"
import { FaHouseChimneyUser } from "react-icons/fa6";


export default function Page() {
    const { user } = useAuth()
    const router = useRouter()
    const { adultPrice, childPrice, tentPitchPrice, bonfireKitPrice, cabinPrice, calcPricePerUnit, cabin, isLoadingCabin } = usePrice()
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
    const [selectedCabin, setSelectedCabin] = useState(undefined)
    const [note, setNote] = useState('')
    const [errors, setErrors] = useState([])
    const [price, setPrice] = useState(0)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);


    const showDrawer = () => {
        setOpenDrawer(true);
    };

    const onClose = () => {
        setOpenDrawer(false);
    };

    const onChange = (e) => {
        setChecked(e.target.checked);
    };

    const onSelectCabin = (cabinData) => {
        setSelectedCabin(cabinData)
        console.log(cabinData)
        setOpenDrawer(false)
    }


    useEffect(() => {
        if (!booking) return
        if (booking.status === "PAID"){
            window.location.href = "/view-booking"
        }
        
        if (booking.transactionStatus === "CASH_PENDING"){
            window.location.href = "/view-booking"
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
            setNote(booking.note)
        } 
        
    }, [booking])

    useEffect(() => {
        if (!isLoadingCabin) {
            console.log(cabin)
        }
    }, [isLoadingCabin])


    const calculateSubPrice = () => {
        const adultTotal = adultPrice * adultCount
        const childTotal = childPrice * childCount
        const tentPitchTotal = tentPitchPrice * tentPitchingCount
        const bonfireKitTotal = bonfireKitPrice * bonfireKitCount

        return (adultTotal + childTotal + tentPitchTotal + bonfireKitTotal).toFixed(2)
    }


    // Display feedback notification
    const [api, contextHolder] = notification.useNotification()
    const openErrorValidationNotification = ({errors}) => {
        api['error']({
          message: 'Something is wrong!',
          placement: 'bottomRight',
          description:
            <>
                {Object.keys(errors).map((key) => (
                    <>
                        {errors[key].map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </>
                ))}
            </>
        })
    }
    const openErrorExistingNotification = () => {
        api['error']({
          message: 'Existing booking detected!',
          placement: 'bottomRight',
          description: "You already have existing booking!"
          
        })
    }
    
    const openSuccessNotification = () => {
        api['success']({
          message: 'You will be redirected shortly!',
          placement: 'bottomRight',
          description:
            "Thank you for booking with us!, You will be redirected to Payment page in a few seconds."
        })
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
            note,
            errors,
            cabin_id: selectedCabin?.id,
            setErrors,
        }
        
        try {
            setErrors([])
            const response = await axios.post('api/' + apiVersion + "/booking", bookingData)
            mutate()
            switch (response.status) {
                case 200:
                    openSuccessNotification()
                    
                    setTimeout(() => {
                        
                        router.push(`/booking/checkout/${response.data.transaction_id}`)
                    }, 300)
                    
                    break
                case 201:
                    openSuccessNotification()
                    setTimeout(() => {
                        router.push('/booking/checkout')
                    }, 300)
                    
                    break
                case 203:
                    openSuccessNotification()
                    setTimeout(() => {
                        router.push('/booking/checkout')
                    }, 300)
                    
                    break
                case 204:
                    openSuccessNotification()
                    setTimeout(() => {
                        router.push('/booking/checkout')
                    }, 300)
                    break
                default:
                    openErrorValidationNotification({errors: "Something went wrong!"})
                    break
            }
        } catch (error) {
            switch (error.response.status) {
                case 400:
                    openErrorExistingNotification()
                    break
                case 404:
                    break
                case 422:
                    openErrorValidationNotification({errors: error.response.data.errors})
                    setErrors(error.response.data.errors)
                    break
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
            note,
            errors,
            setErrors,
        }

        try {
            setErrors([])
            const response = await axios.patch('api/' + apiVersion + "/booking/" + booking.id, bookingData)
            mutate()
            if (response.status === 200 || response.status === 201 || response.status === 203 || response.status === 204){
                openSuccessNotification()
                setTimeout(() => {
                    router.push(`/booking/checkout/${response.data.transaction_id}`)
                }, 2000)
            }

        } catch (error) {
            switch (error.response?.status) {
                case 400:
                    openErrorExistingNotification()
                    break
                case 422:
                    openErrorValidationNotification({errors: error.response.data.errors})
                    setErrors(error.response.data.errors)
                    break
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
    ]

    const cabinOption = [
        {
          label: 'No',
          value: false,
        },
        {
          label: 'Yes',
          value: true,
        },
    ]

 

    return (
        <>
            {contextHolder}
            <div>
                <header className="bg-[#986B41] shadow">
                    <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">

                        <h2 className="font-semibold text-xl text-[#000000] leading-tight">
                        <Breadcrumb
                            items={[
                            {
                                title: <a href="/" className="!text-[#dddddd]">Home</a>,
                            },
                            {
                                title: <span className="text-[#98F7F0] cursor-pointer">Booking</span>,
                            },
                            {
                                title: <a href="/booking" className="!text-[#dddddd]">Checkout</a>,
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

                    
                    {/* Booking date */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full border-b-2 border-slate-400 md:border-slate-300 pb-10">
                        <div className="1/4">
                            <span className="font-semibold">When would you like to make the reservation?</span>
                        </div>
                        <div className="basis-1/2 grid grid-cols-1 gap-5 w-full">
                            {/* Booking type field */}
                            <div className="space-y-2">
                                <div className="space-x-4">
                                    <label htmlFor="bookingType">Booking type <span className="text-red-600 text-lg">*</span></label>
                                    {/* <span className="text-[#555555]">Price ₱ {isCabin ? cabinPrice : "0.00"}</span> */}
                                </div>
                                <Radio.Group value={bookingType} onChange={event => setBookingType(event.target.value)} block options={bookingTypeOption} defaultValue="daytour" optionType="button" buttonStyle="solid" size="large" id="bookingType" />
                                <InputError messages={errors.bookingType} className="mt-2" />

                            </div>
                            {/* Check in field */}
                            <div className="space-y-2 w-full">
                                <label htmlFor="checkInDate">Check in <span className="text-red-600 text-lg">*</span></label>
                                <Calendar 
                                    minDate={new Date(dayjs().add(2, 'day').format('YYYY-MM-DD'))} 
                                    maxDate={new Date('2025-02-28')}
                                    onChange={date => setCheckInDate(date)} 
        
                                    
                                    value={checkInDate} />

                                {/* <DatePicker className="w-full h-[50px] text-[#3D736C] font-bold"
                                    id="checkInDate"
                                    minDate={dayjs().add(2, 'day')}
                                    value={checkInDate}
                                    size="large"
                                    onChange={date => setCheckInDate(date)}
                                    maxDate={dayjs().add(3, 'month')}
                                    format="MMMM DD, YYYY"
                                    // disabledDate={disabledDate}
                                    // disabledTime={disabledDateTime}
                                /> */}
                                <InputError messages={errors.checkInDate} className="mt-2" />
                            </div>

                        </div>
                    </div>
                    {/* Reservation holder details */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full border-b-2 border-slate-400 md:border-slate-300 pb-10">
                        <div className="1/4">
                            <span className="font-semibold">Reservation holder details</span>
                        </div>
                        <div className="basis-1/2 grid xl:grid-cols-2 gap-5 w-full">
                            {/* First name field */}
                            <div className="space-y-2">
                                <label htmlFor="first_name">First name <span className="text-red-600 text-lg">*</span></label>
                                <Input size="large" value={first_name} onChange={event=>setFirstName(event.target.value)} prefix={<UserOutlined/>} id="first_name" placeholder="Enter your first name"/>
                                <InputError messages={errors.first_name} className="mt-2" />
                            </div>
                            {/* Last name field */}
                            <div className="space-y-2">
                                <label htmlFor="last_name">Last name <span className="text-red-600 text-lg">*</span></label>
                                <Input size="large" value={last_name} onChange={event=>setLastName(event.target.value)} prefix={<UserOutlined/>} id="last_name" placeholder="Enter your Last name"/>
                                <InputError messages={errors.last_name} className="mt-2" />
                            </div>
                            {/* Email field */}
                            <div className="space-y-2">
                                <label htmlFor="email">Email <span className="text-red-600 text-lg">*</span></label>
                                <Input size="large" value={email} onChange={event=>setEmail(event.target.value)} prefix={<MdOutlineEmail/>} id="email" placeholder="Enter your first name"/>
                                <InputError messages={errors.email} className="mt-2" />
                            </div>
                            {/* Tel num field */}
                            <div className="space-y-2">
                                <label htmlFor="telNumber">Telephone number <span className="text-red-600 text-lg">*</span> <span className="text-slate-400">(ex: 9921234567)</span></label>
                                <Input size="large" value={telNumber} onChange={event=>setTelNumber(event.target.value)} addonBefore="+63" id="telNumber" placeholder="9921234567"/>
                                <InputError messages={errors.telNumber} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* PAX Counts */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full border-b-2 border-slate-400 md:border-slate-300 pb-10">
                        <div className="1/4">
                            <span className="font-semibold">How many persons you booking for?</span>
                        </div>
                        <div className="basis-1/2 grid grid-cols-1 gap-5">
                            {/* Adult count field */}
                            <div className="space-y-2">
                                <label htmlFor="adultCount">Adult <span className="text-red-600 text-lg">*</span> ( ₱ {adultPrice} )</label>
                                <div className="space-x-5">
                                    <InputNumber min={1} size="large" prefix={<UserOutlined/>} value={adultCount} onChange={event => setAdultCount(event)} id="adultCount" className="w-64"/>
                                    <span className="text-[#555555]">Price ₱ {calcPricePerUnit(adultPrice, adultCount)}</span>
                                </div>
                                <InputError messages={errors.adultCount} className="mt-2" />

                            </div>
                            <div className="space-y-2">
                                <label htmlFor="childCount">Child ( ₱ {childPrice} )</label>
                                <div className="space-x-5">
                                    <InputNumber min={0} size="large" prefix={<UserOutlined/>} value={childCount} onChange={event => setChildCount(event)} id="childCount" className="w-64"/>
                                    <span className="text-[#555555]">Price ₱ {calcPricePerUnit(childPrice, childCount)}</span>
                                </div>
                                <InputError messages={errors.childCount} className="mt-2" />

                            </div>
        

                        </div>
                    </div>

                    {/* Camping setup */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full border-b-2 border-slate-400 md:border-slate-300 pb-10">
                        <div className="1/4">
                            <span className="font-semibold">Camping setup</span>
                        </div>
                        <div className="basis-1/2 grid grid-cols-1 gap-5 w-full">
                            {/* Tent pitching count field */}
                            <div className="space-y-2">
                                <label htmlFor="tentPitching">Tent pitching ( ₱ {tentPitchPrice} )</label>
                                <div className="space-x-5">
                                    <InputNumber min={0} size="large" prefix={<UserOutlined/>} value={tentPitchingCount} onChange={event => setTentPitchingCount(event)} id="tentPitching" className="w-64"/>
                                
                                    <span className="text-[#555555]">Price ₱ {calcPricePerUnit(tentPitchPrice, tentPitchingCount)}</span>
                                </div>
                                <InputError messages={errors.tentPitching} className="mt-2" />

                            </div>
                            {/* Bonfire count field */}

                            <div className="space-y-2">
                                <label htmlFor="bonfireKit">Bonfire Kit ( ₱ {bonfireKitPrice} )</label>
                                <div className="space-x-5">
                                    <InputNumber min={0} size="large" prefix={<UserOutlined/>} value={bonfireKitCount} onChange={event => setBonfireKitCount(event)} id="bonfireKit" className="w-64"/>
                                    <span className="text-[#555555]">Price ₱ {calcPricePerUnit(bonfireKitPrice, bonfireKitCount)}</span>
                                </div>
                                <InputError messages={errors.bonfireKit} className="mt-2" />

                            </div>
                        </div>
                    </div>

                    {/* Cabin */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-start w-full border-b-2 border-slate-400 md:border-slate-300 pb-10">
                        <div className="1/4">
                            <span className="font-semibold">Cabin</span>
                        </div>
                        <div className="basis-1/2 grid grid-cols-1 gap-5 w-full">        
                            {selectedCabin !== undefined ? (
                                <>
                                    <div className="w-full min-h-[300px] relative rounded-xl overflow-hidden">
                                        <div className="absolute top-0 left-0 z-20 text-white px-10 w-full h-full flex flex-col items-center justify-center text-center">
                                            <div className="absolute top-0 right-0 w-full flex flex-row justify-between items-center p-5">
                                                <div className="flex flex-row items-center gap-2">
                                                    <div className="flex flex-row items-center gap-2">
                                                        <FaHouseChimneyUser className="text-2xl font-bold"/>
                                                        <span>{selectedCabin.capacity}</span>
                                                    </div>
                                                    |
                                                    <p className="text-md md:text-lg font-semibold text-green-500 flex flex-row items-center gap-2">₱ {selectedCabin.price}</p>
                                                </div>
                                                <CloseSquareFilled onClick={() => setSelectedCabin(undefined)} className="select-none   text-4xl text-red-500 cursor-pointer hover:scale-125 active:scale-105 ease-in-out duration-200 transition-all"/>
                                            </div>
                                            <h3 className="text-lg md:text-3xl font-bold mt-6">{selectedCabin.name}</h3>
                                            {/* <p className="text-lg mt-2">{selectedCabin.description}</p> */}
                                            <p className="text-md md:text-lg mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo repudiandae sapiente vitae cupiditate odit blanditiis suscipit vero officiis sed fugit?</p>
                                        </div>
                                        <div className="w-full h-full text-white z-10 absolute top-0 left-0 bg-black opacity-60"/>
                                        <img src={selectedCabin.image} alt={selectedCabin.name} className="w-full h-full object-cover object-center absolute top-0 left-0"/>

                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full h-[300px]">
                                        <div className="w-full h-full flex flex-row justify-between gap-5 md:gap-10">
                                            <div onClick={() => showDrawer()} className="select-none cursor-pointer w-full h-full rounded-xl flex flex-col items-center justify-center border-2 border-dashed outline-offset-4 border-indigo-400 bg-indigo-100 hover:bg-slate-400 active:bg-slate-300 transition-all ease-in-out duration-300 text-slate-500">
                                                Choose cabin
                                            </div>
                                        </div>
        
                                    </div>
                                </>
                            )}
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
                                        className="bg-yellow-100"
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
                    <div className="flex flex-col items-center space-y-3">
                        <div className="flex flex-row items-center">
                            <Checkbox onChange={onChange}>
                                <p className="text-[#555555] select-none text-lg">I agree to your</p>
                            </Checkbox>
                            <span className="text-[#3D736C] cursor-pointer text-md" onClick={() => setOpen(true)}>Terms of Service</span>
                        </div>
                        <div className="w-full lg:w-[60vw] h-[70px] flex flex-col">
                            <Button type="primary" className="h-full" onClick={submitForm} loading={buttonLoading} disabled={!checked}>Submit</Button>
                        </div>
                    </div>

                </div>
            </div>
            <Modal
                title="Terms of Service"
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
                top={0}
                className="top-5"
                cancelText="Close"
                okText="I understand"
                rootClassName="text-center"
            
            >
                <p className="m-5 h-[70vh] overflow-scroll text-2xl overflow-x-hidden mt-12">
                    <List className="space-y-2 text-xl lg:mx-5 text-left" size="large" split={false}>
                        <List.Item>
                            These Consumer Terms of Service (“Terms of Service” or “Terms”) are a legal agreement between us (“us”, “our”, “we”, or “Xendit”) and you, the individual who uses our booking services for personal use under these Terms (referred to as “you” or “your”). The following Terms constitute a legally binding agreement between you and us and describe the terms and conditions applicable to your use of our Consumer Services. By using our Consumer Services, you agree to be bound by these Terms.
                        </List.Item>
                        <List.Item className="flex flex-col !items-start">
                            <h1 className="font-semibold">E-wallet Refund</h1>
                            <List.Item>
                                1. You acknowledge that you may request a full refund if the request is submitted before the Xendit cutoff time (23:50) on the same day the transaction is made.
                            </List.Item>
                            <List.Item>
                                2. You acknowledge that if a refund request is submitted more than one day after completing the transaction, a 5% service fee will be deducted to cover transaction costs.
                            </List.Item>
                            <List.Item>
                                3. Refunds for transactions processed through the payment gateway are available; however, if you completed the stay and later request a refund, we reserve the right to approve or decline the request based on the circumstances and reason provided.
                            </List.Item>
                        </List.Item>
                        <List.Item className="flex flex-col !items-start">
                            <h1 className="font-semibold">Reschedule</h1>
                            <List.Item>
                                4. You may reschedule your reservation independently through this website up until the check-in day of the reservation.
                            </List.Item>
                        </List.Item>
                        <List.Item className="flex flex-col !items-start">
                            <h1 className="font-semibold">Email and Phone Communication</h1>
                            <List.Item>
                                5. By providing us with a phone number, you consent to receiving text (SMS) messages, emails, and phone calls from us. Such communications may include, but are not limited to, booking reminders, reservation updates, and inquiries. 
                            </List.Item>
                        </List.Item>
                    </List>
                </p>
            
            </Modal>
            <Drawer
                title="Select your cabin"
                placement='bottom'
                width={500}
                height={600}
                onClose={onClose}
                open={openDrawer}
            >
                {!isLoadingCabin && cabin.length === 0 && (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <h1 className="text-2xl font-bold">No cabin available</h1>
                        <p className="text-[#555555]">There are no cabins available for booking at the moment</p>
                    </div>
                )}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">

                    {cabin.map((cabin, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2 bg-[#f7b393ed] border-2 rounded-xl overflow-hidden">
                            <div className="relative w-full h-full">
                                <div className="border-l-4 border-green-400 select-none text-black font-bold text-lg m-4 pl-3 z-10 absolute bottom-0 left-0">Press to view</div>
                                <Image src={cabin.image} alt={cabin.name} width="100%" height={250} className="object-cover object-center absolute top-0 left-0" scal unoptimized={true}/>

                            </div>
                            <div className="px-7 pb-7 w-full flex flex-col items-center justify-center">
                                <div className="flex flex-row items-start justify-between w-full">
                                    <h3 className="text-3xl font-bold text-black">{cabin.name}</h3>
                                    <p className="text-green-600 font-bold text-3xl">₱ {cabin.price}</p>
                                </div>
                                <p className="text-[#555454] w-full text-xl font-semibold">Max PAX: {cabin.capacity}</p>
                                <div className="flex flex-col w-full mt-4">
                                    <p className="text-black w-full text-lg p-3 bg-yellow-100 border-r-8 border-yellow-600 ">{cabin.description}</p>
                                </div>
                                <Button type="primary" onClick={() => onSelectCabin(cabin)} className="w-full py-6 mt-8">Select</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Drawer>
        </>
    )
}