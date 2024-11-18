import React from 'react'
import Link from 'next/link'
import { FaCampground } from 'react-icons/fa'
import { FaFacebookSquare } from 'react-icons/fa'
import { Button, Skeleton } from 'antd'
import { usePathname, useRouter } from 'next/navigation'

const PublicNavbar = () => {
    const pathName = usePathname()
    const router = useRouter()
    return (
        <nav className='bg-[#56342A] p-[30px] text-white flex flex-row justify-between w-full'>
            <div className='w-full flex flex-row items-end space-x-5'>
                    <a href='/' className='text-2xl font-semibold'>Coconut Campsite</a>
                    <div className='flex flex-row space-x-3'>
                        <FaFacebookSquare onClick={() => window.open("https://www.facebook.com/profile.php?id=61558384738390", "_blank")}  size={30} color='#0866FF' className='hover:scale-125 transition-all '/>
                    </div>
            </div>
            <div className='w-full hidden md:flex flex-row items-center justify-end space-x-12'>
                <ul className='flex flex-row space-x-6 text-sm'>
                    <Link href="/" className={`cursor-pointer font-semibold ${pathName === "/" ? 'text-[#FFC39E]' : ""}`}>Home</Link>
                    <Link href="/login" className={`cursor-pointer font-semibold ${pathName === "/" ? 'text-[#FFC39E]' : ""}`}>Login</Link>
                    <Link href="/register" className={`cursor-pointer font-semibold ${pathName === "/" ? 'text-[#FFC39E]' : ""}`}>Register</Link>

                </ul>
                <Button type='primary' onClick={() => router.push("/booking")}  icon={<FaCampground/>}><span className='font-semibold'>Book Now</span></Button>

            </div>
        </nav>
    )
}

export default PublicNavbar