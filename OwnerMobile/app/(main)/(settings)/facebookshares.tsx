import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ContentBody from '@/components/ContentBody'
import CustomButton from '@/components/CustomButton'

const cabins = () => {
  return (
    <ScrollView>
        <ContentBody>
            <View className='flex-row justify-between items-center'>
                <Text className='text-xl text-slate-700 font-semibold'>Facebook shares</Text>
            </View>
        </ContentBody>
    </ScrollView>
  )
}

export default cabins