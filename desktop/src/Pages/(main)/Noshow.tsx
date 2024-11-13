import React, { useEffect, useState } from 'react'
import PageWrapper from './PageWrapper'
import { Breadcrumb, Button, DatePicker, Input, Modal, notification, Radio, Table } from 'antd'
import { format } from 'date-fns'
import { IBookingData } from './Scanned'
import axios from '@/utils/auth'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'

const Noshow = () => {
  const [bookingData, setBookingData] = useState<any | undefined>(undefined)
  const [perPage, setPerPage] = useState(50)
  const [currentBookingId, setCurrentBookingId] = React.useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredData, setFilteredData] = useState<any | undefined>(undefined)
  const navigate = useNavigate()
  const [openReschedule, setOpenReschedule] = useState(false);
  const [openRefund, setOpenRefund] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookingType, setBookingType] = useState<string>('daytour');
  const bookingTypeOption = [
    { label: 'Day Tour', value: 'daytour' },
    { label: 'Overnight', value: 'overnight' }
  ];


  const [api, contextHolder] = notification.useNotification();
  const openNotification = (notifType: 'success'|'error'|'warning'|'info', title: string, body: string) => {
    api.open({
      type: notifType,
      message: title,
      description: body,
      showProgress: true,
      pauseOnHover: false,
    });
  };

  const showRescheduleModal = (id: string, action: 'cancel'|'confirm') => {
    setCurrentBookingId(id)
    setOpenReschedule(true);
  };
  const showRefundModal = (id: string, action: 'cancel'|'confirm') => {
    setCurrentBookingId(id)
    setOpenRefund(true);
  };
  const showCancelModal = (id: string, action: 'cancel'|'confirm') => {
    setOpenCancel(true);
  };

  const axiosBookingAction = (id: string, action: 'confirm'|'cancel') => {
    if (action === 'confirm') {
      axios.patch(`manager/booking/action/${id}`, { action: 'confirm' })
        .then((res) => {
          setCurrentPage(1)
          fetchData()
          openNotification('success', 'Booking confirmed', 'Booking has been confirmed successfuly');
        })
        .catch((err) => {
          openNotification('error', 'System failure', `Something went wrong, ${JSON.stringify(err)}`);
          console.log(err)
        })
        
      } else {
        axios.patch(`manager/booking/cancel/${id}`, { action: 'cancel' })
        .then((res) => {
          setCurrentPage(1)
          fetchData()
          openNotification('info', 'Booking cancelled', 'Booking has successfully been cancelled!');
        })
        .catch((err) => {
          openNotification('error', 'System failure', `Something went wrong, ${JSON.stringify(err)}`);
          console.log(err)
        })
    }
  }

  const rescheduleHandleOk = () => {
    axios.patch(`manager/booking/reschedule/${currentBookingId}`, { check_in: selectedDate, booking_type: bookingType })
      .then((res) => {
        openNotification('success', 'Booking rescheduled!', 'Booking has been rescheduled successfuly');
        setOpenReschedule(false);
      })
      .catch((res) => {
        openNotification('error', 'Reschedule has failed!', 'Rescheduling has failed, please try again');
      })
      .finally(() => {
        fetchData()
      })
  };

  const rescheduleHandleCancel = () => {
    setOpenReschedule(false);
  };
  const refundHandleOk = () => {
    setOpenRefund(false);
    axios.patch(`manager/booking/refund/${currentBookingId}`)
    .then((res) => {
      openNotification('success', 'Booking has been Refunded!', 'Booking has been refunded successfuly');
      setOpenReschedule(false);
    })
    .catch((res) => {
      openNotification('error', 'Refund has been failed!', 'Refunding has failed, please try again');
    })
    .finally(() => {
      fetchData()
    })
  };

  const refundHandleCancel = () => {
    setOpenRefund(false);
  };

  const cancelHandleOk = () => {
    setOpenCancel(false);
    axiosBookingAction(currentBookingId, 'cancel')
  };

  const cancelHandleCancel = () => {
    setOpenCancel(false);
  };




  

  const generatePDF = async () => {
    window.electron.ipcRenderer.generateDataPDF(filteredData.data)
      .then((result) => {
        console.log('Result', result);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  const fetchData = () => {
    axios.get(`manager/nowshow/bookings?page=${currentPage}&per_page=${perPage}`)
      .then((res) => {
        setBookingData(res.data)
        setFilteredData(res.data)
      }
    )
      .catch((err) => {
        console.log(err)
      }
    )
  }
  useEffect(() => {
    fetchData()
  }, [currentPage, perPage])

  const tableFetchOptions = (localCurrentPage: number, localPerPage: number) => {
    setCurrentPage(localCurrentPage)
    setPerPage(localPerPage)
  }

    // Search functionality
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    const filtered = bookingData?.data.filter((booking: IBookingData) =>
      `${booking.first_name} ${booking.last_name}`.toLowerCase().includes(value.toLowerCase()) ||
      booking.email.toLowerCase().includes(value.toLowerCase()) ||
      booking.tel_number.includes(value)
    );
    setFilteredData({ ...bookingData, data: filtered });
  }
  return (
    <PageWrapper>
      <>
        <Modal
          open={openReschedule}
          title="Reschedule"
          onOk={rescheduleHandleOk}
          onCancel={rescheduleHandleCancel}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              <Button onClick={rescheduleHandleCancel} className='bg-slate-400 text-white'>Nevermind</Button>
              <Button onClick={rescheduleHandleOk} className='text-white px-12 bg-blue-500'>Reschedule</Button>
            </>
          )}
        >
            <DatePicker className="w-full h-[50px] text-[#3D736C] font-bold"
                          id="checkInDate"
                          minDate={dayjs().add(2, 'day')}
                          value={selectedDate}
                          size="large"
                          onChange={date => setSelectedDate(date)}
                          maxDate={dayjs().add(3, 'month')}
                          format="MMMM DD, YYYY"
                          // disabledDate={disabledDate}
                          // disabledTime={disabledDateTime}
                      />

            <div className="space-y-2">
                <div className="space-x-4">
                    <label htmlFor="bookingType">Booking type</label>
                    {/* <span className="text-[#555555]">Price ₱ {isCabin ? cabinPrice : "0.00"}</span> */}
                </div>
                <Radio.Group value={bookingType} onChange={event => setBookingType(event.target.value)} block options={bookingTypeOption} defaultValue="daytour" optionType="button" buttonStyle="solid" size="large" id="bookingType" />

            </div>
        </Modal>
        <Modal
          open={openRefund}
          title="Are you sure you want to Refund this booking?"
          onOk={refundHandleOk}
          onCancel={refundHandleCancel}
          footer={(_, { OkBtn, CancelBtn}) => (
            <>
              <Button onClick={refundHandleCancel} className='bg-slate-400 text-white'>Nevermind</Button>
              {_?.valueOf}
              <Button onClick={refundHandleOk} className='text-white px-12 bg-red-500'>Let's refund this</Button>
            </>
          )}
        ></Modal>
        <Modal
          open={openCancel}
          title="Are you sure you want to cancel this booking?"
          onOk={cancelHandleOk}
          onCancel={cancelHandleCancel}
          footer={(_, { OkBtn, CancelBtn}) => (
            <>
              <Button onClick={cancelHandleCancel} className='bg-slate-400 text-white'>Nevermind</Button>
              {_?.valueOf}
              <Button onClick={cancelHandleOk} className='text-white px-12 bg-red-500'>Let's cancel this</Button>
            </>
          )}
        ></Modal>
        {contextHolder}
        
        <div className='flex flex-row justify-between bg-slate-200 shadow-lg py-5 px-6 select-none'>
          <Breadcrumb>
            <Breadcrumb.Item><span className='font-semibold'>Reservations</span></Breadcrumb.Item>
            <Breadcrumb.Item><span className='font-semibold'>Successful</span></Breadcrumb.Item>
          </Breadcrumb>
          <span className='text-slate-400 text-xl'>Results: {bookingData?.total}</span>
        </div>
        
        <div className='flex flex-col px-6 py-8 overflow-x-clip max-h-[80vh] overflow-y-scroll'>
          <div className='flex flex-row gap-5'>
            <Button type='primary' onClick={generatePDF}>Generate PDF</Button>
            <Input.Search placeholder='Search here....' className='mb-5' value={searchQuery}onChange={(e) => handleSearch(e.target.value)}/>
          </div>
          
          <Table
            rowClassName='hover:bg-slate-200'
            rowHoverable={false}
            scroll={{ x: 768 }}
            dataSource={filteredData?.data}
            loading={!filteredData}
            size='small'
            pagination={{
              current: currentPage,
              position: ['topRight'],
              pageSize: bookingData?.per_page,
              showSizeChanger: true,
              total: bookingData?.total,
              onChange: (page, pageSize) => tableFetchOptions(page, pageSize)
          }}>
            <Table.Column
              title="Actions"
              key="actions"
              render={(_, record: IBookingData) => (
                <div className='flex flex-rowselect-none space-x-2'>
                  <Button onClick={() => navigate(`/booking/${record.id}`)} className='px-2 text-xs py-1 w-full text-white bg-slate-600 rounded-lg transition ease-in-out hover:scale-105'>Info</Button>
                  <Button onClick={() => showRescheduleModal(record.id, 'cancel')} className='px-2 py-1 bg-blue-600 text-white text-xs rounded-lg transition ease-in-out hover:scale-105'>Reschedule</Button>
                  {record.payment_type === 'CASH' ? (
                    <Button onClick={() => showCancelModal(record.id, 'cancel')} className='px-2 py-1 bg-red-600 text-white text-xs rounded-lg transition ease-in-out hover:scale-105'>Cancel</Button>
                  ) : (
                    <Button onClick={() => showRefundModal(record.id, 'cancel')} className='px-2 py-1 bg-red-600 text-white text-xs rounded-lg transition ease-in-out hover:scale-105'>Refund</Button>
                  )}
                </div>
              )}
            />
            <Table.Column title='Method' dataIndex='payment_type' key='payment_type' 
              filters={[
                { text: 'CASH', value: 'CASH' },
                { text: 'XENDIT', value: 'XENDIT' },
              ]}
              onFilter= {(value, record) => record.status.indexOf(value as string) === 0} 
              render={(value:string) => (
              <span className='text-xs px-3 rounded-full bg-green-400'>{value}</span>
            )} />
            <Table.Column
              title="Name"
              key="name"
              render={(_, record: IBookingData) => <span className='text-xs'>{`${record.first_name} ${record.last_name}`}</span>}
            />
            <Table.Column title='Check Out' dataIndex='check_out' key='check_out' 
              sortDirections={['ascend', 'descend']}
              sorter={(a, b) => new Date(a.check_out).getTime() - new Date(b.check_out).getTime()}
              render={(value) => (
              <div className='flex flex-col space-y-1'>
                <span className='text-xs'>{format(value, 'MMMM, dd, yyyy')}</span>
              </div>
            )} />
            <Table.Column title='Check In' dataIndex='check_in' key='check_in' 
              sorter={(a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime()}
              render={(value) => (
              <div className='flex flex-col space-y-1'>
                <span className='text-xs'>{format(value, 'MMMM dd, yyyy')}</span>
              </div>
            )} />
            <Table.Column title='Booking Type' dataIndex='booking_type' key='booking_type' 
              filters={[
                { text: 'Day Tour', value: 'daytour' },
                { text: 'Overnight', value: 'overnight' }
              ]}
              onFilter= {(value, record) => record.booking_type.indexOf(value as string) === 0} 
              render={(value:string) => (
              value === 'daytour' ? (
                <span className='bg-yellow-600 px-4 py-1 rounded-lg text-white'>Day Tour</span>
              ) : (
                <span className='bg-slate-800 px-4 py-1 rounded-lg text-white'>Overnight</span>
              ) 
            )} />
            <Table.Column title='Is Cabin' dataIndex='is_cabin' key='is_cabin' 
              filters={[
                { text: 'Yes', value: true },
                { text: 'No', value: false }
              ]}
              onFilter={(value, record) => record.is_cabin === value}
              render={(value:boolean) => (
              value ? (
                <span className='bg-green-600 px-4 rounded-lg text-white'>Yes</span>
              ) : (
                <span className='px-4 rounded-lg bg-slate-400 text-white'>No</span>
              )
            )} />
            <Table.Column title='Status' dataIndex='status' key='status' 
              filters={[
                { text: 'VERIFIED', value: 'VERIFIED' },
                { text: 'PAID', value: 'PAID' },
                { text: 'VOIDED', value: 'VOIDED' },
                { text: 'SCANNED', value: 'SCANNED' },
                { text: 'CANCELLED', value: 'CANCELLED' },
              ]}
              onFilter= {(value, record) => record.status.indexOf(value as string) === 0} 
              render={(value:string) => (
              <span className='text-xs px-3 rounded-full bg-green-400'>{value}</span>
            )} />
            <Table.Column title='Created At' dataIndex='created_at' key='created_at' 
              sorter={(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()}
              render={(value:Date) => (
              <span className='text-xs'>{format(value, 'MMM/dd/yyyy | hh:mm a')}</span>
            )} />
            <Table.Column title='Updated At' dataIndex='updated_at' key='updated_at' 
              sorter={(a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()}
              render={(value:Date) => (
              <span className='text-xs'>{format(value, 'MMM/dd/yyyy | hh:mm a')}</span>
            )} />

          </Table>
          
        </div>
      </>
    </PageWrapper>
  )
}

export default Noshow