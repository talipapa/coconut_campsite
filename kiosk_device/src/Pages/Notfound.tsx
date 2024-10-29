import React from 'react'
import PageWrapper from './(main)/PageWrapper'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Notfound = () => {
  const navigate = useNavigate()
  return (
    <PageWrapper>
      <motion.div 
        initial={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 200 }}
        className='flex flex-col items-center'
      >
        <span className='text-xl font-bold'>404 | Page not found</span>
        <span className='text-2xl font-bold text-blue-500 cursor-pointer select-none tracking-wider' onClick={() => navigate('/dashboard')}>Return to main page</span>
      </motion.div>
    </PageWrapper>
  )
}

export default Notfound