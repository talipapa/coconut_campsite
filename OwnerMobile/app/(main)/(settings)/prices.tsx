import { View, Text, ScrollView, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import ContentBody from '@/components/ContentBody'
import FormField from '@/components/FormField'

const prices = () => {
  const [pricesForm, setPricesForm] = useState({
    adult: '',
    child: '',
    tent_pitch: '',
    bonfire: '',
    cabin: ''
})    



  return (
    <ScrollView>
        <ContentBody>
            <View className='flex-col justify-between space-y-6 items-center'>
              <View className='bg-yellow-200 w-full rounded-lg flex-1 p-4 flex-row items-center space-x-6'>
                <Image source={require('@/assets/icons/warning.png')} className='w-7 h-7' tintColor={"#0f0f0f"}/>
                <Text className='col-span-3'>You can edit your service fee here</Text>                
              </View>
              <View className='w-full space-y-3'>
                <View>
                  <FormField
                    title='Adult entrance fee'
                    placeholder={pricesForm.adult}
                    value={pricesForm.adult}
                    handleChangeText={(e) => setPricesForm({...pricesForm, adult: e})} 
                    // errors={errors.password}
                  />
                </View>
                <View>
                  <FormField
                    title='Adult entrance fee'
                    placeholder={pricesForm.adult}
                    value={pricesForm.adult}
                    handleChangeText={(e) => setPricesForm({...pricesForm, adult: e})} 
                    // errors={errors.password}
                  />
                </View>
              </View>
            </View>
        </ContentBody>
    </ScrollView>
  )
}

export default prices