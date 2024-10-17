import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { Href, router } from 'expo-router'
import { BookingType } from '@/types/BookingType'

interface BookingCardProps {
    containerStyle: string,
    booking: BookingType

}

const BookingCard:React.FC<BookingCardProps> = ({containerStyle, booking}) => {
    const customStyle = StyleSheet.create({
        shadow: {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,
    
          elevation: 14,
        }
      })
    
      const [isHovered, setIsHovered] = useState(false)

      const fullName = `${booking.first_name} ${booking.last_name}`

    return (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => router.push(`booking/${booking.id}` as Href)}>
            <View onPointerEnter={() => setIsHovered(true)} className={`max-w-[100vw] bg-white py-3 px-4 space-y-3 flex flex-col rounded-xl ${containerStyle} `} style={customStyle.shadow}>
                
                <Text>{fullName.length > 20 ? fullName.substring(0, 30) + '...' : fullName}</Text>

                <View className='flex flex-row justify-between w-full'>
                    <View className='flex flex-col justify-between space-y-5'>
                        <View>
                            <Text>{`${booking.adult_count} adult | ${booking.child_count} children`}</Text>
                        </View>
                        <View className='space-y-1'>
                            <Text className='text-white bg-slate-500 rounded-full text-center'>{booking.booking_type}</Text>
                            <Text className='text-green-500 font-bold text-xl'>₱ {booking.price}</Text>
                        </View>
                    </View>
                    <View className='flex flex-col justify-start'>
                        <View className='flex flex-row space-x-7'>
                            <Image source={require('../assets/icons/back-in-time.png')} className='w-4 h-4 absolute left-[-8]'/>
                            <Text className='text-xs'>{new Date(booking.check_in).toDateString()}</Text>
                        </View>
                        <View className='relative h-6'>
                            <Image source={require('../assets/icons/dots.png')} className='w-5 h-5 absolute left-[-10]'/>
                        </View>
                        <View className='flex flex-row space-x-7'>
                            <Image source={require('../assets/icons/booking.png')} className='w-4 h-4 absolute left-[-8]'/>
                            <Text className='text-xs'>{new Date(booking.check_in).toDateString()}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
}

export default BookingCard