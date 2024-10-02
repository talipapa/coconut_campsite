'use client'

import { useAuth } from '@/hooks/auth'
import React from 'react'
import Link from 'next/link'
import { FaCampground } from 'react-icons/fa'
import { FaFacebookSquare } from 'react-icons/fa'
import { Button } from 'antd'
import { usePathname } from 'next/navigation'

const AuthenticatedNavbar = ({user, currentPath}) => {
  const { logout } = useAuth() 

  const pathName = usePathname()
  console.log(usePathname())
  return (
    <nav className='bg-[#855139] p-[30px] text-white flex flex-row justify-between space-x-10 '>
        <div className='w-full flex flex-row items-end space-x-5'>
                <h1 className='text-2xl font-semibold'>Coconut Campsite</h1>
                <div className='flex flex-row space-x-3'>
                    <FaFacebookSquare onClick={() => window.open("https://www.facebook.com/profile.php?id=61558384738390", "_blank")}  size={30} color='#0866FF' className='hover:scale-125 transition-all '/>
                </div>
        </div>
        <div className='w-full hidden md:flex flex-row items-center justify-end space-x-12'>
            <ul className='flex flex-row space-x-6 text-sm'>
                <Link href="/" className={`cursor-pointer font-semibold ${pathName === "/" ? 'text-[#FFC39E]' : ""}`}>Home</Link>
                <Link href="/booking" className={`cursor-pointer font-semibold ${pathName === "/booking" ? 'text-[#FFC39E]' : ""}`}>Booking</Link>
                <Link href="/account" className={`cursor-pointer font-semibold ${pathName === "/account" ? 'text-[#FFC39E]' : ""}`}>Account</Link>
            </ul>
            <Button color='danger' variant='solid' onClick={logout} icon={<FaCampground/>}>Logout</Button> 
        </div>
    </nav>
  )
}

export default AuthenticatedNavbar