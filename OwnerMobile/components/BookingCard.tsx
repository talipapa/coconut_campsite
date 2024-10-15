import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { Href, router } from 'expo-router'

interface BookingCardProps {
    containerStyle: string
}

const BookingCard:React.FC<BookingCardProps> = ({containerStyle}) => {
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

    return (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => router.push(`booking/1` as Href)}>
            <View onPointerEnter={() => setIsHovered(true)} className={`max-w-[100vw] bg-white py-3 px-4 flex flex-row justify-between rounded-xl ${isHovered && 'bg-slate-400'} ${containerStyle} `} style={customStyle.shadow}>
                <View className='space-y-4'>
                    <View>
                        <Text>John Davila</Text>
                        <Text>5 adult | 2 children</Text>
                    </View>
                    <View>
                        <Text className='text-white bg-slate-500 rounded-full text-center'>Full payment</Text>
                        <Text className='text-green-500 font-bold text-xl'>₱ 220.00</Text>
                    </View>
                </View>
                <View className='flex flex-col space-y-3 justify-start'>
                    <View className='flex flex-row space-x-7'>
                        <Image source={require('../assets/icons/back-in-time.png')} className='w-5 h-5 absolute left-[-8]'/>
                        <Text>Aug. 24, 2024</Text>
                    </View>
                    <View className='relative h-6'>
                        <Image source={require('../assets/icons/dots.png')} className='w-6 h-6 absolute left-[-10]'/>
                    </View>
                    <View className='flex flex-row space-x-7'>
                        <Image source={require('../assets/icons/booking.png')} className='w-5 h-5 absolute left-[-8]'/>
                        <Text>Aug. 25, 2024</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
}

export default BookingCard