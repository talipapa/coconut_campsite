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

const SettingUp = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Initial state with incremental IDs
    const [campersName, setCampersName] = React.useState<ICamper[]>([]);
    const [newCamper, setNewCamper] = React.useState(''); // New camper input state
    const [nextId, setNextId] = React.useState(4); // Next incremental ID
    const listRef = React.useRef<HTMLDivElement | null>(null); // Ref for the scrollable list
    const [isNewCamperAdded, setIsNewCamperAdded] = React.useState(false); // Track if a new camper is added

    // Handle changing a camper's name
    const handleNameChange = (id: number, newName: string) => {
        setCampersName(campersName.map(camper =>
            camper.id === id ? { ...camper, name: newName } : camper
        ));
    };

    // Handle deleting a camper
    const handleDelete = (id: number) => {
        setCampersName(campersName.filter(camper => camper.id !== id));
    };

    // Handle adding a new camper
    const addCamper = () => {
        if (newCamper.trim() !== '' && campersName.length < 10) { // Limit to 10 campers
            setCampersName([...campersName, { id: nextId, name: newCamper }]);
            setNewCamper(''); // Clear the input field
            setNextId(nextId + 1); // Increment the ID for the next camper
            setIsNewCamperAdded(true); // Indicate that a new camper was added
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
        // Scroll to the bottom of the list whenever a new camper is added
        if (isNewCamperAdded && listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
            setIsNewCamperAdded(false); // Reset the flag after scrolling
        }
    }, [campersName, isNewCamperAdded]);

    return (
        <PageWrapper>
            <div className='w-full min-h-[80vh] justify-start align-top flex flex-col'>
                <div className='flex flex-col mx-10 h-full space-y-10'>
                    <div>
                        <Button type='primary' onClick={() => navigate(-1)} className='mb-10'>
                            <FaArrowLeft className='text-2xl' /> Back
                        </Button>
                    </div>
                    <div className='w-full flex flex-col items-center justify-start min-h-[40vh] text-3xl font-bold'>
                        <div className='w-full h-full flex flex-row gap-10 min-h-[60vh] items-start'>
                            <div className='flex flex-col items-start bg-slate-700 p-5 rounded-xl'>
                                <h1 className='text-sm font-bold text-slate-300'>Booking id</h1>
                                <h1 className='text-xl font-bold text-white'>{id}</h1>
                            </div>

                            <div className='w-full relative'>
                                <div className='flex flex-row items-center justify-between w-full absolute top-[-40px] left-0'>
                                    <h1 className='text-lg font-bold text-black uppercase'>Arrival logbook</h1>
                                    <div className='text-lg font-bold text-slate-500'>
                                        <span className='text-green-700'>{campersName.length}</span> / 10
                                    </div>
                                </div>

                                <div className='flex flex-col items-start space-y-8 top-0 absolute w-full'>
                                    <div 
                                        ref={listRef} // Attach the ref to the scrollable container
                                        className='flex flex-col items-start space-y-6 w-full max-h-[40vh] pr-10 overflow-y-scroll overflow-x-hidden'
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

                                    <div className='w-full flex flex-row gap-7'>
                                        <input
                                            type="text"
                                            placeholder='Input full name'
                                            value={newCamper}
                                            onChange={(e) => setNewCamper(e.target.value)}
                                            className='w-full bg-slate-100 px-4 py-2 text-[1.3rem] rounded-md border-2 border-blue-700'
                                        />
                                        <Button
                                            type='primary'
                                            className='py-6 text-xl px-16 gap-4'
                                            onClick={addCamper}
                                            disabled={campersName.length >= 10} // Disable if the list is full
                                        >
                                            <FaUserPlus className='text-2xl' /> Add
                                        </Button>
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

export default SettingUp;
