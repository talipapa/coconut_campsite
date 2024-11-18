import { Button, Skeleton, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import PageWrapper from '../PageWrapper';
import { FaSquareMinus } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from '../../Utils/auth';
import { FaSun } from "react-icons/fa";
import { WiMoonAltWaningCrescent4 } from "react-icons/wi";
import { IoBonfireOutline } from "react-icons/io5";
import { FaTentArrowDownToLine } from "react-icons/fa6";
import { MdOutlineCabin } from "react-icons/md";
import ProtectedMiddleware from './ProtectedMiddleware';


interface ICamper {
    id: number;
    name: string;
}

interface IReservationHolder{
    full_name: string;
}

interface population {
    adult_count: number;
    child_count: number;
    total_guest_count: number;
}

interface IBooking {
    check_in: Date;
    booking_status: string;
    booking_type: string;
    bonfire_kit_count: number;
    tent_pitching_count: number;
    has_cabin: boolean;
    cabin: {
        cabin_name: string;
        cabin_price: number;
        cabin_image: string;
    }
}

interface IAutoFillUp {
    guest_count: number;
    remaining_log_submissions: number;
    is_log_submitted: boolean;
}

interface ITransaction  {
    transaction_id: string;
    transaction_type: 'XENDIT'|'CASH';
    price: number;
    fee: number;
    transaction_status: string;
    xendit_reference: string|null;
}

interface IQrData {
    reservation_holder: IReservationHolder;
    population: population;
    booking: IBooking;
    campers: string[];
    kiosk_autofillup: IAutoFillUp;
    transaction: ITransaction;
    updated_at: Date;
    created_at: Date;
}


const LogBook = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [campersName, setCampersName] = useState<ICamper[]>([]);
    const [newCamper, setNewCamper] = useState('');
    const [nextId, setNextId] = useState(4);
    const listRef = useRef<HTMLDivElement | null>(null);
    const [isNewCamperAdded, setIsNewCamperAdded] = useState(false);
    const [formDelaySubmit, setFormDelaySubmit] = useState(5000);
    const [qrData, setQrData] = useState<IQrData|undefined>();

    const handleNameChange = (id: number, newName: string) => {
        setCampersName(campersName.map(camper =>
            camper.id === id ? { ...camper, name: newName } : camper
        ));
    };

    const handleDelete = (id: number) => {
        setCampersName(campersName.filter(camper => camper.id !== id));
    };

    const addCamper = () => {
        if (qrData) {
            if (newCamper.trim() !== '' && campersName.length < qrData?.population.total_guest_count) {
                setCampersName([{ id: nextId, name: newCamper }, ...campersName]);
                setNewCamper('');
                setNextId(nextId + 1);
                setIsNewCamperAdded(true);
            }
        }
    };

    const variants: Variants = {
        visible: (i) => ({
            x: 0,
            opacity: 1,
            transition: { type: 'spring', delay: i * 0.1 }
        }),
        hidden: { x: -50, opacity: 0 },
        exit: { x: 100, opacity: 0 }
    };


    const submitCamperName = () => {
        setIsLoading(true);
        axios.post(`/kiosk/logbook/${code}`, { camper_names: campersName.map(camper => camper.name) })
            .then((res) => {
                navigate(`/logbook/${code}/success`, {replace: true});
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
    };


    useEffect(() => {
        setIsLoading(true);
        axios.get(`/qr-code/get-booking/${code}`)
            .then((res) => {
                setQrData(res.data)
                setCampersName(res.data.campers.map((camper:string, index:number) => ({ id: index, name: camper })));
            })
            .catch((err) => {
                navigate('/dashboard', {replace: true});
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [])


    useEffect(() => {
        // Scroll to the top of the list whenever a new camper is added
        if (isNewCamperAdded && listRef.current) {
            listRef.current.scrollTop = 0; // Set scroll position to the top
            setIsNewCamperAdded(false);
        }
    }, [campersName, isNewCamperAdded]);

    if (isLoading && !qrData) {
        return (
            <PageWrapper contentClass='justify-start'>
                <div className='w-full h-full flex flex-col'>
                    <div className='flex flex-col mx-10 h-full space-y-10 items-start my-5'>
                        <FaArrowLeftLong className='text-5xl text-white transition-all duration-100 hover:scale-125 active:scale-110' onClick={() => navigate("/dashboard", {replace: true})}/>
                        <div className='w-full h-full flex flex-col items-center text-3xl font-bold'>
                            <Spin size='large' className='font-black'/>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        );
    }


    return (
        <ProtectedMiddleware>
            <PageWrapper contentClass='justify-start'>
                <div className='w-full h-full flex flex-col'>
                    <div className='flex flex-col mx-10 h-full space-y-7 items-start my-5'>
                        <FaArrowLeftLong className='text-4xl text-white transition-all duration-100 hover:scale-125 active:scale-110' onClick={() => navigate("/dashboard", {replace: true})}/>
                        <div className='w-full h-full flex flex-col items-start justify-start text-3xl font-bold'>
                            <div className='w-full h-full flex flex-col gap-10 items-start'>
                                <div className='w-full h-full relative space-y-12'>
                                    <div className='h-full w-full'>
                                        <div className='flex flex-row items-center justify-between mb-3'>
                                            <h1 className='text-lg font-bold text-white uppercase'>Arrival logbook</h1>
                                            <div className='text-lg font-bold text-[#B3CCCA]'>
                                                <span className='text-green-500'>{campersName.length}</span> / {qrData?.population.total_guest_count}
                                            </div>
                                        </div>

                                        {qrData && (
                                            <div className='w-full h-[50px] items-center flex flex-row gap-7'>
                                                {
                                                    campersName.length >= qrData?.population.total_guest_count ? (
                                                        <Button
                                                            type='primary'
                                                            loading={isLoading}
                                                            className=' text-xl px-6 w-[50%] gap-4 bg-green-500 text-black h-full'
                                                            onClick={submitCamperName}
                                                        >
                                                            <FaUserPlus className='text-2xl' /> Submit
                                                        </Button>
                                                    )
                                                    :
                                                        <Button
                                                            type='primary'
                                                            className='text-xl w-[25%] px-6 gap-4 h-full'
                                                            onClick={addCamper}
                                                            loading={isLoading}
                                                            disabled={campersName.length >= 10}
                                                        >
                                                            <FaUserPlus className='text-2xl' /> Add
                                                        </Button>
                                                }
                                                <input
                                                    type="text"
                                                    placeholder='Input full name'
                                                    value={newCamper}
                                                    onChange={(e) => setNewCamper(e.target.value)}
                                                    className='w-full  bg-slate-100 px-4 h-full text-[1.3rem] rounded-md border-2 border-blue-700'
                                                />
                                            </div>
                                        )}

                                    </div>

                                    <div className='h-full flex flex-col items-start space-y-8 w-full'>
                                        <div
                                            ref={listRef}
                                            className='flex flex-col items-start space-y-6 w-full max-h-[50vh] pr-3 lg:pr-10 overflow-y-scroll overflow-x-hidden'
                                        >
                                            <AnimatePresence mode='popLayout'>
                                                {campersName.map((camper, index) => (
                                                    <motion.div
                                                        key={camper.id}
                                                        layout
                                                        variants={variants}
                                                        custom={index}
                                                        initial='hidden'
                                                        animate='visible'
                                                        exit='exit'
                                                        className='flex flex-row items-center justify-between w-full gap-10 select-none'
                                                    >
                                                        <input
                                                            className='w-full bg-slate-100 px-4 py-2 text-[1.3rem] rounded-md border-2 border-slate-500'
                                                            value={camper.name}
                                                            onChange={(e) => handleNameChange(camper.id, e.target.value)}
                                                        />
                                                        <FaSquareMinus
                                                            className='text-[50px] text-red-500 hover:scale-125 active:scale-105 transition-all duration-100'
                                                            onClick={() => handleDelete(camper.id)}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col w-full space-y-3'>
                                    <div className='bg-[#B68E65]  p-5 rounded-xl space-y-3 flex flex-col items-center text-center'>
                                        <div>
                                            <h1 className='text-sm font-bold text-black'>Price</h1>
                                            <h1 className='text-2xl font-bold text-green-600 bg-slate-900 rounded-full px-9'>P {(qrData?.transaction.price)}</h1>
                                        </div>
                                        <div>
                                            <h1 className='text-sm font-bold text-black'>Payment method</h1>
                                            <h1 className='text-2xl font-bold text-black'>{qrData?.transaction.transaction_type}</h1>
                                        </div>
                                    </div>
                                    <div className='bg-[#D7BA89] p-5 rounded-xl space-y-3 flex flex-col items-center text-center'>
                                            <div className='flex flex-col items-center'>
                                                {qrData?.booking.booking_type === 'daytour' ? (
                                                    <div className='bg-yellow-400 rounded-full px-5 flex items-center flex-row justify-center space-x-3'>
                                                        <FaSun className='text-lg'/>
                                                        <span className='text-lg'>Day tour</span>
                                                    </div>
                                                ) : (
                                                    <div className='bg-slate-900 text-slate-100 rounded-full px-5 flex items-center flex-row justify-center space-x-3'>
                                                        <WiMoonAltWaningCrescent4 className='text-lg'/>
                                                        <span className='text-lg'>Overnight</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='grid grid-cols-2 gap-x-10 gap-y-4'>
                                                <div className='space-y-1'>
                                                    <h1 className='text-sm font-bold text-black'>Total Campers</h1>
                                                    <div className='flex flex-row items-start space-x-3'>
                                                        <FaUserPlus className='text-md text-green-800'/>
                                                        <h1 className='text-2xl font-bold text-black'>{qrData?.population.total_guest_count}</h1>
                                                    </div>
                                                </div>
                                                <div className='space-y-1'>
                                                    <h1 className='text-sm font-bold text-black'>Bonfire kit</h1>
                                                    <div className='flex flex-row items-start space-x-3'>
                                                        <IoBonfireOutline className='text-md text-orange-400'/>
                                                        <h1 className='text-2xl font-bold text-black'>{qrData?.booking.bonfire_kit_count}</h1>
                                                    </div>
                                                </div>
                                                <div className='space-y-1'>
                                                    <h1 className='text-sm font-bold text-black'>Tent pitch</h1>
                                                    <div className='flex flex-row items-end space-x-3'>
                                                        <FaTentArrowDownToLine className='text-md text-blue-400'/>
                                                        <h1 className='text-2xl font-bold text-black'>{qrData?.booking.tent_pitching_count}</h1>
                                                    </div>
                                                </div>
                                                <div className='space-y-1'>
                                                    <h1 className='text-sm font-bold text-black'>Cabin?</h1>
                                                    <div className='flex flex-row items-end space-x-3'>
                                                        {qrData?.booking.has_cabin ? (
                                                            <>
                                                                <MdOutlineCabin className='text-md text-green-600'/>
                                                                <h1 className='text-2xl font-bold text-black'>YES</h1>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MdOutlineCabin className='text-md text-red-600'/>
                                                                <h1 className='text-2xl font-bold text-black'>NO</h1>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
       
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        </ProtectedMiddleware>
    );
};

export default LogBook;
