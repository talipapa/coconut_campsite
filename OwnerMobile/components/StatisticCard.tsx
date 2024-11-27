
import React from "react";
import { Image, ImagePropsBase, Text, View } from 'react-native'

const StatisticCard = (
    // Parameters
    {title, data = undefined, iconColor = "#000000", isLoading, rootStyle = '', titleStyle = 'text-slate-700', dataStyle = ''}: 
    // Parameter types
    {
        title: string, 
        data?: number|string|undefined,
        iconColor?: string,
        rootStyle?: string,
        titleStyle?: string,
        dataStyle?: string,
        isLoading: boolean,
  }) => {

    const customStyles = {
      shadow : {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,
      }
    }
      


    return (
      <View style={customStyles.shadow} className={`flex space-x-4 flex-row justify-between items-center bg-slate-100 rounded-xl shadow-xl p-5 mb-5 ${rootStyle}`}>
          <View className='flex-1'>
              <Text className={`font-semibold text-xl ${titleStyle}`}>{title}</Text>
              {!isLoading ? 
                  <Text className={`font-semibold text-3xl ${dataStyle}`}>{data?.toString()}</Text> 
                :
                  <View className={`font-semibold grow bg-slate-800 w-full text-3xl rounded-lg h-8 ${dataStyle}`}/>
              }
          </View>
      </View>
    )
}

export default StatisticCard