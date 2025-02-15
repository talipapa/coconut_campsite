import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, router, useRootNavigationState } from "expo-router";
import { useEffect } from "react";

import{ useGlobalContext } from "@/Context/GlobalProvider";
import React from "react";

export default function Index() {
  const rootNavigationState = useRootNavigationState()
  const navigatorReady = rootNavigationState?.key != null

  const { isLoading, isLoggedIn, user } = useGlobalContext();


  useEffect(() => {
    // ToastMessage("error", "debugging", user?.first_name); // Debugging purpose
    if (!isLoading && isLoggedIn) {
      router.replace("/home")
    } 
  }, [isLoading, isLoggedIn])
  return (
    <SafeAreaView className="h-full bg-[#FFFFFF] flex items-center justify-center p-10">
      <View className="flex flex-col items-center justify-between h-full w-full">
        <View className="w-full h-[60vh] flex items-center justify-center space-y-12">
          <Image source={require('@/assets/images/palm-tree.gif')} className="w-[200px] h-[200px]" />
          <View className="flex flex-col items-center space-y-1">  
            <Text className="text-[#00000098] text-3xl font-bold">Welcome to</Text>
            <View className="flex flex-row space-x-2">
              <Text className="text-[#964926] text-3xl font-black">COCONUT</Text>
              <Text className="text-3xl font-bold">WALLET</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity className="bg-[#56342A] py-3 w-full rounded-lg" onPress={() => router.push("/login")}>
          <Text className="text-white text-xl font-semibold tracking-widest text-center">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


