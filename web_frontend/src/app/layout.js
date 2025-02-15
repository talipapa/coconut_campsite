import { Hahmlet } from 'next/font/google'
import { ConfigProvider } from 'antd'

import '@/app/global.css'
import Script from 'next/script'

const hahmlet = Hahmlet({
    subsets: ['latin'],
    display: 'swap',
})



const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={hahmlet.className}>
            <head>
                <Script async src="https://www.googletagmanager.com/gtag/js?id=G-6TCW1QLWFS"></Script>
                <Script id="google-analytics">
                    {`window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-6TCW1QLWFS');`}
                </Script>
                <meta name="google-site-verification" content="ZecYuJerndzJMnbJkJhWNrFB6G4SE8zFpE3WfQ1EnvU" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <ConfigProvider
            theme={{
                token:{
                    colorPrimary: '#256560',
                    colorPrimaryActive: '#256560',
                    colorBgContainerDisabled: '#B3CCCA',
                    colorPrimaryBgHover: '#BC7B5C',
                    colorFillSecondary: '#BC7B5C',
                    colorBorderSecondary: '#FFC39E',
                    dangerShadow: '0 2px 0 rgba(255, 38, 5, 0.00)',
                    colorBgTextHover: '#256560',
                    borderRadius: '0.2em',
                    colorBgContainer: '#256560',
                    
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
    title: 'Coconut Campsite | Wawa Dam Camping Site - Montalban (Rodriguez) Rizal',
    description: 'Located in Sitio. Kayrupa, Rodriguez, 1860 Rizal! Coconut Campsite is a camping site which lets you experience the  camping adventure at Wawa Dam! Equipped with toilet, cooking area, vendo wifi and sari-sari store so you can enjoy your comfortable camping stay!',
}

export default RootLayout
