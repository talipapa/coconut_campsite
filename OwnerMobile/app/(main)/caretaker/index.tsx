import { View, Text, ScrollView, RefreshControl, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import React = require("react");

import { useGlobalContext } from '@/Context/GlobalProvider';
import ContentBody from '@/components/ContentBody';
import CustomButton from '@/components/CustomButton';
import { router, useFocusEffect } from 'expo-router';
import { getManagers } from '@/utils/Caretaker';

interface IManagers {
    id: string,
    first_name: string,
    last_name: string,
    email: string
}


const index = () => {
    const { user } = useGlobalContext();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [managers, setManagers] = useState<IManagers[]>([])

    const refreshPageBooking = () => {
        setIsLoading(true)
        setManagers([])
        getManagers()
          .then((res) => {
            setManagers(res)
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            setIsLoading(false)
          })
    }
    
    useFocusEffect(
        useCallback(() => {
            refreshPageBooking()
        }, [])
    );


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

    const ManagerCard = () => {
        return(
            managers.map((manager: IManagers) => (
                <TouchableOpacity key={manager.id} onPress={() => router.push(`/caretaker/${manager.id}`)} style={customStyle.shadow} className='bg-[#e79975] rounded-md w-full p-4 mb-5'>
                    <View className='flex-row items-center space-x-3'>
                        <View className='bg-white rounded-full p-1 items-center justify-center'>
                            <Image tintColor="#000000" source={require('@/assets/icons/normal_user.png')} className='w-7 h-7 rounded-full'/>
                        </View>
                        <Text className='text-white font-semibold'>{`${manager.first_name} ${manager.last_name}`}</Text>
                    </View>
                </TouchableOpacity>
            ))
        )

    }



    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshPageBooking}/>}>

            <ContentBody>
                <View className='flex-row justify-between items-center'>
                    <Text className='text-xl text-slate-700 font-semibold'>Manage caretakers</Text>
                    <CustomButton containerStyles='bg-[#559D99] px-3' textStyles='text-xs text-white' title='Add caretaker' handlePress={() => router.push('/caretaker/add')} />
                </View>
            </ContentBody>

            <View className='bg-[#ffc39e3b] py-10 px-4 space-y-3 rounded-t-3xl min-h-[80vh]'>
                {managers.length > 0 ? (
                    <ManagerCard />
                ) : (
                    <Text className='text-center text-lg text-slate-700'>No caretaker found</Text>
                )}
            
            </View>
        </ScrollView>
    )
}

export default index