import React, { useEffect, useState } from 'react'
import PageWrapper from './PageWrapper'
import { Breadcrumb, Button, Input, Table } from 'antd'
import { format } from 'date-fns'
import { IBookingData } from './Scanned'
import axios from '@/utils/auth'
import { useNavigate } from 'react-router'

const Successful = () => {
  const [bookingData, setBookingData] = useState<any | undefined>(undefined)
  const [perPage, setPerPage] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredData, setFilteredData] = useState<any | undefined>(undefined)
  const navigate = useNavigate()


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
    axios.get(`manager/bookings/verified?page=${currentPage}&per_page=${perPage}`)
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
                <div className='flex flex-rowselect-none'>
                 <Button onClick={() => navigate(`/booking/${record.id}`)} className='px-2 text-xs py-1 w-full text-white bg-slate-600 rounded-lg transition ease-in-out hover:scale-105'>Info</Button>
                </div>
              )}
            />
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

export default Successful