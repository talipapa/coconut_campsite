'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLaravelBooking } from './booking'

export const usePrice = () => {

    const { booking } = useLaravelBooking()

    const [adultPrice, setAdultPrice] = useState(100.00)
    const [childPrice, setChildPrice] = useState(50.00)
    const [tentPitchPrice, setTentPitchPrice] = useState(70.00)
    const [bonfireKitPrice, setBonfireKitPrice] = useState(150.00)
    const [cabinPrice, setCabinPrice] = useState(650.00)

    const [eWalletFee, setEWalletFee] = useState({
        "PH_GCASH" : 0.023,
        "PH_PAYMAYA" : 0.018,
        "PH_GRABPAY" : 0.020,
        "PH_SHOPEEPAY" : 0.020,
    })

    const [subPrice, setSubPrice] = useState(0)



    const calculateSubPrice = () => {
        const adultTotal = adultPrice * booking?.data.adult_count
        const childTotal = childPrice * booking?.data.child_count
        const tentPitchTotal = tentPitchPrice * booking?.data.bonfire_kit_count
        const bonfireKitTotal = bonfireKitPrice * booking?.data.bonfire_kit_count
        var cabinTotal = 0
        if (booking?.data.is_cabin === true) {
            cabinTotal = cabinPrice
        }
        return (adultTotal + childTotal + tentPitchTotal + bonfireKitTotal + cabinTotal).toFixed(2)
    }


    const calcPricePerUnit = (price, count) => {
        return (price * count).toFixed(2)
    }

    const calculateFee = (subTotalPrice, eWalletProviderName) => {
        return (subTotalPrice * eWalletFee[eWalletProviderName]).toFixed(2)
    }

    const calculateTotalPrice = (calculatedSubPrice, calculatedFee) => {
        return (parseFloat(calculatedSubPrice) + parseFloat(calculatedFee)).toFixed(2)

    }


    return {
        adultPrice,
        childPrice,
        tentPitchPrice,
        bonfireKitPrice,
        cabinPrice,
        calcPricePerUnit,
        calculateSubPrice,
        calculateFee,
        calculateTotalPrice
    }
}
