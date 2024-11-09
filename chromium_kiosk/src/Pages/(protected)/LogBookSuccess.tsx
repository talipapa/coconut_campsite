import React, { useEffect } from 'react'
import ProtectedMiddleware from './ProtectedMiddleware'
import PageWrapper from '../PageWrapper'
import ConfettiExplosion from 'react-confetti-explosion'
import { useNavigate } from 'react-router-dom'

const LogBookSuccess = () => {
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            navigate('/dashboard', {replace: true})
        }, 15000)
    }, [])


    return (
        <ProtectedMiddleware>
            <PageWrapper contentClass='bg-white relative'>
                <>
                    <div className="flex flex-col justify-center items-center h-full text-center">
                        <h1 className="text-3xl tracking-widest">Enjoy your stay</h1>
                        <img src="/camping.gif" alt="Success" className="w-1/2 rounded-2xl" />
                        <h1 className="text-3xl font-bold tracking-widest">Thank you for choosing our campsite!</h1>
                        <h1 className="text-3xl text-slate-400 tracking-widest">This page will be redirected in a 15 seconds....</h1>
                        <h1 className="text-3xl text-blue-600 tracking-widest mt-5 select-none transition-all ease-in-out duration-300 hover:scale-125 active:scale-105 font-bold" onClick={() => navigate('/dashboard', {replace:true})}>Return immediately</h1>
                    </div>
                    <ConfettiExplosion duration={10000} particleCount={200} force={2} width={2000} className='absolute bottom-0'/>
                </>
            </PageWrapper>
        </ProtectedMiddleware>
    )
}

export default LogBookSuccess