import { FaFacebookSquare } from "react-icons/fa"

const AuthenticatedFooter = () => {
  return (
    <>
        <div className='w-full flex flex-col justify-between h-full px-[30px] py-[40px] bg-[#56342A]  text-white items-center text-center space-y-6'>
            <h2 className='font-bold text-2xl'>COCONUT CAMPSITE</h2>
            {/* Facebook page */}
            <div className='flex flex-col items-center space-y-1'>
                <a href='https://www.facebook.com/profile.php?id=61558384738390' target='_blank' className='flex flex-row items-center space-x-2' rel="noreferrer">
                    <FaFacebookSquare className='text-2xl text-[#2e5dcc]'/>
                    <h3 className='text-slate-300 font-bold'>Follow us on Facebook</h3>
                </a>
                <div className='space-x-2'>
                    <span className='text-slate-300'>Address</span>
                    <span>Sitio. Kayrupa, Rodriguez, 1860 Rizal</span>
                </div>
                <div className='space-x-2'>
                    <span className='text-slate-300'>Email</span>
                    <span>dandandevera42@gmail.com</span>
                </div>
            </div>
        </div>
        <p className='text-sm text-center py-6 text-slate-400 bg-[#56342A]'>Copyright© Coconut Campsite & CDM Lakbay Team 2024 All rights reserved</p>

    </>
  )
}

export default AuthenticatedFooter