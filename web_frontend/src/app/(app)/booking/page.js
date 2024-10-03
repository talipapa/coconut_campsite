"use client"

import Header from "../Header";
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
import axios from "@/lib/axios";
import { Router } from "next/router";
import { permanentRedirect } from "next/navigation";
import Loading from "../Loading";
import { redirect } from 'next/navigation'



export default function Page() {
    const { user } = useAuth()
    const { adultPrice, childPrice, tentPitchPrice, bonfireKitPrice, cabinPrice, calcPricePerUnit } = usePrice()
    const {
        booking,
        first_name, 
        setFirstName, 
        last_name,
        setLastName,
        email,
        setEmail,
        telNumber,
        setTelNumber,
        adultCount,
        setAdultCount,
        childCount,
        setChildCount,
        checkInDate,
        setCheckInDate,
        bookingType,
        setBookingType,
        tentPitchingCount,
        setTentPitchingCount,
        bonfireKitCount,
        setBonfireKitCount,
        isCabin,
        setIsCabin,
        note,
        setNote,
        createBooking,
        editBooking,
        errors,
        contextHolder
    } = useLaravelBooking()


    useEffect(() => {
        if (booking?.message === true && booking?.data.status === "PAID"){
            redirect('/account')
        }
        if (booking?.message === true && booking?.data.transactionStatus === "CASH_PENDING"){
            redirect('/account')
        }
    }, [booking])





    const submitForm = event => {
        event.preventDefault()
        if (booking['message'] === false) {
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
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        <Breadcrumb
                            items={[
                            {
                                title: <a href="/">Home</a>,
                            },
                            {
                                title: "Booking",
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
                        <Button type="primary" className="py-6" onClick={submitForm}>Submit</Button>

                    </div>

                </div>
            </div>
        </>
    );
}