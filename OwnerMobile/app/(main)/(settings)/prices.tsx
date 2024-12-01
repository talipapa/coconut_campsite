import { View, Text, ScrollView, TextInput, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ContentBody from '@/components/ContentBody'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import axios from '@/utils/axios'
import { useFocusEffect } from 'expo-router'
import ToastMessage from '@/components/ToastMessage'

interface PricesForm {
  adult: number,
  child: number,
  tent_pitch: number,
  bonfire: number,
}

const prices = () => {
  const [pricesForm, setPricesForm] = useState<PricesForm | undefined>()
  const [loading, setLoading] = useState(true)
  
  const refreshPrices = () => {
    axios.get('/price')
      .then((res) => {
        setPricesForm({
          adult: res.data.data[0].price,
          child: res.data.data[1].price,
          tent_pitch: res.data.data[2].price,
          bonfire: res.data.data[3].price,
        })
      })
      .catch((err) => {
        alert(JSON.stringify(err.response.data))
      })
      .finally(() => {
        setLoading(false)
      })
  }
  
  const submitNewPrice = () => {
    setLoading(true)
    axios.patch('/mobile/prices/update', pricesForm)
      .then((res) => {
        ToastMessage('success', 'Prices adjusted', 'Prices have been adjusted successfully')
      })
      .catch((err) => {
        alert(JSON.stringify(err.response.data))
      })
      .finally(() => {
        setLoading(false)
      })    
  }

  useFocusEffect(
    useCallback(() => {
      refreshPrices()
    }, [])
  );
  
  if (loading && pricesForm === undefined) {
    return (
      <View>
        <Text></Text>
      </View>
    )
  }

  return (
    <ScrollView>
        <ContentBody>
            <View className='flex-col justify-between space-y-6 items-center'>
              <View className='w-full space-y-4'>
                <View>
                  <FormField title='Adult entrance fee' placeholder={`${pricesForm?.adult}`} value={pricesForm?.adult.toString() || ''} handleChangeText={(e) => setPricesForm((prev: any) => ({ ...prev, email: Number(e) }))} />
                </View>
                <View>
                    <FormField title='Child entrance fee' placeholder={`${pricesForm?.child}`} value={pricesForm?.child.toString() || ''} handleChangeText={(e) => setPricesForm((prev: any) => ({ ...prev, child: Number(e) }))} />
                </View>
                <View>
                    <FormField title='Tent pitch fee' placeholder={`${pricesForm?.tent_pitch}`} value={pricesForm?.tent_pitch.toString() || ''} handleChangeText={(e) => setPricesForm((prev: any) => ({ ...prev, tent_pitch: Number(e) }))} />
                </View>
                <View>
                    <FormField title='Bonfire 1x kit price' placeholder={`${pricesForm?.bonfire}`} value={pricesForm?.bonfire.toString() || ''} handleChangeText={(e) => setPricesForm((prev: any) => ({ ...prev, bonfire: Number(e) }))} />
                </View>
              </View>
              <View className='w-full h-full'>
                <CustomButton title="Edit" isLoading={loading} handlePress={() => submitNewPrice()} containerStyles='bg-[#3E5F5D] py-4' textStyles='text-white font-semibold'/>
              </View>
            </View>
        </ContentBody>
    </ScrollView>
  )
}

export default prices