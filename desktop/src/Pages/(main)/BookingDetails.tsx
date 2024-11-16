import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageWrapper from './PageWrapper'
import { Avatar, Breadcrumb, Button, List, Modal, Spin } from 'antd'
import axios from '@/utils/auth'
import { FaLeftLong } from 'react-icons/fa6'
import { format, formatDate } from 'date-fns'

interface IBooking {
  adultCount: number
  booking_type: string
  check_in: Date
  check_out: Date
  childCount: number
  createdAt: Date
  email: string
  first_name: string
  id: string,
  is_cabin: boolean
  last_name: string
  note: string | null
  status: string
  tel_number: string
  tent_pitching_count: number
  bonfire_kit_count: number
  transaction: string | null | undefined
  updated_at: Date
  user_id: string
}

interface ITransaction {
  booking_id: string
  created_at: Date
  deleted_at: Date | null | undefined
  id: string
  payment_type: string
  price: number
  status: string
  updated_at: Date
  user_id: string
  xendit_product_id: string | null | undefined
}

interface ICamper {
  id: string
  full_name: string
  updated_at: Date
}

interface IPageData {
  booking : IBooking
  transaction : ITransaction
  campers : ICamper[]
}

const BookingDetails = () => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [bookingData, setBookingData] = useState<IPageData | undefined>(undefined)
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
  
    const showModal = () => {
      setOpen(true);
    };
  
    const handleOk = () => {
      setModalText('The modal will be closed after two seconds');
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
    };
  
    const handleCancel = () => {
      console.log('Clicked cancel button');
      setOpen(false);
    };

    
    const fetchData = () => {
      axios.get(`manager/booking/${id}`)
        .then((res) => {
          setBookingData(res.data)
        }
      )
        .catch((err) => {
          console.log(err)
        }
      )
        .finally(() => {
          setIsLoading(false)
        }
      )
    }

    useEffect(() => {
      fetchData()
    }, [id])

    
    if (isLoading || !bookingData) {
      return (
        <PageWrapper>
          <div className='flex flex-col  items-center py-32 px-6  h-full'>
            <Spin size='large'/>
          </div>
        </PageWrapper>
      )
    }

    
  return (
    <PageWrapper>
    <>
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
      <div className='flex flex-row justify-between bg-slate-200 shadow-lg py-5 px-6 select-none items-center'>
        <Breadcrumb>
          <Breadcrumb.Item><span className='font-semibold'>Reservations</span></Breadcrumb.Item>
          <Breadcrumb.Item><span className='font-semibold'>{id}</span></Breadcrumb.Item>
        </Breadcrumb>

        {/* <div>
          <Button onClick={showModal} type='primary' className='bg-blue-600 hover:bg-blue-400' disabled={open}>Edit</Button>
        </div> */}
      </div>
      
      <div className='flex flex-col px-6 py-8 overflow-x-clip space-y-7 max-h-[80vh] overflow-y-scroll'>
        <div className='w-full'>
          <FaLeftLong onClick={() => navigate(-1)} className='text-3xl transition ease-in-out hover:scale-125'/> 
        </div>
        <div className='w-full bg-white p-6 rounded-2xl space-y-4'>
          <h1 className='text-slate-600 text-xl font-bold'>
            Campers Logbook
          </h1>
          <List
            itemLayout="horizontal"
            dataSource={bookingData?.campers}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar size="large" src={`https://ui-avatars.com/api/?name=${item.full_name}&background=random&bold=true`} />}
                  title={<span className='font-bold text-black'>{item.full_name}</span>}
                  description={<span className='font-semibold text-slate-500'>{`Time-in: ${formatDate(item.updated_at, "MMMM dd, yyyy | p")}`}</span>}
                />
              </List.Item>
            )}
          />
          
        </div>
        { bookingData?.booking.note && (
          <div className='w-full bg-yellow-300 p-6 rounded-2xl space-y-4'>
            <h1 className='text-slate-600 text-xl font-bold'>
              Note Details
            </h1>
            <div className='flex flex-col space-y-3 items-start'>
              {bookingData?.booking.note}
            </div>
          </div>
        ) }
        <div className='w-full bg-white p-6 rounded-2xl space-y-4'>
          <h1 className='text-slate-600 text-xl font-bold'>
            Booking Details
          </h1>
          <div className='grid gap-3 grid-cols-2'>
            <div>
              <p className='text-slate-600 font-semibold'>Booking ID</p>
              <p className='text-slate-600'>{bookingData?.booking.id}</p>
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>Holder email</p>
              <p className='text-slate-600'>{bookingData?.booking.email}</p>
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>First name</p>
              <p className='text-slate-600'>{bookingData?.booking.first_name}</p>
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>Last name</p>
              <p className='text-slate-600'>{bookingData?.booking.last_name}</p>
            </div>
            <div className='flex flex-col items-start'>
              <p className='text-slate-600 font-semibold'>Phone number</p>
              <p className='text-slate-600 font-bold px-3 rounded-lg bg-blue-100'>{`0${bookingData?.booking.tel_number}`}</p>
            </div>
            <div className='flex flex-col items-start'>
              <p className='text-slate-600 font-semibold'>Booking status</p>
              <p className='font-bold px-3 rounded-lg bg-green-200 text-slate-600'>{bookingData?.booking.status}</p>
            </div>
          </div>
        </div>
      
        <div className='w-full bg-white p-6 rounded-2xl space-y-4'>
          <h1 className='text-slate-600 text-xl font-bold'>
            Items
          </h1>
          <div className='grid gap-3 grid-cols-2'>
            <div className='flex flex-col items-start'>
              <p className='text-slate-600 font-semibold'>Check in</p>
              <p className='text-slate-600 px-3 font-bold bg-green-300 rounded-md'>{bookingData?.booking.check_in ? format(new Date(bookingData.booking.check_in), "MMMM dd, yyyy") : 'N/A'}</p>
            </div>
            <div className='flex flex-col items-start'>
              <p className='text-slate-600 font-semibold'>Check out</p>
              <p className='text-slate-600 px-3 font-bold bg-green-200 rounded-md'>{bookingData?.booking.check_out ? format(new Date(bookingData.booking.check_out), "MMMM dd, yyyy") : 'N/A'}</p>
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>Adult count</p>
              <p className='text-slate-600'>{bookingData?.booking.adultCount}</p>
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>Adult count</p>
              <p className='text-slate-600'>{bookingData?.booking.adultCount}</p>
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>Child count</p>
              <p className='text-slate-600'>{bookingData?.booking.childCount}</p>
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>Bonfire kit count</p>
              <p className='text-slate-600'>{bookingData?.booking.bonfire_kit_count}</p>
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>Tent pitching count</p>
              <p className='text-slate-600'>{bookingData?.booking.tent_pitching_count}</p>
            </div>
      
          </div>
        </div>
        { bookingData?.transaction && (
          <div className='w-full bg-white p-6 rounded-2xl space-y-4'>
            <h1 className='text-slate-600 text-xl font-bold'>
              Transaction Details
            </h1>
            <div className='flex flex-col space-y-3 items-start'>
              <div>
                <p className='text-slate-600 font-semibold'>Price</p>
                {/* Conver this into Philippine pesos. Result: P 4,000.00 */}

                <p className='text-slate-600 px-3 bg-green-400 rounded-md'>
                  {
                    new Intl.NumberFormat('en-PH', {
                      style: 'currency',
                      currency: 'PHP'
                    }).format(bookingData?.transaction.price)
                  }
                </p>
              </div>
              <div className='grid gap-3 grid-cols-2 w-full'>
                <div>
                  <p className='text-slate-600 font-semibold'>Payment method</p>
                  <p className='text-slate-600'>{bookingData?.transaction.payment_type}</p>
                </div>
                <div>
                  <p className='text-slate-600 font-semibold'>Xendit Reference ID</p>
                  <p className='text-slate-600'>{bookingData?.transaction.xendit_product_id}</p>
                </div>
              </div>
            </div>
          </div>
        ) }



      </div>
    </>
  </PageWrapper>
  )
}

export default BookingDetails