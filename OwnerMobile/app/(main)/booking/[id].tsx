import { View, Text, ActivityIndicator, Image, ScrollView, RefreshControl, StyleSheet, Alert } from 'react-native'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import React from "react";

import { router, useLocalSearchParams } from 'expo-router'
import ToastMessage from '@/components/ToastMessage'
import { bookingActionConfirmation, fetchSingleBooking, rescheduleBooking } from '@/utils/BookingService'
import ContentBody from '@/components/ContentBody'
import { useGlobalContext } from '@/Context/GlobalProvider'
import CashBookingButtons from './CashBookingButtons'
import XenditBookingButtons from './XenditBookingButtons'
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import CustomButton from '@/components/CustomButton'
import RescheduleComponent from './RescheduleComponent'
import PressButton from '@/components/PressButton'
import FormatCurrency from '@/utils/FormatCurrency'
import cabins from '../(settings)/cabins';

export interface transactionDetailType {
  booking_id: string,
  created_at: Date,
  deleted_at: Date | undefined,
  id: string,
  payment_type: "XENDIT" | "CASH",
  price: number,
  fee: number;
  status: "CASH_PENDING" | "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "VOIDED" | "REFUNDED",
  updated_at: Date,
  user_id: string,
  xendit_product_id: string
}

export interface bookingSingleDetailType {
  transaction: transactionDetailType,

  id: string,

  adultCount: number,
  childCount: number,
  bonfire_kit_count: number,
  tent_pitching_count: number,

  cabin_image: string,
  
  booking_type: 'overnight' | 'daytour',
  check_in: Date,
  check_out: Date,
  is_cabin: boolean,
  cabin_price: number,
  
  user_id: string
  email: string,
  first_name: string,
  last_name: string,
  tel_number: string,
  
  payment_type: "XENDIT" | "CASH", 

  status: "PENDING" | "PAID" | "CASH_CANCELLED" | "VOIDED" | "REFUNDED" | "SCANNED" | "VERIFIED" | "CANCELLED"
  note: string|null,
  cabin_name: string|null,
  updated_at: Date,
  created_at: Date,
}


