"use client"

import { Button, Image as AntImage, Carousel } from 'antd'
import { BsBasketFill } from "react-icons/bs"
import { MdOutlinePets } from "react-icons/md"
import { IoPricetags } from "react-icons/io5"
import Footer from '@/components/LargeComponents/Footer'
import NavbarLoginLinks from './NavbarLoginLinks'
import { usePrice } from '@/hooks/prices'
import Image from 'next/image'
import { PiCookingPotFill } from "react-icons/pi";
import { Parallax, Background } from 'react-parallax';




// Margin is 30px on sides, top is 500px on top and bottom
// The provider should be pasted in other group links as well.

// Color scheme

// 60-30-10 rule
// 10 = #256560
// 30 = #BC7B5C, #FFC39E
// 60 = #F2F2F2

// Inactive font color = #555555


const Home = () => {

    const { adultPrice, childPrice, tentPitchPrice, bonfireKitPrice, cabinPrice } = usePrice()

    return (
        <div className="bg-[#F2F2F2] min-h-[1600px] overflow-hidden absolute top-[-30px]">
            {/* <LoginLinks /> */}
            {/* Hero */}
            <Parallax bgImage={"/img/banner-dim.jpg"} strength={500} bgClassName="top-[-300px]">
                <div className='h-[70vh] w-full flex flex-col items-center'>
                    <div className='w-full flex flex-col justify-between h-full px-[30px] py-[40px]'>
                        <div className='flex flex-col items-center justify-center h-full space-y-5'>
                            <div className='flex flex-col items-center justify-center space-y-1'>
                                <h1 className='text-4xl w-full text-center font-bold tracking-widest text-white'>Welcome to <span className='text-[#FFC39E]'>Coconut</span> Campsite</h1>
                                <p className='text-white text-lg'>"Be the most alive among the Trees"</p>
                            </div>
                            <Button type='primary' href='/booking' className='font-semibold py-4 px-6'>Make Reservation</Button>
                        </div>
                        {/* Nav bar */}
                        <NavbarLoginLinks/>
                    </div>
                </div>
            </Parallax>

            {/* <nav className='relative'>
                <div className='h-[100vh] max-h-[600px] w-full overflow-hidden z-[-5]'>
                    <ParallaxBanner speed={-200} translateY={[-100, 10]}>
    
                            <img src="/img/banner-dim.jpg" alt="hero" quality={100} fill={true} className="object-cover w-full" />
                    </ParallaxBanner>
                </div>
                <div className='top-0 left-0 absolute w-full h-full text-center'>
                    <div className='w-full flex flex-col justify-between h-full px-[30px] py-[40px]'>
                        <div className='flex flex-col items-center justify-center h-full space-y-5'>
                            <div className='flex flex-col items-center justify-center space-y-1'>
                                <h1 className='text-4xl font-bold tracking-widest text-white'>Welcome to <span className='text-[#FFC39E]'>Coconut</span> Campsite</h1>
                                <p className='text-white text-lg'>"Be the most alive among the Trees"</p>
                            </div>
                            <Button type='primary' href='/booking' className='font-semibold py-4 px-6'>Make Reservation</Button>
                        </div>
                        <NavbarLoginLinks/>
                    </div>
                </div>
            </nav>
                */}


            {/* Main wrapper */}
            <main className='w-full h-full'>
                {/* Marginized */}
                <section className='py-[60px] px-[30px] flex flex-col md:flex-row justify-between items-center w-full h-full space-x-12'>
                    <div className='w-full h-full flex flex-col text-center md:text-left md:items-left md:space-y-3'>
                        <h2 className='text-2xl font-extrabold text-[#BC7B5C]'>Welcome to Coconut Campsite</h2>
        
                        <p className='w-[90%] text-xl tracking-wide'>Experience the ultimate camping adventure at Wawa Dam! Just steps away from the stunning Karugo Falls and the hidden Secret River, your perfect nature escape awaits!. The campsite is equipped with toilet, cooking area, vendo wifi and sari-sari store.</p>
                    </div>

                    <div className='w-full h-full hidden md:block'>
                        <div className="relative w-full h-[500px]">
                            <Image src="/img/image1.jpg" alt="campsite" fill={true} sizes="100vw" className="object-cover"/>
                        </div>
                    </div>
                </section>

                <section className='py-[60px] md:px-[30px] xl:px-[100px] flex flex-col justify-between w-full min-h-[450px] space-y-10 bg-[rgba(83,54,35,0.13)]'>
                    <div className='flex flex-col items-center'>
                        <h3 className='text-md font-semibold text-[#BC7B5C]'>FEATURES</h3>
                        <h2 className='text-2xl font-bold'>What we offer!</h2>
                    </div>

                    <div className='h-full w-full space-y-3 md:space-y-0 md:space-x-12 flex flex-col md:flex-row justify-between items-start'>
                        <div className='bg-[#F2F2F2] w-full md:min-h-[300px] px-[30px] py-[20px] flex flex-col items-center space-y-4 text-center shadow-md'>
                            <div className='flex flex-col items-center space-y-2'>
                                <BsBasketFill fontSize={40}/>
                                <h2 className='text-md font-bold text-[#555555]'>Amenities</h2>
                            </div>

                            <p>A Sari-Sari store equipped with Vendo WiFi right inside the campsite.
                            So you can stay connected while relaxing with the nature!</p>
                        </div>
                        <div className='bg-[#F2F2F2] w-full md:min-h-[300px] px-[30px] py-[20px] flex flex-col items-center space-y-4 text-center shadow-md'>
                            <div className='flex flex-col items-center space-y-2'>
                                <MdOutlinePets fontSize={40}/>
                                <h2 className='text-md font-bold text-[#555555]'>Pet friendly adventure!</h2>
                            </div>

                            <p>Pets are allowed in and out of the campsite! So you can adventure with your Pets!</p>
                        </div>
                        <div className='bg-[#F2F2F2] w-full md:min-h-[300px] px-[30px] py-[20px] flex flex-col items-center space-y-4 text-center shadow-md'>
                            <div className='flex flex-col items-center space-y-2'>
                                <PiCookingPotFill fontSize={40}/>
                                <h2 className='text-md font-bold text-[#555555]'>Kitchen</h2>
                            </div>

                            <p>The campsite are equipped with tables, chairs, kitchen area and night lamps. Cooking equipment and utensils are free to use in case you forgot yours.</p>
                        </div>
                    </div>
            
    
                </section>

                <section className='py-[60px] md:px-[30px] xl:px-[100px] flex flex-col items-center w-full min-h-[450px] space-y-10'>
                    <div className='flex flex-col items-center'>
                        <h3 className='text-md font-semibold text-[#BC7B5C]'>PRICES</h3>
                        <h2 className='text-2xl font-bold'>Usage fee</h2>
                    </div>

                    <div className='flex flex-col space-y-10 items-center justify-center'>
                        <div className='flex flex-col space-y-1 items-center justify-center'>
                            <h3 className='text-[#555555]'>Essential Cost</h3>
                            <table className="border-collapse w-[500px] table-fixed">
                                <tbody className='text-center'>
                                    <tr>
                                        <td className="border-2 border-slate-600">Adult</td>
                                        <td className="border-2 border-slate-600">₱ {adultPrice}</td>
                                    </tr>
                                    <tr>
                                        <td scope='col' className="border-2 border-slate-600">Children</td>
                                        <td scope='col' className="border-2 border-slate-600">₱ {childPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className='flex flex-col space-y-1 items-center justify-center'>
                            <h3 className='text-[#555555]'>Add Ons</h3>
                            <table className="border-collapse border-2 border-slate-600 w-[500px] table-fixed">
                                <tbody className='text-center '>
                                    <tr>
                                        <td className="border-2 border-slate-600">Tent pitching</td>
                                        <td className="border-2 border-slate-600">₱ {tentPitchPrice}</td>
                                    </tr>
                                    <tr>
                                        <td className="border-2 border-slate-600">Cabin (4-5 person)</td>
                                        <td className="border-2 border-slate-600">₱ {cabinPrice}</td>
                                    </tr>
                                    <tr>
                                        <td className="border-2 border-slate-600">Bonfire kit</td>
                                        <td className="border-2 border-slate-600">₱ {bonfireKitPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className='flex flex-col space-y-1 items-center justify-center'>
                            <h3 className='text-[#555555]'>Others</h3>
                            <table className="border-collapse border-2 border-slate-600 w-[500px] table-fixed">
                                <tbody className='text-center '>
                                    <tr>
                                        <td className="border-2 border-slate-600">Water</td>
                                        <td className="border-2 border-slate-600">FREE</td>
                                    </tr>
                                    <tr>
                                        <td className="border-2 border-slate-600">Comfort room / Toilet</td>
                                        <td className="border-2 border-slate-600">FREE TO USE</td>
                                    </tr>
                                    <tr>
                                        <td className="border-2 border-slate-600">Night lamps</td>
                                        <td className="border-2 border-slate-600">FREE TO USE</td>
                                    </tr>
                                    <tr>
                                        <td className="border-2 border-slate-600">Wooden tables</td>
                                        <td className="border-2 border-slate-600">FREE TO USE</td>
                                    </tr>
                                    <tr>
                                        <td className="border-2 border-slate-600">Wooden chairs</td>
                                        <td className="border-2 border-slate-600">FREE TO USE</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
            
    
                </section>

                <section className='bg-[rgba(83,54,35,0.13)] py-[60px] md:px-[30px] xl:px-[100px] flex flex-col items-center w-full min-h-[450px] space-y-10'>
                    <div className='flex flex-col items-center text-center'>
                        <h3 className='text-md font-semibold text-[#BC7B5C]'>GALLERY</h3>
                        <h2 className='text-2xl font-bold'>Check out the gallery to learn more about Coconut Campsite</h2>
                    </div>

                    <div className=' min-h-[300px] w-full flex flex-col justify-between space-y-12 items-start'>
                        <div className='hidden md:block columns-1 md:columns-3'>
                            <AntImage  src="/img/gallery/gallery1.jpg" />
                            <AntImage src="/img/gallery/gallery2.jpg" />
                            <AntImage src="/img/gallery/gallery3.jpg" />
                            <AntImage  src="/img/gallery/gallery4.jpg" />
                            <AntImage  src="/img/gallery/gallery5.jpg" />
                            <AntImage src="/img/gallery/gallery3.jpg" />
        
                        </div>
                    </div>
                </section>


                <Parallax bgImage={"/img/gallery/gallery3.jpg"} strength={400}  bgClassName='top-[-200px]'>
                    <div className='h-[60vh] w-full flex flex-col items-center justify-center bg-[#000000ac] text-white space-y-5'>
                        <div className='text-center flex flex-col items-center justify-center'>
                            <h3 className='font-bold tracking-wider text-md text-[#BC7B5C]'>RESERVATION</h3>
                            <h3 className='font-bold text-2xl'>Plan your camping today!</h3>
                        </div>
                        <Button href='/booking' type='primary' className='px-10 py-5 text-lg'>Make a reservation</Button>
                    </div>
                </Parallax>
                {/* <section className='relative'>
                    <div className="w-full h-[400px]">
                        <Image src="/img/gallery/gallery3.jpg" fill={true}  className='object-cover object-center'/>
                    </div>

                </section> */}

                <section className='py-[60px] md:px-[30px] xl:px-[100px] flex flex-col items-center w-full min-h-[450px] space-y-10'>
                    <div className='flex flex-col items-center text-center'>
                        <h3 className='text-md font-semibold text-[#BC7B5C]'>ACCESS</h3>
                        <h2 className='text-2xl font-bold'>Easily accessible via foot</h2>
                    </div>

                    <div className='w-full h-full'>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13607.431373242382!2d121.18812472764765!3d14.72558446589735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397bda85647cc8f%3A0xbd1a2f816c06b4c6!2sCoconut%20Campsite!5e0!3m2!1sen!2sph!4v1727672350142!5m2!1sen!2sph" width="100%" height="500px" allowfullscreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    </div>
                </section>
            </main>

            <Footer/>


        </div>
    )
}

export default Home
