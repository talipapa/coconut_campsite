import React, { useEffect, useState } from 'react'
import PageWrapper from './PageWrapper'
import { Breadcrumb, Button, Modal, Table } from 'antd'
import axios from '@/utils/auth'
import { format } from 'date-fns'

interface IBookingData {
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  tel_number: string,
  check_in: Date,
  check_out: Date,
  booking_type: string,
  is_cabin: boolean,
  status: string,
  created_at: Date,
}


const Confirmation = () => {
  const [bookingData, setBookingData] = React.useState<any | undefined>(undefined)
  const [perPage, setPerPage] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [currentBookingId, setCurrentBookingId] = React.useState('')
  
  const fetchData = () => {
    axios.get(`manager/confirmation/bookings?page=${currentPage}&per_page=${perPage}`)
      .then((res) => {
        setBookingData(res.data)
      }
    )
      .catch((err) => {
        console.log(err)
      }
    )
  }

  const [open, setOpen] = useState(false);

  const axiosBookingAction = (id: string, action: 'confirm'|'cancel') => {
    if (action === 'confirm') {
      axios.patch(`manager/booking/action/${id}`, {action: 'confirm'})
      .then((res) => {
        setCurrentPage(1)
        fetchData()
      })
    } else {
      axios.patch(`manager/booking/action/${id}`, {action: 'cancel'})
      .then((res) => {
        setCurrentPage(1)
        fetchData()
      })
    }
  }

  const showModal = (id: string, action: 'cancel'|'confirm') => {
    setCurrentBookingId(id)
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
    axiosBookingAction(currentBookingId, 'cancel')
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchData()
  }, [currentPage, perPage])


  const tableFetchOptions = (localCurrentPage: number, localPerPage: number) => {
    setCurrentPage(localCurrentPage)
    setPerPage(localPerPage)
  }




  return (
    <PageWrapper>
      <>
        <Breadcrumb className='bg-slate-200 shadow-lg py-5 px-6 select-none'>
          <Breadcrumb.Item><span className='font-semibold'>Reservations</span></Breadcrumb.Item>
          <Breadcrumb.Item><span className='font-semibold'>Confirmations</span></Breadcrumb.Item>
        </Breadcrumb>
        <div className='flex flex-col px-6 py-8 overflow-x-clip'>
          <Table
            dataSource={bookingData?.data}
            pagination={{
              current: currentPage,
              pageSize: bookingData?.per_page,
              total: bookingData?.total,
              onChange: (page, pageSize) => tableFetchOptions(page, pageSize)
          }}>
            <Table.Column
              title="Actions"
              key="actions"
              render={(_, record: IBookingData) => (
                <div className='flex flex-row space-x-2 select-none'>
                  <Button type='primary' onClick={() => axiosBookingAction(record.id, 'confirm')}  className='px-2 py-1 bg-green-600 text-white rounded-lg transition ease-in-out hover:scale-105'>Confirm</Button>
                  <Button onClick={() => showModal(record.id, 'cancel')} className='px-2 py-1 bg-red-600 text-white rounded-lg transition ease-in-out hover:scale-105'>Cancel</Button>
                </div>
            )}/>
            <Table.Column
              title="Name"
              key="name"
              render={(_, record: IBookingData) => <span className='text-xs'>{`${record.first_name} ${record.last_name}`}</span>}
            />
            <Table.Column title='Check In' dataIndex='check_in' key='check_in' render={(value) => (
              <div className='flex flex-col space-y-1'>
                {new Date() > new Date(value) ? (
                  <span className='px-2 text-white rounded-xl bg-red-400'>Overdue</span>
                ) : (
                  <span className='text-green-600'>On Time</span>
                )}
                <span className='text-xs'>{format(value, 'MMM/dd/yyyy')}</span>
              </div>
            )} />
            <Table.Column title='Booking Type' dataIndex='booking_type' key='booking_type' render={(value:string) => (
              value === 'daytour' ? (
                <span className='bg-yellow-600 px-4 py-1 rounded-lg text-white'>Day Tour</span>
              ) : (
                <span className='bg-slate-800 px-4 py-1 rounded-lg text-white'>Overnight</span>
              ) 
            )} />
            <Table.Column title='Is Cabin' dataIndex='is_cabin' key='is_cabin' render={(value:boolean) => (
              value ? (
                <span className='bg-green-600 px-4 rounded-lg text-white'>Yes</span>
              ) : (
                <span className='px-4 rounded-lg bg-slate-400 text-white'>No</span>
              )
            )} />
            <Table.Column title='Status' dataIndex='status' key='status' />
            <Table.Column title='Created At' dataIndex='created_at' key='created_at' render={(value:Date) => (
              <span className='text-xs'>{format(value, 'MMM/dd/yyyy | hh:mm a')}</span>
            )} />

          </Table>
          
        </div>
        <Modal
          open={open}
          title="Are you sure you want to cancel this booking?"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              <Button onClick={handleCancel} className='bg-slate-400 text-white'>Nevermind</Button>
              <Button onClick={handleOk} className='text-white px-12 bg-red-500'>Yes</Button>
            </>
          )}
        >
          <p></p>
        </Modal>
      </>
    </PageWrapper>
  )
}

export default Confirmation