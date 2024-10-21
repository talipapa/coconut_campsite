'use client'

import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'
import AuthenticatedFooter from '../(app)/AuthenticatedFooter'
import PublicNavbar from './PublicNavbar'

const Layout = ({ children }) => {
    return (
        <div>
            <PublicNavbar />
            <div className="text-gray-900 antialiased">
                <AuthCard>
                    {children}
                </AuthCard>
            </div>
            <AuthenticatedFooter />
        </div>
    )
}

export default Layout
