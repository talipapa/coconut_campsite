'use client'

import { useAuth } from '@/hooks/auth'
import Loading from '@/app/(app)/Loading'
import AuthenticatedNavbar from './AuthenticatedNavbar'
import { ConfigProvider } from 'antd'
import AuthenticatedFooter from './AuthenticatedFooter'
import { useLaravelBooking } from '@/hooks/booking'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const { booking } = useLaravelBooking()

    if (!user && !booking) {
        return <Loading/>
    }

    return (
        <ConfigProvider
        theme={{
            token:{
                colorPrimary: '#256560',
                colorPrimaryActive: '#256560',
                colorPrimaryBgHover: '#BC7B5C',
                colorFillSecondary: '#BC7B5C',
                colorBorderSecondary: '#FFC39E',
                dangerShadow: '0 2px 0 rgba(255, 38, 5, 0.00)',
            
            borderRadius: '0.2em',

                // Alias Token
                colorBgContainer: '#f6ffed',
            },
            
            components: {
                Carousel: {
                    arrowSize: 40,
                },
            }
        }}
        >
            <div className="min-h-screen bg-gray-100">
                <AuthenticatedNavbar user={user} />

                <main className='min-h-screen'>
                    {children}    
                </main>

                <AuthenticatedFooter />
            </div>
        </ConfigProvider>  
    )
}

export default AppLayout
