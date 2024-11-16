'use client'

import { useEffect, useState } from 'react'
import { useLaravelBooking } from './booking'
import axios from '@/lib/axios'

export const usePrice = () => {
    const { booking } = useLaravelBooking()

    const [adultPrice, setAdultPrice] = useState(100.00)
    const [childPrice, setChildPrice] = useState(50.00)
    const [tentPitchPrice, setTentPitchPrice] = useState(70.00)
    const [bonfireKitPrice, setBonfireKitPrice] = useState(150.00)

    const [isLoadingCabin, setIsLoadingCabin] = useState(true)
    const [cabin, setCabin] = useState([])

    useEffect(() => {
        axios.get('/api/v1/price')
            .then((res) => {
                Object.keys(res.data['data']).forEach((key) => {
                    Object.keys(res.data['data'][key]).forEach((subKey) => {
                        switch (res.data['data'][key]['name']) {
                            case 'adult':
                                setAdultPrice(res.data['data'][key][subKey])
                                break;
                            case 'child':
                                setChildPrice(res.data['data'][key][subKey])
                                break;
                            case 'tent_pitch':
                                setTentPitchPrice(res.data['data'][key][subKey])
                                break;
                            case 'bonfire':
                                setBonfireKitPrice(res.data['data'][key][subKey])
                                break;
                            default:
                                break;
                        }
                    })
                        

                })
                
            })
            
            .catch((err) => {
                console.log(err)
            })

    }, [])

    useEffect(() => {
        axios.get('/api/v1/cabin')
            .then((res) => {
                setCabin(res.data)
            })
            .finally(() => {
                setIsLoadingCabin(false)
            })
    }, [])



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
        return (adultTotal + childTotal + tentPitchTotal + bonfireKitTotal).toFixed(2)
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
        calcPricePerUnit,
        calculateSubPrice,
        calculateFee,
        calculateTotalPrice,
        setAdultPrice,
        setChildPrice,
        setTentPitchPrice,
        setBonfireKitPrice,
        setEWalletFee,
        subPrice,
        setSubPrice,
        isLoadingCabin,
        cabin
    }
}
