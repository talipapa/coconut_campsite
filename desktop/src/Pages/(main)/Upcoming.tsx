import React from 'react'
import PageWrapper from './PageWrapper'
import { Breadcrumb } from 'antd'

const Upcoming = () => {
  return (
    <PageWrapper>
      <>
        <Breadcrumb className='bg-slate-200 shadow-lg py-5 px-6 select-none'>
          <Breadcrumb.Item><span className='font-semibold'>Reservations</span></Breadcrumb.Item>
          <Breadcrumb.Item><span className='font-semibold'>Upcoming</span></Breadcrumb.Item>
        </Breadcrumb>
        <div className='flex flex-col px-6 py-8'>
          
        </div>
      </>
    </PageWrapper>
  )
}

export default Upcoming