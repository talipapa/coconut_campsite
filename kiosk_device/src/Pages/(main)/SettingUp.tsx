import { Button } from 'antd'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageWrapper from './PageWrapper'
import { motion } from 'framer-motion'

const SettingUp = () => {
    const { id } = useParams()
    const navigate = useNavigate()


    return (
        <PageWrapper>
                <div className='w-full min-h-[80vh] justify-start align-top flex flex-col'>
                    <div className='flex flex-col mx-10 h-full'>
                        <div>
                            <Button type='primary' onClick={() => navigate('/dashboard')}>Back to Home</Button>
                        </div>
                        <motion.div 
                            initial={{ opacity: 0, x: 200 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -200 }}
                            className='w-full flex flex-col items-center justify-center min-h-[40vh] text-3xl font-bold'
                        >
                            {id}
                        </motion.div>
                    </div>
                </div>
        </PageWrapper>
    )
}

export default SettingUp