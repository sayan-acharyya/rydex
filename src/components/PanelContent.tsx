'use client'
import { Bike, Car, Clock, IndianRupee, MessageCircle, Phone, Truck, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { AnimatePresence, motion } from "motion/react"
import RideChat from './RideChat'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'


const PanelContent = ({ isActive, displayDistance, displayEta, cfg, status, booking, paymentStatus, canChat, chatOpen, onChatToggle, currentRole }: any) => {


    const getVehicleIcon = (vehicleType?: string) => {
        switch (vehicleType?.toLowerCase()) {
            case "bike":
                return <Bike size={18} className=" text-white" />;

            case "auto":
                return <Car size={18} className=" ttext-white" />; // Replace with Auto icon if available

            case "truck":
                return <Truck size={18} className=" text-white" />;

            case "loading":
                return <Truck size={18} className=" text-white" />;
            case "car":
            default:
                return <Car size={18} className=" text-white" />;
        }
    };

    const callNumber =
        currentRole === "driver"
            ? booking?.userMobileNumber
            : booking?.driverMobileNumber;


    return (
        <div className='flex flex-col pt-5 pb-4 gap-3'>
            {isActive && (
                <div className='mx-5 lg:mx-6 grid grid-cols-2 gap-2'>
                    <div className='bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0'>
                            <Clock size={16} className='text-zinc-600' />
                        </div>
                        <div>
                            <p className='text-[10px] text-zinc-400 uppercase tracking-wider font-semibold'>
                                ETA
                            </p>
                            <p className='text-lg font-black text-zinc-900 leading-none mt-0.5'>
                                {Math.round(displayEta)} <span>min</span></p>
                        </div>
                    </div>

                    <div className='bg-zinc-950 rounded-2xl p-4 flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0'>
                            <IndianRupee size={16} className='text-white' />
                        </div>
                        <div>
                            <p className='text-[10px] text-zinc-500 uppercase tracking-wider font-semibold'>
                                Fare
                            </p>
                            <p className='text-lg font-black text-white leading-none mt-0.5'>
                                {booking.fare || "-"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {booking?.user && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='mx-5 lg:mx-6'
                >
                    <div className='bg-zinc-950 rounded-2xl p-4 flex items-center gap-4'>
                        <div className='relative  shrink-0'>
                            <div className='w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center'>
                                <User size={26} className='text-zinc-300' />
                            </div>
                            <div className='absolute -bottom-1 -right-1 bg-emerald-400 w-4 h-4 
                          rounded-full border-2 border-zinc-950'/>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between gap-2'>
                                <p className='text-white font-bold text-base truncate'>
                                    {currentRole === "driver" ? (
                                        <>
                                            <span className='text-zinc-400'>Booked By</span>
                                            <span className='mx-2 text-zinc-500'>•</span>
                                            {booking?.user?.name || "Customer"}
                                        </>
                                    ) : (
                                        <>
                                            <span className='text-zinc-400'>Driver</span>
                                            <span className='mx-2 text-zinc-500'>•</span>
                                            {booking?.driver?.name || "Driver"}
                                        </>
                                    )}
                                </p>
                                <div className='flex items-center gap-1 bg-white/10 px-2 py-1
                                rounded-full shrink-0'>
                                    <IndianRupee size={10} className='text-amber-400' />
                                    <span className='text-white text-xs font-semibold'>
                                        {booking.fare}
                                    </span>
                                </div>
                            </div>
                            {booking.paymentStatus && (
                                <div className='flex items-center gap-2 mt-1.5'>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                                        ${paymentStatus.cls ?? "bg-zinc-700 text-zinc-300 "}`}>
                                        {paymentStatus.label}
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>

                    {isActive && (
                        <div className='flex gap-2 mt-2 mx-1'>
                            {callNumber && (
                                <a
                                    href={`tel:${callNumber}`}
                                    className={`flex items-center justify-center gap-2 bg-zinc-100
        hover:bg-zinc-200 active:scale-[0.97] transition-all text-zinc-900 py-3
        rounded-xl text-sm font-semibold ${canChat ? "flex-1" : "w-full"}`}
                                >
                                    <Phone size={15} />
                                    Call
                                </a>
                            )}
                            {canChat && (
                                <button
                                    onClick={onChatToggle}
                                    className={`flex-1 flex items-center justify-center gap-2
                        active:scale-[0.97] transition-all py-3 rounded-xl text-sm font-semibold 
                        ${chatOpen ? "bg-zinc-200 text-zinc-900 " : "bg-zinc-900 hover:bg-zinc-800 text-white"}`}>
                                    <MessageCircle size={15} />
                                    {chatOpen ? "Close Chat" : "Message"}
                                </button>
                            )}
                        </div>
                    )}


                </motion.div>
            )}

            <AnimatePresence>
                {chatOpen && canChat && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className='mx-5 lg:mx-6 overflow-hidden'
                    >
                        <div className='rounded-2xl overflow-hidden border border-zinc-100 h-115 '>

                            <RideChat
                                currentRole={currentRole}
                                bookingId={booking._id}
                                userName={booking?.user?.name || "Customer"}
                                driverName={booking?.driver?.name || "Driver"}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {booking?.vehicle && (
                <div className='mx-5 lg:mx-6'>
                    <div className='bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex items-center gap-3'>
                        <div className='w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0'>
                            {getVehicleIcon(booking.vehicle.type)}
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-[10px] text-zinc-400 uppercase tracking-wider font-semibold'>
                                {currentRole === "driver" ? "Your Vehicle" : "Assigned Vehicle"}
                            </p>
                            <p className='text-sm font-bold text-zinc-900 truncate'>
                                {booking.vehicle.vehicleModel ?? "Vehicle"}
                            </p>
                        </div>
                        <div className='shrink-0 bg-zinc-900 px-3 py-1.5 rounded-lg'>
                            <p className='text-white text-xs font-black tracking-widest font-mono'>{booking.vehicle.number ?? "number"}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-5 lg:mx-6">
                <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden p-4">

                    {/* Pickup */}
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center shrink-0 pt-1">
                            <div className="w-3.5 h-3.5 rounded-full bg-black border-2 border-white shadow" />
                            <div className="w-0.5 h-10 bg-zinc-300 mt-1" />
                        </div>

                        <div className="flex-1 min-w-0 pb-4">
                            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.15em]">
                                Pick Up
                            </p>

                            <p className="mt-1 text-sm text-zinc-800 leading-relaxed break-words">
                                {booking?.pickUpAddress}
                            </p>
                        </div>
                    </div>

                    {/* Drop */}
                    <div className="flex gap-4   border-zinc-100 pt-4">
                        <div className="flex flex-col items-center shrink-0 pt-1">
                            <div className="w-3.5 h-3.5 rounded-full bg-black border-2 border-white shadow" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.15em]">
                                Drop
                            </p>

                            <p className="mt-1 text-sm text-zinc-800 leading-relaxed break-words">
                                {booking?.dropAddress}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default PanelContent;




