import { View, Text, ScrollView, RefreshControl, TouchableOpacity, TextInput, Image, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import ContentBody from '@/components/ContentBody'
import CustomButton from '@/components/CustomButton'
import { Href, router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import axios from '@/utils/axios'
import FormField from '@/components/FormField'
import NumberField from '@/components/NumberField'
import ToastMessage from '@/components/ToastMessage'
import * as ImagePicker from 'expo-image-picker';

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


const index = () => {
  const [cabin, setCabin] = useState<ICabin | undefined>()
  const [loading, setLoading] = useState(true)
  const { id } = useLocalSearchParams() as { id: string | string[] }
  const [ errors, setErrors ] = useState<{ 
    email?: string; 
    password?: string;
    name?: string;
    description?: string;
    price?: string;
    capacity?: string;
    image?: string;
  }>({})

  const refreshCabins = () => {
    axios.get(`/cabin/${id}`)
      .then((res) => {
        setCabin(res.data)
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
      refreshCabins()
    }, [])
  );

  const submitEditCabin = () => {
    setErrors({})
    setLoading(true)
    if (!cabin) {
      return;
    }
    axios.patch(`/cabin/${id}`, {
      id: cabin.id,
      name: cabin.name,
      description: cabin.description,
      price: cabin.price,
      capacity: cabin.capacity,
    })
      .then((res) => {
        ToastMessage('success', 'Successfully Editted', 'Cabin has been editted successfully')
        router.reload()
      })
      .catch((error) => {
        setErrors(error.response.data.errors)
        alert(JSON.stringify(error.response.data.message, undefined, 2))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const setImageFromLocal = async () => {
    setLoading(true)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [5, 3],
      quality: 1,
    });
    if (!result.canceled) {
      let formData = new FormData();
      const imageBlob = {
        uri: result.assets[0].uri,
        type: 'image/jpg',
        name: 'image.jpg'
      } as any;
      formData.append('image', imageBlob);

      axios.post(`/mobile/cabin/${id}/change-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          setCabin((prev: any) => ({ ...prev, image: result.assets[0].uri }))
          ToastMessage('success', 'Image changed successfully', 'Cabin image has been changed successfully')
          router.reload()
        })
        .catch((error) => {
          setErrors(error.response.data.errors)
          alert(JSON.stringify(error.response.data.message, undefined, 2))
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const deleteCabin = () => {
    setLoading(true)
    axios.delete(`/cabin/${id}`)
      .then((res) => {
        ToastMessage('success', 'Successfully Deleted', 'Cabin has been deleted successfully')
        router.replace('/cabins' as Href)
      })
      .catch((error) => {
        alert(JSON.stringify(error.response.data.message, undefined, 2))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const showAlert = (title: string, body: string, confirmButtonText: string, confirmFunc: () => void) => {
    Alert.alert(
      title,
      body,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: confirmButtonText, onPress: () => deleteCabin()}
      ],
    )
  }


  if (loading && cabin === undefined) {
    return (
      <View>
        <Text></Text>
      </View>
    )
  }

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshCabins} progressViewOffset={30}/>}>
        <ContentBody>
            <View className='flex-row justify-end space-x-3 items-center'>
              <View>
                <CustomButton containerStyles='bg-red-500 px-3' textStyles='text-white font-semibold text-sm' handlePress={() => showAlert("Are you sure?", "This cabinn will be deleted", "Delete", () => deleteCabin())} title='Delete Cabin'/>
              </View>
            </View>
            <View>
            <View className='space-y-4 mt-6 mb-6'>
              {/* {cabin?.image && (
                <View className='border-b-2 mb-6'>
                  <Text className='mb-2 text-slate-400 font-semibold text-center mt-6'>Image Preview</Text>
                  <Image source={{ uri: cabin?.image }} className='w-full h-44 mb-6 rounded-xl' />
                </View>
              )} */}
              {cabin && !cabin.image ? (
                <TouchableOpacity onPress={() => setImageFromLocal()} className='bg-yellow-50 items-center justify-center border-dashed	border-2 h-40'>
                  <View className='w-full h-full items-center justify-center'>
                    <Text className='text-base text-gray-800 font-semibold'>Add cabin image</Text>
                    {errors?.image && <Text className='text-red-400 text-center mx-6'>{errors.image}</Text>}
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setImageFromLocal()} className='bg-yellow-50 items-center justify-center border-dashed	border-2 h-40 relative'>
                  <Image source={{ uri: cabin?.image }} className='w-full h-full mb-2 absolute top-0 left-0' />
                  <View className='w-full h-full bg-[#00000092] items-center justify-center'>
                    <Text className='text-base text-white font-semibold text-center'>Change cabin image</Text>
                  </View>
                </TouchableOpacity>
              )}
              <View>
                <FormField errors={errors?.name} title='Cabin name' placeholder="Cabin name" value={cabin?.name || ''} handleChangeText={(e) => setCabin((prev: any) => ({ ...prev, name: e }))}  />
              </View>
              <View>
                <NumberField errors={errors?.price} title='Price' placeholder="Price" value={cabin?.price.toString() || ''} handleChangeText={(e) => setCabin((prev: any) => ({ ...prev, price: Number(e) }))} />
              </View>
              <View>
                <NumberField errors={errors?.capacity} title='Capacity' placeholder="Capacity" value={cabin?.capacity.toString() || ''} handleChangeText={(e) => setCabin((prev: any) => ({ ...prev, capacity: Number(e) }))} />
              </View>
              <View className='space-y-2'>
                <Text className='text-base text-gray-800 font-medium'>Description</Text>
                <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-[#FFC39E] flex flex-row items-start p-3">
                    <TextInput
                      multiline
                      className="flex-1 font-semibold text-base"
                      value={cabin?.description}
                      placeholder="Describe the cabin"
                      placeholderTextColor="#7B7B8B"
                      onChangeText={(e) => setCabin((prev: any) => ({ ...prev, description: e }))}
                    />
                </View>
                  {errors?.description && <Text className='text-red-400'>{errors.description}</Text>}
              </View>
            </View>
            <View>
              <CustomButton title="Edit cabin" isLoading={loading} handlePress={() => submitEditCabin()} containerStyles='bg-[#3E5F5D] py-4' textStyles='text-white font-semibold'/>
            </View>
            </View>
        </ContentBody>
    </ScrollView>
  )
}

export default index