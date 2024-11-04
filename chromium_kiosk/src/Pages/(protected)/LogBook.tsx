import { Button } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import PageWrapper from '../PageWrapper';
import { FaSquareMinus } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

interface ICamper {
    id: number;
    name: string;
}

const LogBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campersName, setCampersName] = React.useState<ICamper[]>([]);
    const [newCamper, setNewCamper] = React.useState('');
    const [nextId, setNextId] = React.useState(4);
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const [isNewCamperAdded, setIsNewCamperAdded] = React.useState(false);

    const handleNameChange = (id: number, newName: string) => {
        setCampersName(campersName.map(camper =>
            camper.id === id ? { ...camper, name: newName } : camper
        ));
    };

    const handleDelete = (id: number) => {
        setCampersName(campersName.filter(camper => camper.id !== id));
    };

    const addCamper = () => {
        if (newCamper.trim() !== '' && campersName.length < 10) {
            setCampersName([{ id: nextId, name: newCamper }, ...campersName]);
            setNewCamper('');
            setNextId(nextId + 1);
            setIsNewCamperAdded(true);
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

    React.useEffect(() => {
        // Scroll to the top of the list whenever a new camper is added
        if (isNewCamperAdded && listRef.current) {
            listRef.current.scrollTop = 0; // Set scroll position to the top
            setIsNewCamperAdded(false);
        }
    }, [campersName, isNewCamperAdded]);

    return (
        <PageWrapper contentClass='justify-start'>
            <div className='w-full h-full flex flex-col'>
                <div className='flex flex-col mx-10 h-full space-y-6 items-start'>
                    <Button type='primary' onClick={() => navigate(-1)}>
                        <FaArrowLeft className='text-2xl' /> Back
                    </Button>
                    <div className='w-full h-full flex flex-col items-start justify-start text-3xl font-bold'>
                        <div className='w-full h-full flex flex-row gap-10 items-start'>
                            <div className='flex flex-col  bg-slate-700 p-5 rounded-xl w-[35vw]'>
                                <h1 className='text-sm font-bold text-slate-300'>Booking id</h1>
                                <h1 className='text-xl font-bold text-white'>{id}</h1>
                            </div>

                            <div className='w-full h-full relative space-y-12'>
                                <div className='h-full w-full'>
                                    <div className='flex flex-row items-center justify-between'>
                                        <h1 className='text-lg font-bold text-black uppercase'>Arrival logbook</h1>
                                        <div className='text-lg font-bold text-slate-500'>
                                            <span className='text-green-700'>{campersName.length}</span> / 10
                                        </div>
                                    </div>

                                    <div className='w-full h-[50px] items-center flex flex-row gap-7'>
                                        <input
                                            type="text"
                                            placeholder='Input full name'
                                            value={newCamper}
                                            onChange={(e) => setNewCamper(e.target.value)}
                                            className='w-full  bg-slate-100 px-4 h-full text-[1.3rem] rounded-md border-2 border-blue-700'
                                        />

                                        {
                                            campersName.length >= 10 ? (
                                                <Button
                                                    type='primary'
                                                
                                                    className=' text-xl px-16 gap-4 bg-green-700 h-full'
                                                    onClick={addCamper}
                                                >
                                                    <FaUserPlus className='text-2xl' /> Submit
                                                </Button>
                                            )
                                            :
                                                <Button
                                                    type='primary'
                                                    className='text-xl px-16 gap-4 h-full'
                                                    onClick={addCamper}
                                                    disabled={campersName.length >= 10}
                                                >
                                                    <FaUserPlus className='text-2xl' /> Add
                                                </Button>
                                        }
                                    </div>
                                </div>

                                <div className='h-full flex flex-col items-start space-y-8 w-full'>
                                    <div
                                        ref={listRef}
                                        className='flex flex-col items-start space-y-6 w-full max-h-[50vh] pr-10 overflow-y-scroll overflow-x-hidden'
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
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default LogBook;