const index = () => {
  const { id } = useLocalSearchParams() as { id: string | string[] }
  const [booking, setBooking] = useState<bookingSingleDetailType>()
  const { prices } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalFare, setTotalFare] = useState<number>(0);
  const [isVoidEligible, setIsVoidEligible] = useState<boolean>();
  
  
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()

  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
      {...props}
        style={props.style}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
        pressBehavior="close"
      />
    ),
    [],
  )

  ////////////////////////////////////////

  // Backend data requests
 
  const refreshData = () => {
    setIsLoading(true)
    setBooking(undefined)
    const bookingId = Array.isArray(id) ? id[0] : id;
    fetchSingleBooking(bookingId)
      .then((res) => {
        setBooking(res.data.booking_detail)
        setIsVoidEligible(res.data.isVoidEligible)
      })
      .catch((err) => {
        if (err.response.status === 404){
          ToastMessage("error", "Booking not found", "Booking was not found!, Redirecting to home")
          return;
        };
        router.replace("/home")
        ToastMessage("error", "Something went wrong, check DevTools", JSON.stringify(err))
        
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const bookingActionRequest = (action: string) => {
    switch (action) {
      case "confirm":
        setIsLoading(true)
        bookingActionConfirmation(Array.isArray(id) ? id[0] : id, "confirm")
        .then(() => {
          ToastMessage("success", "Booking confirmed", "Booking has been confirmed successfully")
          refreshData()
        })
        .catch((err) => {
          ToastMessage("error", "Something went wrong", JSON.stringify(err.response.data))
        })
        .finally(() => {
          setIsLoading(false)
        })
        break;
        case "no_show":
        setIsLoading(true)
        bookingActionConfirmation(Array.isArray(id) ? id[0] : id, "cancel")
          .then(() => {
            ToastMessage("success", "No show", "Camper didn't show up & booking has been marked as No show")
            refreshData()
          })
          .catch((err) => {
            ToastMessage("error", "Something went wrong", JSON.stringify(err.response.data))
          })
          .finally(() => {
            setIsLoading(false)
          })
        break;
      default:
    }
  }
  
  //////////////////////////////////////// 


  // Alert & prompt function
  const showAlert = (title: string, body: string, confirmButtonText: string, confirmFunc: () => void) => {
    Alert.alert(
      title,
      body,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: confirmButtonText, onPress: () => confirmFunc()}
      ],
    )
  }

  const bookingAction = (action: string) => {
    switch (action) {
      case "confirm":
        showAlert(
          "Booking confirmation", 
          "Are you sure the camper has arrived and you want to confirm this booking?", 
          "Confirm", 
          () => bookingActionRequest("confirm")
        )
        break;
      case "no_show":
        showAlert(
          "No show", 
          "Are you sure the camper didn't show up at the campsite?", 
          "Yes", 
          () => bookingActionRequest("no_show")
        )
        break;
      default:
        break;
    }
  }
  ////////////////////////////////////////


  
  useEffect(() => {
    refreshData()
  }, [])

  
  if (isLoading || !booking || !prices){
    return (
      <ContentBody>
        <ActivityIndicator size="large"/>
      </ContentBody>
    )
  }



  const DetailField = ({title, body}: {title: string, body:string}) => {
    return (
      <View className='space-y-1 mt-4'>
        <Text className='text-slate-400'>{title}</Text>
        <Text className='border-[#FFC39E] border-l-2 pl-3'>{`${body}`}</Text>
      </View>
    )
  }

  const ItemPriceField = ({itemName, itemCount, itemPrice} : {itemName:string, itemCount: number, itemPrice: number | undefined}) => {
    if (itemCount <= 0){
      return;
    }

    if (itemPrice === undefined){
      itemPrice = 0
    }
    var productPrice = (itemCount * itemPrice)
    
    return (
      <View className='justify-between flex-row mt-1'>
        <Text>{`${itemName} x${itemCount} * ₱ ${itemPrice.toFixed(2)}`}</Text>
        <Text>₱ {productPrice.toFixed(2)}</Text>
      </View>
    )

  }

  const showBottomSheetModal = () => {
    handlePresentModalPress()
  }

  const exclutedStatus = ["CANCELLED", "VOIDED", "REFUNDED", "VERIFIED", "CASH_CANCELLED"]
  const refundedStatus = ["REFUNDED", "VOIDED", "REFUND_PENDING"]

  return (
    <>
      <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshData}/>}>
        <ContentBody>
          <View className='flex flex-row justify-start'>
            { !exclutedStatus.includes(booking.status) && (
            <CustomButton 
                title='Reschedule' 
                textStyles='text-xs text-white' 
                containerStyles='bg-[#BC7B5C] mr-3 px-3' 
                handlePress={showBottomSheetModal}/>
            )}
            {booking.transaction.payment_type === "XENDIT" && !refundedStatus.includes(booking.transaction.status) ? (
              <XenditBookingButtons 
                id={booking.id} 
                refresh={() => refreshData()} 
                type={booking.booking_type} 
                check_in={booking.check_in}
              />
            ) : (
              booking.status === "PENDING" && (
                <CashBookingButtons 
                  id={booking.id} 
                  refresh={() => refreshData()} 
                  type={booking.booking_type} 
                  check_in={booking.check_in}
                />
              )
            )}
          </View>
          <View className='bg-white shadow-black shadow-xl flex items-center w-full p-3 space-y-4 mt-4'>
            <View className='flex items-center space-y-2'>
              <View>
                <Text className='text-center bg-yellow-200 p-1 rounded-md'>{booking.status}</Text>
              </View>
              <View>
                <View>
                  <Text className='text-center text-slate-400'>Booking ID</Text>
                </View>
                <View>
                  <Text className='text-center'>{booking.id}</Text>
                </View>
              </View>
            </View>

            <View className='w-full border-green-300 border-t-2 pt-3'>
              <View className='flex flex-row items-center space-x-4'>
                <Image source={require('@/assets/icons/check-in.png')} className='h-5 w-5'/>
                <View>
                  <View>
                    <Text className='text-slate-400'>Check in</Text>
                  </View>
                  <View>
                    <Text>{new Date(booking.check_in).toDateString()}</Text>
                    </View>
                </View>
              </View>
              <Image source={require('@/assets/icons/dots.png')} className='h-5 w-5'/>
              <View className='flex flex-row items-center space-x-4'>
                <Image source={require('@/assets/icons/check-out.png')} className='h-5 w-5'/>
                <View>
                  <View>
                    <Text className='text-slate-400'>Check out</Text>
                  </View>
                  <View>
                    <Text>{new Date(booking.check_out).toDateString()}</Text>
                    </View>
                </View>
              </View>
            </View>
            <View className='w-full border-green-300 border-t-2'>
              <DetailField title="Full name" body={`${booking.first_name} ${booking.last_name}`}/>
              <DetailField title="Email" body={booking.email}/>
              <DetailField title="Phone number" body={`0${booking.tel_number}`}/>
            </View>

            <View className='w-full border-green-300 border-t-2 pt-4 flex items-center'>
              <View className='mb-4 items-center justify-center space-y-1'>
                <Text className='text-slate-400'>Transaction status</Text>
                <Text className='bg-blue-200 font-bold px-6 py-2 rounded-lg'>{booking.transaction.status}</Text>
              </View>
              {booking.transaction.payment_type === "XENDIT" && (
                <>
                  {isVoidEligible === true ? (
                    <View className='bg-green-200 px-4 py-2 rounded-lg'>
                      <Text>Booking is eligible for void refund 
                      (100% return)</Text>
                    </View>
                  ) : (
                    <View className='bg-red-200 px-4 py-2 rounded-lg'>
                      <Text>Booking is not eligible for void refund, 
                      VAT & fee will reducts total cash return of the guest</Text>
                    </View>
                  )}
                </>
              )}
            </View>
            <View className='w-full border-green-300 border-t-2 pt-4 flex items-start'>
              <View className={`px-4 rounded-lg flex-row items-center
                    ${booking.booking_type === "overnight" ? 'bg-[#434343] text-white' : 'bg-yellow-200'}`}>
                  {
                    booking.booking_type === 'overnight' ?
                    <Image tintColor="#FFFFFF"  source={require('@/assets/icons/moon.png')} className='w-5 h-5'/>
                    :
                    <Image source={require('@/assets/icons/sunny-day.png')} className='w-5 h-5'/>
                  }
                  <Text className={`px-4 py-2 rounded-lg flex-row capitalize text-md 
                    ${booking.booking_type === "overnight" &&'text-white'}`}>
                      {booking.booking_type}
                  </Text>
              </View>
            </View>
          </View>

          {booking.cabin_name && (
            <>
              <View className='mt-5 text-white shadow-black shadow-xl bg-green-100 p-3 space-y-1 rounded-2xl'>
                <View className='items-center'>
                  <Text className='text-slate-500 text-center'>User has reserved a cabin</Text>
                  <Text className='font-semibold text-center'>{booking.cabin_name}</Text>
                </View>
              </View>
              <View className='py-4'>
                <Text className='text-slate-500'>Cabin Preview</Text>
                <Image src={booking.cabin_image}className='w-full h-40 mt-3 rounded-lg'/>
              </View>
          
            </>
          )}


          {booking.note && (
            <View className='mt-5 text-white shadow-black shadow-xl bg-yellow-100 p-3 space-y-1'>
              <Text className='text-slate-500'>Note</Text>
              <Text>{booking.note}</Text>
            </View>
          )}


          <View className='mt-7'>
            <ItemPriceField 
              itemName="Adult"
              itemCount={booking.adultCount} 
              itemPrice={prices.find((price) => price.name === "adult")?.price}/>
            <ItemPriceField 
              itemName="Child"
              itemCount={booking.childCount} 
              itemPrice={prices.find((price) => price.name === "child")?.price}/>
            <ItemPriceField 
              itemName="Tent pitching"
              itemCount={booking.tent_pitching_count} 
              itemPrice={prices.find((price) => price.name === "tent_pitch")?.price}/>
            <ItemPriceField 
              itemName="Bonfire Kit"
              itemCount={booking.bonfire_kit_count} 
              itemPrice={prices.find((price) => price.name === "bonfire")?.price}/>
            {
              booking.cabin_name && (
              <View className='justify-between flex-row mt-1'>
                  <Text>{`${booking.cabin_name}`}</Text>
                  <Text>{`₱ ${booking.cabin_price}.00`}</Text>
              </View>
              )
            }
          </View>

          <View className='mt-5'>
            <View className='flex-row justify-between'>
              <Text>Payment method</Text>
              <Text>{booking.transaction.payment_type === "XENDIT" ? "E-WALLET" : "CASH"}</Text>
            </View>
            <View className='flex-row justify-between mt-2'>
              <Text className='text-md text-slate-500'>Fee</Text>
              <Text className='text-md text-slate-500'>{FormatCurrency(booking.transaction.fee)}</Text>
            </View>
            <View className='flex-row justify-between'>
              <Text className='font-black text-xl'>Net earnings</Text>
              <Text className='font-black text-xl'>{FormatCurrency(Number(booking.transaction.price) - Number(booking.transaction.fee))}</Text>
            </View>
          </View>



        </ContentBody>
        <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
          >
            <BottomSheetView>
              <View className='h-[50vh] mx-5 my-6'>
                <RescheduleComponent id={booking.id} bookingType={booking.booking_type} checkInDate={booking.check_in} refreshData={refreshData}/>
              </View>    
            </BottomSheetView>
        </BottomSheetModal>

      </ScrollView>

      {!exclutedStatus.includes(booking.status) &&
          (
          <View className='bg-[#264653] rounded-t-lg'>
            <View className='mx-5 my-6'>
              <View className='flex flex-row justify-between items-center'>
              <Text className='text-green-200 text-xl'>Net earnings</Text>
              <Text className='text-white font-bold text-xl'>{FormatCurrency(Number(booking.transaction.price) - Number(booking.transaction.fee))}</Text>         
              </View>
              <View className='flex flex-row justify-between w-full mt-4'>
                <PressButton 
                    title='Confirm booking' 
                    isLoading={isLoading}
                    textStyles='text-xs text-black' 
                    containerStyles='bg-green-400 w-[70%] px-3' 
                    handlePress={() => bookingAction("confirm")}
                />
                <PressButton 
                    title='No show' 
                    isLoading={isLoading}
                    textStyles='text-xs text-white' 
                    containerStyles='bg-red-400 px-3' 
                    handlePress={() => bookingAction("no_show")}
                />
              </View>
            </View>
          </View>
          )
 
      }
    </>
  )
}




export default index