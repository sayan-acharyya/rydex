'use client'
import LiveRideMap from '@/components/LiveRideMap';
import { BookingStatus, IBooking, PaymentStatus } from '@/models/booking.model';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Car, ChevronUp, KeyRound, MapPin, Navigation, Radio, Zap } from 'lucide-react';
import PanelContent from '@/components/PanelContent';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';
import CompletedScreen from '@/components/CompletedScreen';
import Link from 'next/link';

const MAP_STATUS: Record<
    BookingStatus,
    "arriving" | "ongoing" | "completed"
> = {
    idle: "arriving",
    requested: "arriving",
    awaiting_payment: "arriving",
    confirmed: "arriving",

    started: "ongoing",

    completed: "completed",
    cancelled: "completed",
    rejected: "completed",
    expired: "completed",
};

const STATUS_LABEL: Record<
    BookingStatus,
    {
        label: string;
        sublabel: string;
        dot: string;
    }
> = {
    idle: {
        label: "Awaiting Confirmation",
        sublabel: "Booking is being processed",
        dot: "bg-amber-400",
    },
    requested: {
        label: "Awaiting Confirmation",
        sublabel: "Booking is being processed",
        dot: "bg-amber-400",
    },

    awaiting_payment: {
        label: "Payment Pending",
        sublabel: "Customer payment is pending",
        dot: "bg-purple-400",
    },

    confirmed: {
        label: "Heading to Pickup",
        sublabel: "Driver is heading to the pickup location",
        dot: "bg-amber-400",
    },

    started: {
        label: "Ride in Progress",
        sublabel: "Heading to drop location",
        dot: "bg-emerald-400",
    },

    completed: {
        label: "Ride Completed",
        sublabel: "Trip has ended successfully",
        dot: "bg-zinc-400",
    },

    cancelled: {
        label: "Ride Cancelled",
        sublabel: "This ride was cancelled",
        dot: "bg-red-400",
    },

    rejected: {
        label: "Ride Rejected",
        sublabel: "Ride was rejected",
        dot: "bg-red-400",
    },

    expired: {
        label: "Request Expired",
        sublabel: "Booking timed out",
        dot: "bg-orange-400",
    },
};

const PAYMENT_BADGE: Record<
    PaymentStatus,
    { label: string; cls: string }
> = {
    pending: {
        label: "Pending",
        cls: "bg-amber-100 text-amber-700",
    },

    paid: {
        label: "Paid",
        cls: "bg-emerald-100 text-emerald-700",
    },

    cash: {
        label: "Cash",
        cls: "bg-zinc-100 text-zinc-700",
    },

    failed: {
        label: "Failed",
        cls: "bg-red-100 text-red-700",
    },
};

