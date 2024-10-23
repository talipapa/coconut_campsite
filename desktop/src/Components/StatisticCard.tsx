import { Skeleton } from 'antd'
import React from 'react'
import { IconType } from 'react-icons'

const StatisticCard = (
    // Parameters
    {title, data = undefined, IconComponent, iconColor = "#000000", isLoading, rootStyle = '', titleStyle = 'text-slate-700', dataStyle = ''}: 
    // Parameter types
    {
        title: string, 
        data?: number|string|undefined, 
        IconComponent?:IconType, 
        iconColor?: string,
        rootStyle?: string,
        titleStyle?: string,
        dataStyle?: string,
        isLoading: boolean
    }) => {
  return (
    <div className='flex w-full flex-row justify-between items-center bg-slate-100 rounded-xl shadow-xl p-5'>
        <div>
            <div className={`font-semibold text-xl ${titleStyle}`}>{title}</div>
            {!isLoading ? <div className={`font-semibold text-3xl ${dataStyle}`}>{data?.toString()}</div> :
                    <Skeleton.Input active={true} size='large' />
            }
        </div>
        {IconComponent && <IconComponent className={`text-5xl ${iconColor}`}/>}
    </div>
  )
}

export default StatisticCard