import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, Stack, Tabs, router } from 'expo-router'

const _layout = () => {
  
  interface TabIconProps {
    icon: any,
    color: string,
    name: string,
    focused: boolean
  }


  const TabIcon:React.FC<TabIconProps> = ({ icon, color, name, focused}) => {
    return (
      <View className='flex flex-col items-center space-y-1'>
        <Image 
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className='w-6 h-6'
        />
        <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} font-bold text-xs`}>{name}</Text>
      </View>
    )
  }


  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        height: 80,
        
      },
      tabBarShowLabel: false,
    }}>
        <Tabs.Screen name="home/index" options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <TabIcon icon={require('@/assets/icons/home.png')} color={color} name='Home' focused={focused}/>
          )
          
        }}/>
      <Tabs.Screen name="wallet/index" options={{
        title: 'Wallet',
        headerShown: false,
        tabBarIcon: ({color, focused}) => (
          <TabIcon icon={require('@/assets/icons/wallet.png')} color={color} name='Wallet' focused={focused}/>
        )
      }}/>
      <Tabs.Screen name="settings/index" options={{
        title: 'Settings',
        headerShown: false,
        tabBarIcon: ({color, focused}) => (
          <TabIcon icon={require('@/assets/icons/settings.png')} color={color} name='Settings' focused={focused}/>
        )
      }}/>
    </Tabs>
  )
}

export default _layout