'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { FaCampground } from "react-icons/fa6"
import { FaFacebookSquare } from "react-icons/fa"
import { Button } from 'antd'
import { useRouter } from 'next/navigation'

const NavbarLoginLinks = () => {
    const { user } = useAuth({ middleware: 'guest' })
    const { logout } = useAuth()
    const router = useRouter()

  return (
    <nav className='text-white flex-row justify-between space-x-10 hidden md:flex'>
        <div className='w-full flex flex-row items-end space-x-5'>
                <h1 className='text-2xl font-semibold'>Coconut Campsite</h1>
                <div className='flex flex-row space-x-3'>
                    <FaFacebookSquare onClick={() => window.open("https://www.facebook.com/profile.php?id=61558384738390", "_blank")}  size={30} color='#1976D2' className='hover:scale-125 transition-all '/>
                </div>
        </div>
        <div className='w-full hidden md:flex flex-row items-center justify-end space-x-12'>
            {
                user ? (
                    <>
                        <ul className='flex flex-row space-x-6 text-sm'>
                            <Link href="/" className='cursor-pointer font-semibold text-[#FFC39E]'>Home</Link>
                            <Link href="/booking" className='cursor-pointer font-semibold  hover:text-[#BC7B5C]'>Booking</Link>
                            <Link href="/account" className='cursor-pointer font-semibold hover:text-[#BC7B5C]'>Account</Link>
                        </ul>
                        <Button type='primary' color='danger' variant='solid' onClick={logout} icon={<FaCampground/>}>Logout</Button> 
                    </>
                ) : (
                    <>
                        <ul className='flex flex-row space-x-6 text-sm'>
                            <Link href="/" className='cursor-pointer font-semibold text-[#FFC39E]'>Home</Link>
                            <Link href="/login" className='cursor-pointer font-semibold  hover:text-[#BC7B5C]'>Login</Link>
                            <Link href="/register" className='cursor-pointer font-semibold hover:text-[#BC7B5C]'>Sign Up</Link>
                        </ul>
                        <Button type='primary' onClick={() => router.push("/booking")}  icon={<FaCampground/>}><span className='font-semibold'>Book Now</span></Button>
                    </>
                )
            }
        </div>
    </nav>
  )
}

export default NavbarLoginLinks