const page = () => {

    const [booking, setBooking] = useState<IBooking | null>(null);
    const [loading, setLoading] = useState(false);
    const [driverPos, setDriverPos] = useState<[Number, Number] | null>(null);
    const [pickUpPos, setPickUpPos] = useState<[Number, Number] | null>(null);
    const [dropPos, setDropPos] = useState<[Number, Number] | null>(null);
    const [distanceToPickup, setDistanceToPickup] = useState(0);
    const [distanceToDrop, setDistanceToDrop] = useState(0);
    const [etaToPickUp, setEtaToPickUp] = useState(0);
    const [etaToDrop, setEtaToDrop] = useState(0);
    const [status, setStatus] = useState("");
    const [chatOpen, setChatOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // pick up otp
    const [otpMode, setOtpMode] = useState(false);
    const [otp, setOtp] = useState("");
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState("");

    /* Drop OTP */
    const [dropOtpMode, setDropOtpMode] = useState(false);
    const [dropOtp, setDropOtp] = useState("");
    const [loadingDropOtp, setLoadingDropOtp] = useState(false);
    const [dropOtpError, setDropOtpError] = useState("");

    const handleSendPickUpOtp = async () => {
        setLoadingOtp(true)
        try {
            const { data } = await axios.post("/api/partner/bookings/otp/pickup/send", { bookingId: booking?._id });
            console.log("Pickup OTP Response:", data);
            toast.success(data?.message || "Pickup OTP sent successfully");
            setOtpMode(true)
            setLoadingOtp(false)
        } catch (error: any) {
            console.error("Pickup OTP Error:", error?.response?.data);
            setLoadingOtp(false)
            toast.error(
                error?.response?.data?.message || "Failed to send pickup OTP"
            );
        }
    }

    const handleSendDropOtp = async () => {
        setLoadingDropOtp(true)
        try {
            const { data } = await axios.post("/api/partner/bookings/otp/drop/send", { bookingId: booking?._id });
            console.log("Drop OTP Response:", data);
            setDropOtpMode(true)
            toast.success(data?.message || "Drop OTP sent successfully");
            setLoadingDropOtp(false)
        } catch (error: any) {
            console.error("Drop OTP Error:", error?.response?.data);

            toast.error(
                error?.response?.data?.message || "Failed to send Drop OTP"
            );
            setLoadingDropOtp(false)
        }
    }

    const handleVerifyPickUpOtp = async () => {
        setLoadingOtp(true)
        try {
            const { data } = await axios.post("/api/partner/bookings/otp/pickup/verify", { bookingId: booking?._id, otp });
            console.log(data);
            setOtpVerified(true)
            setOtpMode(false)
            setStatus("started")
            setBooking(prev => prev ? { ...prev, bookingStatus: "started" } : prev)
            toast.success(data?.message || "Pickup OTP verified successfully");
            setLoadingOtp(false)
        } catch (error: any) {
            console.error("Pickup OTP Error:", error?.response?.data);
            setOtpError(error?.response?.data.message ?? "Verification failed")
            toast.error(
                error?.response?.data?.message
            );
            setLoadingOtp(false)
        }
    }

    const handleVerifyDropOtp = async () => {
        setLoadingDropOtp(true)
        try {
            const { data } = await axios.post("/api/partner/bookings/otp/drop/verify", { bookingId: booking?._id, otp: dropOtp });
            console.log(data);

            toast.success(data?.message || "Drop OTP verified successfully");
            setLoadingDropOtp(false)
            setDropOtpMode(false)
            setStatus("completed")
            setBooking(prev => prev ? { ...prev, bookingStatus: "completed" } : prev)
        } catch (error: any) {
            console.error("Pickup OTP Error:", error?.response?.data);

            toast.error(
                error?.response?.data?.message
            );
            setLoadingDropOtp(false)
            setDropOtpError(error?.response?.data.message ?? "Verification failed")
        }
    }

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const { data } = await axios.get("/api/partner/my-active")

                if (!data) {
                    setLoading(false)
                    setBooking(null);
                    return;
                }
                setBooking(data);
                setStatus(data.bookingStatus)
                setPickUpPos([data.pickUpLocation.coordinates[1], data.pickUpLocation.coordinates[0]]);
                setDropPos([data.dropLocation.coordinates[1], data.dropLocation.coordinates[0]]);
                setLoading(false);

            } catch (error: any) {
                console.log(error.response.data.message);
                setLoading(false);
            }
        }
        fetch()
    }, []);

    const onChatToggle = () => {
        setChatOpen(prev => !prev)
    }

    useEffect(() => {
        if (!navigator.geolocation) return;

        const socket = getSocket();
        const watchId = navigator.geolocation.watchPosition((pos) => {
            const lat = pos.coords.latitude
            const lon = pos.coords.longitude
            setDriverPos([lat, lon]);
            socket.emit("driver-location-update", {
                bookingId: booking?._id,
                latitude: lat,
                longitude: lon,
                status: status

            })
        },
            (error) => { console.log('gps error', error) },
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        )
        return () => { navigator.geolocation.clearWatch(watchId) }
    }, [booking?._id])

    useEffect(() => {
        if (!booking?._id) return;

        const socket = getSocket();
        socket.emit("join-ride", booking._id);
        socket.on("driver-location", ({ latitude, longitude }) => {
            setDriverPos([latitude, longitude])
        })

        return () => {
            socket.off("join-ride");
            socket.off("driver-location")
        }

    }, [booking?._id]);

    if (loading) {
        return (
            <div className='h-screen w-full bg-zinc-950 flex items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin' />
                    <p className='text-white/40 text-sm tracking-widest uppercase font-medium'>
                        Loading Ride...
                    </p>
                </div>
            </div>
        );
    }

    if (booking == null) {
        return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">

                <div className="mx-auto w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-6">
                    <Radio size={36} className="text-white" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">
                    No Active Ride
                </h1>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    You are currently not assigned to any ride.
                    Stay online and you'll receive ride requests when passengers book nearby.
                </p>

                 
                <div className="flex flex-col gap-3">
                    

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 border border-zinc-700 text-white font-semibold py-3 px-4 rounded-2xl hover:bg-zinc-900 transition-all"
                    >
                        Back to Home
                        <ArrowRight size={16} />
                    </Link>
                </div>

            </div>
        </div>

        )
    }

    if (status === "completed" && booking) {
        return (
            <CompletedScreen booking={booking} role='driver' />
        )
    }

    const cfg = STATUS_LABEL[booking?.bookingStatus! ?? "confirmed"]
    const isActive = ["confirmed", "started"].includes(status)
    const canChat = booking?.bookingStatus === "confirmed"
    const displayEta = status === "confirmed" ? etaToPickUp : etaToDrop
    const displayDistance = status === "confirmed" ? distanceToPickup : distanceToDrop
    const paymentStatus = PAYMENT_BADGE[booking?.paymentStatus! ?? "pending"]

    const panelProps = {
        isActive, displayDistance, displayEta, cfg, status, booking, paymentStatus, canChat, chatOpen,
        onChatToggle, currentRole: "driver"
    }

    return (
        <div className='h-screen w-full bg-zinc-100 flex flex-col lg:flex-row overflow-hidden'>
            <div className='relative flex-1 h-full z-0'>
                <LiveRideMap
                    driverLocation={driverPos}
                    pickUpLocation={pickUpPos}
                    dropLoaction={dropPos}
                    mapStatus={MAP_STATUS[booking?.bookingStatus!]}
                    onStats={({ distanceToPickup, etaToPickUp, distanceToDrop, etaToDrop }) => {
                        setDistanceToPickup(distanceToPickup)
                        setEtaToPickUp(etaToPickUp)
                        setDistanceToDrop(distanceToDrop)
                        setEtaToDrop(etaToDrop)
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className='absolute top-4 left-1/2 -translate-x-1/2 z-500 pointer-events-none'
                >
                    <div className='flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 
                    rounded-full shadow-lg border border-zinc-100'>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                        <span className='text-xs font-semibold tracking-wide text-zinc-900'>
                            {cfg.label}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* desktop mode */}
            <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className='hidden lg:flex w-105 xl:w-115 bg-white border-l border-zinc-100 flex-col overflow-hidden '
            >
                <div className='bg-zinc-950 px-6 py-5 shrink-0'>
                    <p className='text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-semibold mb-1'>
                        Driver Panel
                    </p>

                    <div className='flex items-center justify-between'>
                        <h1 className='text-white text-xl font-bold'>Active Ride</h1>
                        {isActive && (
                            <div className='flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full'>
                                <Zap size={13} className='text-amber-400' />
                                <span className='text-white text-xs font-semibold'>
                                    {Math.round(displayEta)} min
                                </span>
                            </div>
                        )}

                    </div>
                </div>

                <div className='flex-1 flex flex-col overflow-hidden'>
                    <div className='flex-1 overflow-y-auto  no-scrollbar'>
                        <PanelContent {...panelProps} />
                    </div>

                    <div className='border-t border-zinc-100 bg-white p-5 shrink-0'>
                        <AnimatePresence mode='wait'>

                            {/* Pickup Button */}
                            {status === "confirmed" && !otpMode && !otpVerified && (
                                <motion.button
                                    key="desktop-arrived"
                                    onClick={handleSendPickUpOtp}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className='w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.97]
                text-white py-4 rounded-2xl font-bold text-sm tracking-wide
                transition-all flex items-center justify-center gap-2'
                                >
                                    <MapPin size={16} />
                                    {loadingOtp ? "Sending..." : "I've Arrived at Pickup"}
                                    <ArrowRight size={15} />
                                </motion.button>
                            )}

                            {/* Pickup OTP */}
                            {status === "confirmed" && otpMode && !otpVerified && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'
                                >
                                    <div className='bg-zinc-950 px-4 py-3 flex items-center gap-2'>
                                        <KeyRound size={14} className='text-amber-400' />
                                        <p className='text-white text-xs font-bold uppercase'>
                                            Enter Customer OTP
                                        </p>
                                    </div>

                                    <div className='p-4 space-y-3'>
                                        <p className='text-xs text-zinc-500'>
                                            Ask the customer for their 4-digit OTP to start the ride.
                                        </p>

                                        <div className='flex justify-center'>
                                            <input
                                                type='text'
                                                value={otp}
                                                onChange={(e) => {
                                                    setOtp(e.target.value.replace(/\D/g, ""));
                                                    setOtpError("");
                                                }}
                                                maxLength={4}
                                                inputMode='numeric'
                                                placeholder='....'
                                                className='w-48 border-2 border-zinc-200 focus:border-zinc-900 rounded-xl
                            px-4 py-3 text-center text-2xl tracking-[0.5em] font-black
                            outline-none transition-colors'
                                            />
                                        </div>

                                        {otpError && (
                                            <p className='text-red-500 text-xs text-center font-medium'>
                                                {otpError}
                                            </p>
                                        )}

                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => {
                                                    setOtpMode(false);
                                                    setOtp("");
                                                    setOtpError("");
                                                }}
                                                className='flex-1 border border-zinc-200 bg-zinc-100 text-zinc-700
                            py-2.5 rounded-xl text-sm font-semibold'
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={handleVerifyPickUpOtp}
                                                disabled={loadingOtp || otp.length < 4}
                                                className='flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40
                            text-white py-2.5 rounded-xl text-sm font-bold'
                                            >
                                                {loadingOtp ? "Verifying..." : "Verify OTP"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Drop Button */}
                            {status === "started" && !dropOtpMode && (
                                <motion.button
                                    key="desktop-drop"
                                    onClick={handleSendDropOtp}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className='w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.97]
                text-white py-4 rounded-2xl font-bold text-sm tracking-wide
                transition-all flex items-center justify-center gap-2'
                                >
                                    <Navigation size={16} />
                                    {loadingDropOtp ? "Sending..." : "Mark as Dropped"}
                                    <ArrowRight size={15} />
                                </motion.button>
                            )}

                            {/* Drop OTP */}
                            {status === "started" && dropOtpMode && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'
                                >
                                    <div className='bg-zinc-950 px-4 py-3 flex items-center gap-2'>
                                        <KeyRound size={14} className='text-amber-400' />
                                        <p className='text-white text-xs font-bold uppercase'>
                                            Enter Drop OTP
                                        </p>
                                    </div>

                                    <div className='p-4 space-y-3'>
                                        <p className='text-xs text-zinc-500'>
                                            Ask the customer for their 4-digit OTP to complete the ride.
                                        </p>

                                        <div className='flex justify-center'>
                                            <input
                                                type='text'
                                                value={dropOtp}
                                                onChange={(e) => {
                                                    setDropOtp(e.target.value.replace(/\D/g, ""));
                                                    setDropOtpError("");
                                                }}
                                                maxLength={4}
                                                inputMode='numeric'
                                                placeholder='....'
                                                className='w-48 border-2 border-zinc-200 focus:border-zinc-900 rounded-xl
                            px-4 py-3 text-center text-2xl tracking-[0.5em] font-black
                            outline-none transition-colors'
                                            />
                                        </div>

                                        {dropOtpError && (
                                            <p className='text-red-500 text-xs text-center font-medium'>
                                                {dropOtpError}
                                            </p>
                                        )}

                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => {
                                                    setDropOtpMode(false);
                                                    setDropOtp("");
                                                    setDropOtpError("");
                                                }}
                                                className='flex-1 border border-zinc-200 bg-zinc-100 text-zinc-700
                            py-2.5 rounded-xl text-sm font-semibold'
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={handleVerifyDropOtp}
                                                disabled={loadingDropOtp || dropOtp.length < 4}
                                                className='flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40
                            text-white py-2.5 rounded-xl text-sm font-bold'
                                            >
                                                {loadingDropOtp ? "Verifying..." : "Verify OTP"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>

            </motion.div>

            {/* mobile mode */}
            <div className='lg:hidden fixed bottom-0 left-0 right-0 z-20 pointer-events-none'>
                <motion.div
                    className='bg-white rounded-t-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col'
                    animate={{ height: expanded ? "82vh" : 142 }}
                    transition={{ type: "spring", stiffness: 320, damping: 38 }}
                >
                    <div
                        onClick={() => setExpanded(!expanded)}
                        className='shrink-0 cursor-pointer select-none'>
                        <div className='pt-3 pb-1'>
                            <div className='w-10 h-1 bg-zinc-300 rounded-full mx-auto' />
                        </div>

                        <div className='px-5 py-3 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                                <div>
                                    <p className='text-sm font-bold text-zinc-900 leading-tight'>
                                        {cfg.label}
                                    </p>
                                    <p className='text-xs text-zinc-400 leading-tight'>
                                        {cfg.sublabel}
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                {isActive && (
                                    <div className='text-right'>
                                        <p className='text-2xl font-black text-zinc-900 leading-none'>
                                            {Math.round(displayEta)}
                                        </p>
                                        <p className='text-[10px] text-zinc-400 uppercase tracking-wider'>
                                            min
                                        </p>
                                    </div>
                                )}
                                <motion.div
                                    animate={{ rotate: expanded ? 180 : 0 }}
                                    transition={{ duration: 0.28 }}
                                    className='w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center'
                                >
                                    <ChevronUp size={16} className='text-zinc-600' />
                                </motion.div>
                            </div>
                        </div>

                        <div className='h-px bg-zinc-100 mx-5' />

                    </div>

                    <div className='flex-1 overflow-y-auto min-h-0'>
                        <PanelContent {...panelProps} />
                    </div>

                    <div className='shrink-0 border-t border-zinc-100 bg-white px-5 py-4'>
                        <AnimatePresence mode='wait'>
                            {status === "confirmed" && !otpMode && !otpVerified && (
                                <motion.button
                                    key={"arrived"}
                                    onClick={() => {
                                        handleSendPickUpOtp()
                                    }}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className='w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.97] text-white
                                    py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2'
                                >
                                    <MapPin size={16} /> {loadingOtp ? "sending..." : "I've Arrived at PickUp "}<ArrowRight size={15} className='ml-1' />
                                </motion.button>
                            )}

                            {status === "confirmed" && otpMode && !otpVerified && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'
                                >
                                    <div className='bg-zinc-950 px-4 py-3 flex items-center gap-2'>
                                        <KeyRound size={14} className='text-amber-400' />
                                        <p className='text-white text-xs font-bold tracking-wide uppercase'>
                                            Enter Customer OTP
                                        </p>
                                    </div>
                                    <div className='p-4 space-y-3'>
                                        <p className='text-xs text-zinc-500'>
                                            Ask ther customer for their 4-digit OTP to start the ride.
                                        </p>
                                        <div className='flex justify-center'>
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => {
                                                    setOtp(e.target.value.replace(/\D/g, ""));
                                                    setOtpError("");
                                                }}
                                                maxLength={4}
                                                inputMode="numeric"
                                                placeholder="...."
                                                className="w-48 border-2 border-zinc-200 focus:border-zinc-900 rounded-xl
    px-4 py-3 text-center text-2xl tracking-[0.5em] font-black outline-none transition-colors"
                                            />
                                        </div>

                                        {otpError && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-red-500 text-xs text-center font-medium'
                                            >
                                                {otpError}
                                            </motion.p>
                                        )}

                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => {
                                                    setOtpMode(false);
                                                    setOtp("");
                                                    setOtpError("");
                                                }}
                                                className='flex-1 border border-zinc-200 bg-zinc-100 text-zinc-700 py-2.5 rounded-xl
                                            text-sm font-semibold active:scale-[0.97] transition-all cursor-pointer'
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={handleVerifyPickUpOtp}
                                                disabled={loadingOtp || otp.length < 4}
                                                className='flex-1 bg-zinc-900 hover:bg-zinc-800
                                            disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-all'
                                            >
                                                {loadingOtp ? (
                                                    <span className='flex items-center justify-center gap-2'>
                                                        Verifying...
                                                    </span>
                                                ) : (<span>
                                                    Verify OTP
                                                </span>)}
                                            </button>
                                        </div>

                                    </div>
                                </motion.div>
                            )}

                            {status === "started" && !dropOtpMode && (
                                <motion.button
                                    key={"drop"}
                                    onClick={() => {
                                        handleSendDropOtp()
                                    }}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className='w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.97] text-white
                                    py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2'
                                >
                                    <Navigation size={16} /> {loadingDropOtp ? "sending..." : "Mark as Droped "}<ArrowRight size={15} className='ml-1' />
                                </motion.button>
                            )}

                            {status === "started" && dropOtpMode && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'
                                >
                                    <div className='bg-zinc-950 px-4 py-3 flex items-center gap-2'>
                                        <KeyRound size={14} className='text-amber-400' />
                                        <p className='text-white text-xs font-bold tracking-wide uppercase'>
                                            Enter Customer OTP
                                        </p>
                                    </div>
                                    <div className='p-4 space-y-3'>
                                        <p className='text-xs text-zinc-500'>
                                            Ask ther customer for their 4-digit OTP to Complete the ride.
                                        </p>
                                        <div className='flex justify-center'>
                                            <input
                                                type="text"
                                                value={dropOtp}
                                                onChange={(e) => {
                                                    setDropOtp(e.target.value.replace(/\D/g, ""));
                                                    setDropOtpError("");
                                                }}
                                                maxLength={4}
                                                inputMode="numeric"
                                                placeholder="...."
                                                className="w-48 border-2 border-zinc-200 focus:border-zinc-900 rounded-xl
    px-4 py-3 text-center text-2xl tracking-[0.5em] font-black outline-none transition-colors"
                                            />
                                        </div>

                                        {dropOtpError && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-red-500 text-xs text-center font-medium'
                                            >
                                                {dropOtpError}
                                            </motion.p>
                                        )}

                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => {
                                                    setDropOtpMode(false);
                                                    setDropOtp("");
                                                    setDropOtpError("");
                                                }}
                                                className='flex-1 border border-zinc-200 bg-zinc-100 text-zinc-700 py-2.5 rounded-xl
                                            text-sm font-semibold active:scale-[0.97] transition-all cursor-pointer'
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={handleVerifyDropOtp}
                                                disabled={loadingDropOtp || dropOtp.length < 4}
                                                className='flex-1 bg-zinc-900 hover:bg-zinc-800
                                            disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-all'
                                            >
                                                {loadingDropOtp ? (
                                                    <span className='flex items-center justify-center gap-2'>
                                                        Verifying...
                                                    </span>
                                                ) : (<span>
                                                    Verify OTP
                                                </span>)}
                                            </button>
                                        </div>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}

export default page