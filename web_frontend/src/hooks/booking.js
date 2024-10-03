import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { Button, DatePicker, InputNumber, Radio, notification, Space } from "antd";
import { permanentRedirect, redirect } from 'next/navigation'
import useSWR from "swr";
import dayjs from "dayjs";
import { useAuth } from "./auth";
import { useRouter } from "next/navigation";

export const useLaravelBooking = () => {
    const { data: booking, error, mutate } = useSWR('/api/v1/booking-check', () =>
        axios
            .get('/api/v1/booking-check')
            .then(res => res.data)
            .catch(error => {
               throw error
            }),
    )
    const router = useRouter()
    const { user } = useAuth({ middleware: 'auth' })


    // True = user has existing booking
    const [existBooking, setExistBooking] = useState()

    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
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

    // Api version
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION

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
        const bookingData = {
            first_name,
            last_name,
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
            const response = await axios.post('api/' + apiVersion + "/booking", bookingData)
            if (response.status === 200 || response.status === 201 || response.status === 203 || response.status === 204){
                openSuccessNotification()
                setTimeout(() => {
                    router.push('/booking/checkout')
                }, 200)
            }

        } catch (error) {
            switch (error.response.status) {
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
            const response = await axios.patch('api/' + apiVersion + "/booking/" + booking?.data.id, bookingData)

            if (response.status === 200 || response.status === 201 || response.status === 203 || response.status === 204){
                openSuccessNotification()
                setTimeout(() => {
                    console.log('redirecting')
                    router.push('/booking/checkout')
                }, 2000)
            }

        } catch (error) {
            console.log(error)
            switch (error.response.status) {
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

    useEffect(() => {
        if (booking?.message === true && booking?.data.status === "PENDING"){
            setFirstName(booking?.data.first_name)
            setLastName(booking?.data.last_name)
            setEmail(booking?.data.email)
            setTelNumber(booking?.data.tel_number)
            setAdultCount(booking?.data.adult_count)
            setChildCount(booking?.data.child_count)
            setCheckInDate(dayjs(booking?.data.check_in))
            setBookingType(booking?.data.booking_type)
            setTentPitchingCount(booking?.data.tent_pitching_count)
            setBonfireKitCount(booking?.data.bonfire_kit_count)
            setIsCabin(booking?.data.is_cabin)
            setNote(booking?.data.note)
        } else{
            // The user has existing booking and transaction is paid
            // Redirect to /account page
        }

        if (first_name === ""){
            setFirstName(user?.first_name)
            setLastName(user?.last_name)
            setEmail(user?.email)
        }
    }, [booking, user])

    return {
        booking,
        existBooking,
        createBooking,
        editBooking,
        openErrorValidationNotification,
        openErrorExistingNotification,
        openSuccessNotification,
        contextHolder,
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
        errors,
    }
}
