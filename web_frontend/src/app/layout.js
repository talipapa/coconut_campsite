import { Hahmlet } from 'next/font/google'
import { ConfigProvider } from 'antd'

import '@/app/global.css'

const hahmlet = Hahmlet({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={hahmlet.className}>
            <ConfigProvider
            theme={{
                token:{
                    colorPrimary: '#256560',
                    colorPrimaryActive: '#5CBCB6',
                    colorPrimaryBgHover: '#BC7B5C',
                    colorFillSecondary: '#BC7B5C',
                    colorBorderSecondary: '#FFC39E',
                    dangerShadow: '0 2px 0 rgba(255, 38, 5, 0.00)',
                    colorBgTextHover: '#5CBCB6',
                    borderRadius: '0.2em',
                    colorBgContainer: '#f6ffed',
                    
                },
                
                
                components: {
                    Carousel: {
                        arrowSize: 40,
                    },
                    Breadcrumb:{
                        linkHoverColor: '#ffffff',
                    }
                }
            }}
            >
                <body className="antialiased">
                    {children}
                </body>
            </ConfigProvider>
        </html>
    )
}

export const metadata = {
    title: 'Coconut Campsite',
}

export default RootLayout
