import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import ContentBody from '@/components/ContentBody'
import CustomButton from '@/components/CustomButton'
import { Href, router, useFocusEffect } from 'expo-router'
import axios from '@/utils/axios'
import ToastMessage from '@/components/ToastMessage'
import { RefreshControl } from 'react-native-gesture-handler'

interface ICabin {
  id: string,
  name: string,
  description: string,
  price: number,
  capacity: number,
  created_at: string,
  updated_at: string,
  image: any,
}

const cabins = () => {
  const [cabins, setCabins] = useState<ICabin[] | undefined>()
  const [loading, setLoading] = useState(true)
  
  const refreshCabins = () => {
    axios.get('/cabin')
      .then((res) => {
        setCabins(res.data)
      })
      .catch((err) => {
        alert(JSON.stringify(err.response.data))
      })
      .finally(() => {
        setLoading(false)
      })
  }
  
  // const submitNewPrice = () => {
  //   setLoading(true)
  //   axios.patch('/mobile/prices/update', cabin)
  //     .then((res) => {
  //       ToastMessage('success', 'Prices adjusted', 'Prices have been adjusted successfully')
  //     })
  //     .catch((err) => {
  //       alert(JSON.stringify(err.response.data))
  //     })
  //     .finally(() => {
  //       setLoading(false)
  //     })    
  // }

  useFocusEffect(
    useCallback(() => {
      refreshCabins()
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
  
  if (loading && cabins === undefined) {
    return (
      <View>
        <Text></Text>
      </View>
    )
  }
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshCabins} progressViewOffset={30}/>}>
        <ContentBody>
            <View className='flex-row justify-between items-center'>
              <View>
                <Text className='text-2xl font-bold'>Cabins</Text>
                <Text className='text-sm text-gray-500'>List of all cabins</Text>
              </View>
              <CustomButton containerStyles='bg-[#3E5F5D] px-3' textStyles='text-white font-semibold text-sm' handlePress={() => router.push('/singlecabin/extrapage/addcabin' as Href)} title='Add Cabin'/>
            </View>
            <View className='mt-4 space-y-4'>
              {cabins?.map((cabin) => (
                // Card
                <TouchableOpacity onPress={() => router.push(`singlecabin/${cabin.id}` as Href)} key={cabin.id} style={customStyle.shadow} className='flex-1 rounded-lg flex flex-col bg-slate-800'>
                  {/* Image */}
                  <Image src={cabin.image} className='w-full h-32 rounded-t-lg'/>
                  {/* Details bottom */}
                  <View className='bg-white p-3 rounded-b-lg border-b-4 border-green-700'>
                    <View>
                      <Text>{cabin.name}</Text>
                    </View>
                    <View>
                      <Text className='font-bold text-green-700'>P {cabin.price}</Text>
                    </View>                    
                    <View className='mt-2'>
                      <Text className='text-slate-600 text-md font-semibold'>{cabin.description.length > 100 ? cabin.description.substring(0, 70) + '......' : cabin.description}</Text>
                    </View>                    
                  </View>
                </TouchableOpacity>
              ))}

            </View>
        </ContentBody>
    </ScrollView>
  )
}

export default cabins