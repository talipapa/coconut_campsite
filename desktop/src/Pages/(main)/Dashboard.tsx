import React, { useEffect } from 'react'
import { logout } from '../../utils/AuthService'
import { ipcRenderer } from 'electron'
import PageWrapper from './PageWrapper'
import { Breadcrumb } from 'antd'
import { FaPiggyBank } from "react-icons/fa6";
import { HiOutlineCash } from "react-icons/hi";
import { HiCash } from "react-icons/hi";

import StatisticCard from '@/Components/StatisticCard'
import axios from '@/utils/auth'
import { useGlobalContext } from '@/Context/GlobalProvider'

interface DashboardProps {
  cancelledBookingThisMonth: number,
  cashRevenueThisMonth: number,
  ePaymentRevenueThisMonth: number,
  successBookingThisMonth: number,
  totalMonthEarnings: number,
  totalPreviousMonthEarnings: number,
  totalYearEarnings: number
}


const Dashboard = () => {
  const { user } = useGlobalContext()
  const [data, setData] = React.useState<DashboardProps | undefined>(undefined)
  const [loading, setLoading] = React.useState(true)
  const getDashboardData = () => {
    setLoading(true)
    axios.get('/manager/summary')
      .then((res) => {
        setData(res.data)
      }
    )
      .catch((err) => {
        console.log(err)
      }
    )
      .finally(() => {
        setLoading(false)
      }
    )
  }

  const formatCurrency = (value: number|undefined) => {
    if (value === undefined) return '₱ 0'
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)
  }

  useEffect(() => {
    getDashboardData()
  }, [user])

  
  return (
    <PageWrapper>
      <>
        <Breadcrumb className='bg-slate-200 shadow-lg py-5 px-6 select-none'>
          <Breadcrumb.Item><span className='font-semibold'>Dashboard</span></Breadcrumb.Item>
        </Breadcrumb>
        <div className='flex flex-col w-full px-6 py-8 space-y-12'>
          <div className='grid grid-cols-2 gap-7'>
            <div className='space-y-5'>
              <StatisticCard isLoading={loading} title='Total earnings (2024)' data={formatCurrency(data?.totalYearEarnings)} IconComponent={FaPiggyBank}/>
              <StatisticCard isLoading={loading} title='Current month' data={formatCurrency(data?.totalMonthEarnings)} dataStyle='text-green-600' IconComponent={HiCash}/>
              <StatisticCard isLoading={loading} title='Previous month' data={formatCurrency(data?.totalPreviousMonthEarnings)} dataStyle='text-slate-400' IconComponent={HiOutlineCash}/>
            </div>

            <div className='space-y-1'>
              <span className='text-slate-500 text-lg tracking-wider'>Current month statistics</span>
              <div className='space-y-4'>
                <StatisticCard isLoading={loading} title='Cash revenue' data={formatCurrency(data?.cashRevenueThisMonth)} IconComponent={FaPiggyBank}/>
                <StatisticCard isLoading={loading} title='E-payment revenue' data={formatCurrency(data?.ePaymentRevenueThisMonth)} IconComponent={FaPiggyBank}/>
                <div className='flex flex-row justify-between gap-5'>
                  <StatisticCard isLoading={loading} title='Success' data={`${data?.successBookingThisMonth} bookings`} titleStyle='text-sm' dataStyle='text-[1.6em] text-green-600'/>
                  <StatisticCard isLoading={loading} title='Cancelled' data={`${data?.cancelledBookingThisMonth} bookings`} titleStyle='text-sm' dataStyle='text-[1.6em] text-red-600'/>
                </div>
              </div>
            </div>

          </div>
          <span>
            Latest reservation
          </span>

        </div>
      </>
    </PageWrapper>

    
  )
}

export default Dashboard