import { View, Text, Image } from 'react-native'
import { useEffect } from 'react'
import React from "react";
import { Slot, Stack, Tabs, router } from 'expo-router'
import { useGlobalContext } from '@/Context/GlobalProvider'

const _layout = () => {
  
  interface TabIconProps {
    icon: any,
    color: string,
    name: string,
    focused: boolean
  }


  const TabIcon:React.FC<TabIconProps> = ({ icon, color, name, focused}) => {

    return (
      <View className='flex flex-col space-y-1 h-32 text-center justify-end py-6 w-32 items-center'>
        <Image 
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className='w-7 h-7'
        />
        <Text className={`${focused ? 'font-psemibold text-[#559D99]' : 'font-pregular text-white'} font-bold text-xs`}>{name}</Text>
      </View>
    )
  }

  


  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        height: 70,
        backgroundColor: '#56342A',
      },
      tabBarActiveTintColor: '#559D99',
      tabBarInactiveTintColor: '#cccccc',
      
      tabBarShowLabel: false,
  }}>
      <Tabs.Screen name="home/index" options={{
        title: 'Home',
        headerShown: false,
        tabBarIcon: ({color, focused}: {color:any, focused:any}) => (
          <TabIcon icon={require('@/assets/icons/home.png')} color={color} name='Home' focused={focused}/>
        )
        
      }}/>
      <Tabs.Screen name="wallet/index" options={{
        title: 'Wallet',
        headerShown: false,
        tabBarIcon: ({color, focused}: {color:any, focused:any}) => (
          <TabIcon icon={require('@/assets/icons/wallet.png')} color={color} name='Wallet' focused={focused}/>
        )
      }}/>
      <Tabs.Screen name="settings/index" options={{
        title: 'Settings',
        headerShown: false,
        tabBarIcon: ({color, focused}: {color:any, focused:any}) => (
          <TabIcon icon={require('@/assets/icons/settings.png')} color={color} name='Settings' focused={focused}/>
        )
      }}/>
    </Tabs>
  )
}

export default _layout