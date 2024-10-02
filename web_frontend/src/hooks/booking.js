import { useState } from "react"
import axios from "@/lib/axios"
import { Button, DatePicker, InputNumber, Radio, notification, Space } from "antd";

export const useLaravelBooking = () => {
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
            response.data && openSuccessNotification()
            
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

    return {
        createBooking,
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
