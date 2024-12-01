import { View, Text, ScrollView, RefreshControl, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import ContentBody from '@/components/ContentBody'
import { Href, router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import * as ImagePicker from 'expo-image-picker';
import axios from '@/utils/axios'
import ToastMessage from '@/components/ToastMessage'
import NumberField from '@/components/NumberField'

interface ICabin {
  name: string,
  description: string,
  price: number,
  capacity: number,
  created_at: string,
  updated_at: string,
  image: any
}


const addcabin = () => {
  const [loading, setLoading] = useState(false)
  const [ errors, setErrors ] = useState<{ 
    email?: string; 
    password?: string;
    name?: string;
    description?: string;
    price?: string;
    capacity?: string;
    image?: string;
  }>({})
  const [cabin, setCabin] = useState<ICabin>({
    name: '',
    description: '',
    price: 0,
    capacity: 0,
    created_at: '',
    updated_at: '',
    image: null,
  })

  const setImageFromLocal = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [5, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setCabin((prev: any) => ({ ...prev, image: result.assets[0].uri }))
    }
  }

  const submitNewCabin = () => {
    setErrors({})
    setLoading(true)
    if (cabin.image) {
      const fileName = cabin.image.split('/').pop();
      const fileType = fileName?.split('.').pop();
    }

    let formData = new FormData();
    formData.append('name', cabin.name);
    formData.append('description', cabin.description);
    formData.append('price', cabin.price.toString());
    formData.append('capacity', cabin.capacity.toString());
    const imageBlob = {
      uri: cabin.image,
      type: 'image/jpg',
      name: 'image.jpg'
    } as any;
    formData.append('image', imageBlob);

    axios.post('/cabin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        ToastMessage('success', 'Cabin added successfully', 'Cabin has been added successfully')
        router.replace('/cabins')
      })
      .catch((error) => {
        setErrors(error.response.data.errors)
        alert(JSON.stringify(error.response.data.message, undefined, 2))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <ScrollView>
        <ContentBody>
          <View className='space-y-4 mb-6'>
            {cabin.image && (
              <>
                <TouchableOpacity onPress={() => setCabin((prev: any) => ({...prev, image: null}))}>
                  <Text className='text-base text-red-500 font-semibold mt-1'>Remove image</Text>
                </TouchableOpacity>
              </>
            )}
            {!cabin.image ? (
              <TouchableOpacity onPress={() => setImageFromLocal()} className='bg-yellow-50 items-center justify-center border-dashed	border-2 h-40'>
                <View className='w-full h-full items-center justify-center'>
                  <Text className='text-base text-gray-800 font-semibold'>Add cabin image</Text>
                  {errors?.image && <Text className='text-red-400 text-center mx-6'>{errors.image}</Text>}
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setImageFromLocal()} className='bg-yellow-50 items-center justify-center border-dashed	border-2 h-40 relative'>
                <Image source={{ uri: cabin.image }} className='w-full h-full mb-2 absolute top-0 left-0' />
                <View className='w-full h-full bg-[#00000092] items-center justify-center'>
                  <Text className='text-base text-white font-semibold text-center'>Change cabin image</Text>
                </View>
              </TouchableOpacity>
            )}

            <View>
              <FormField errors={errors?.name} title='Cabin name' placeholder="Cabin name" value={cabin.name || ''} handleChangeText={(e) => setCabin((prev: any) => ({ ...prev, name: e }))}  />
            </View>
            <View>
              <NumberField errors={errors?.price} title='Price' placeholder="Price" value={cabin.price.toString() || ''} handleChangeText={(e) => setCabin((prev: any) => ({ ...prev, price: Number(e) }))} />
            </View>
            <View>
              <NumberField errors={errors?.capacity} title='Capacity' placeholder="Capacity" value={cabin.capacity.toString() || ''} handleChangeText={(e) => setCabin((prev: any) => ({ ...prev, capacity: Number(e) }))} />
            </View>
            <View className='space-y-2'>
              <Text className='text-base text-gray-800 font-medium'>Description</Text>
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-[#FFC39E] flex flex-row items-start p-3">
                  <TextInput
                    multiline
                    className="flex-1 font-semibold text-base"
                    value={cabin.description}
                    placeholder="Describe the cabin"
                    placeholderTextColor="#7B7B8B"
                    onChangeText={(e) => setCabin((prev: any) => ({ ...prev, description: e }))}
                  />
              </View>
                {errors?.description && <Text className='text-red-400'>{errors.description}</Text>}
            </View>
          </View>
          <View>
            <CustomButton title="Add cabin" isLoading={loading} handlePress={() => submitNewCabin()} containerStyles='bg-[#3E5F5D] py-4' textStyles='text-white font-semibold'/>
          </View>
        </ContentBody>
    </ScrollView>
  )
}

export default addcabin