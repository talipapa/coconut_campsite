import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export const usePrice = () => {

    const [adultPrice, setAdultPrice] = useState(100.00)
    const [childPrice, setChildPrice] = useState(50.00)
    const [tentPitchPrice, setTentPitchPrice] = useState(70.00)
    const [bonfireKitPrice, setBonfireKitPrice] = useState(150.00)
    const [cabinPrice, setCabinPrice] = useState(650.00)


    const calcPricePerUnit = (price, count) => {
        return (price * count).toFixed(2)
    }


    return {
        adultPrice,
        childPrice,
        tentPitchPrice,
        bonfireKitPrice,
        cabinPrice,
        calcPricePerUnit
    }
}
