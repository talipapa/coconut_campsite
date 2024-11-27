import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native'
import { useState } from 'react'
import React from "react";
import { Href, router } from 'expo-router'



interface BookingType {
    id: number,
    email: string,
    tel_number: string
    first_name: string,
    last_name: string,
    check_in: string,
    check_out: string,
    status: string,
}


interface BookingCardProps {
    containerStyle: string,
    booking: BookingType

}

const TransactionCard:React.FC<BookingCardProps> = ({containerStyle, booking}) => {
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
            <View onPointerEnter={() => setIsHovered(true)} className={`max-w-[100vw] bg-white py-3 px-6 space-y-3 flex flex-col rounded-xl ${containerStyle} `} style={customStyle.shadow}>
                
                <Text>{fullName.length > 20 ? fullName.substring(0, 30) + '...' : fullName}</Text>

                <View className='flex flex-row justify-between w-full'>
                    <View className='flex flex-col justify-start space-y-2'>
                        <View className='flex flex-row space-x-3 items-center'>
                            <Image source={require('../assets/icons/check-in.png')} className='w-5 h-5'/>
                            <View className='flex flex-col'>
                                <Text className='text-xs text-slate-400'>Check in</Text>
                                <Text className='text-xs'>{new Date(booking.check_in).toDateString()}</Text>
                            </View>
                        </View>
                        <View className='relative h-6'>
                            <Image source={require('../assets/icons/dots.png')} className='w-5 h-5'/>
                        </View>
                        <View className='flex flex-row space-x-3 items-center'>
                            <Image source={require('../assets/icons/check-out.png')} className='w-5 h-5'/>
                            <View className='flex flex-col'>
                                <Text className='text-xs text-slate-400'>Check out</Text>
                                <Text className='text-xs'>{new Date(booking.check_out).toDateString()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
}

export default TransactionCard