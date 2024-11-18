'use client'

import { useAuth } from '@/hooks/auth'
import React from 'react'
import Link from 'next/link'
import { FaCampground } from 'react-icons/fa'
import { FaFacebookSquare } from 'react-icons/fa'
import { Button, Skeleton } from 'antd'
import { usePathname } from 'next/navigation'
import { useLaravelBooking } from '@/hooks/booking'
import Image from 'next/image'

const AuthenticatedNavbar = ({user}) => {
  const { logout } = useAuth() 
  const { booking, error } = useLaravelBooking({routeLink: '/api/v1/booking-check'})

  const pathName = usePathname()

  if (!booking && !error) {
    return (
        <nav className='bg-[#56342A] text-white p-[30px] flex flex-row justify-between space-x-10'>
            <div className='w-full flex flex-row md:flex-row-reverse items-center justify-between gap-4 md:justify-end space-x-5'>
                    <a href='/' className='text-2xl font-semibold'>Coconut Campsite</a>
                    <Image src='/logo.png' width={30} height={30} alt='logo'/>
            </div>
            <div className='w-full hidden md:flex flex-row items-center justify-end space-x-12'>
                <Skeleton.Input/>
                {user ? (
                <Button color='danger' variant='solid' onClick={logout} icon={<FaCampground/>}>Logout</Button> 

                ) : <Skeleton.Input/>}
            </div>
        </nav>
    )
  }

  return (
    <nav className='bg-[#56342A] text-white p-[30px] flex flex-row justify-between space-x-10 '>
        <div className='w-full flex flex-row md:flex-row-reverse items-center justify-between gap-4 md:justify-end space-x-5'>
                <a href='/' className='text-2xl font-semibold'>Coconut Campsite</a>
                <Image src='/logo.png' width={50} height={50} alt='logo'/>
        </div>
        <div className='w-full hidden md:flex flex-row items-center justify-end space-x-12'>
            <ul className='flex flex-row space-x-6 text-sm'>
                <Link href="/" className={`cursor-pointer font-semibold ${pathName === "/" ? 'text-[#ffffff]' : ""}`}>Home</Link>
                {
                    !error ? (
                        <Link href="/view-booking" className={`cursor-pointer font-semibold ${pathName === "/view-booking" ? 'text-[#98f7f0]' : ""}`}>View Booking </Link>
                    ) : (
                        <Link href="/booking" className={`cursor-pointer font-semibold ${pathName === "/booking" ? 'text-[#98f7f0]' : ""}`}>Booking</Link>
                    )
                }
                <Link href="/account" className={`cursor-pointer font-semibold ${pathName === "/account" ? 'text-[#98f7f0]' : ""}`}>Account</Link>
            </ul>
            {user ? (
              <Button color='danger' variant='solid' onClick={logout} icon={<FaCampground/>}>Logout</Button> 

            ) : <Skeleton.Input/>}
        </div>
    </nav>
  )
}

export default AuthenticatedNavbar