'use client'

import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Check, CheckCircle, Clock, IndianRupee, Lock, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RejectionCard from './RejectionCard';
import StatusCard from './StatusCard';
import ActionCard from './ActionCard';
import axios from 'axios';
import PricingModal from './PricingModal';
import { IVehicle, vehicleType } from '@/models/vehicle.model';
import { IUser } from '@/models/user.model';


type Step = {
    id: number,
    title: string,
    route?: string
};

const STEPS: Step[] = [
    { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
    { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
    { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
    { id: 4, title: "Review" },
    { id: 5, title: "Video KYC" },
    { id: 6, title: "Pricing" },
    { id: 7, title: "Final Review" },
    { id: 8, title: "Live" },
]

const TOTAL_STEPS = STEPS.length;



const PartnerDashboard = () => {
    const router = useRouter();
    const { userData } = useSelector((state: RootState) => state.user);

    const [activeStep, setActiveStep] = useState(0);
    const [requestLoading, setRequestLoading] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [vehicleData, setVehicleData] = useState<IVehicle | null>(null);

    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [vehicleDetails, setVehicleDetails] = useState<IVehicle | null>(null);
    const [vehicleLoading, setVehicleLoading] = useState(false);

    const handleViewVehicle = async () => {
        try {
            setVehicleLoading(true);
            setShowVehicleModal(true); // open immediately (good UX)

            const { data } = await axios.get("/api/partner/getVehicle");

            setVehicleDetails(data);
            console.log(vehicleDetails);

        } catch (error) {
            console.log(error);
        } finally {
            setVehicleLoading(false);
        }
    };

    useEffect(() => {
        if (userData) {
            setActiveStep(userData.partnerOnBoardingSteps + 1)
        }
    }, [userData]);

    const progressPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100;

    const goToStep = (step: Step) => {
        if (step.route && step.id <= activeStep) {
            router.push(step.route);
        }

        if (step.id == 6 &&
            userData?.partnerStatus == "approved" &&
            userData.videoKycStatus == "approved") {
            setShowPricing(true);
            return;
        }
    }

    const handleGetPricing = async () => {
        try {
            const { data } = await axios.get("/api/partner/onboarding/pricing");
            console.log(data);
            setVehicleData(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleGetPricing();
    }, [])

    return (
        <div className='min-h-screen bg-gradient-to-r from-gray-100 to-gray-200
         px-4 pt-28 pb-20'>
            <div className='max-w-7xl mx-auto space-y-16'>
                <div>
                    <h1 className='text-4xl font-bold'>Partner Onboarding</h1>
                    <p className='text-gray-600 mt-3'>Complete all steps to activate your account</p>
                </div>

                <div className='bg-white rounded-3xl p-10 shadow-xl border overflow-x-auto no-scrollbar'>
                    <div className='relative min-w-[800px]'>
                        <div className='absolute top-7 left-0 w-full h-[3px] bg-gray-200 rounded-full' />
                        <motion.div
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.6 }}
                            className='absolute top-7 left-0 h-[3px] bg-black rounded-full'
                        />
                        <div className='relative flex justify-between'>
                            {
                                STEPS.map((s, index) => {
                                    const completed = s.id < activeStep;
                                    const active = s.id == activeStep;
                                    const locked = s.id > activeStep;
                                    return (
                                        <motion.div
                                            onClick={() => goToStep(s)}
                                            key={s.id}
                                            whileHover={!locked ? { scale: 1.1 } : {}}
                                            className='flex flex-col items-center z-10 cursor-pointer'
                                        >
                                            <div
                                                className={`w-14 h-14 rounded-full flex items-center 
                                                justify-center border-2 transition-all
                                                ${completed
                                                        ? "bg-black text-white border-black"
                                                        : active
                                                            ? "border-black bg-white"
                                                            : "border-gray-300 text-gray-400 bg-white"
                                                    }
                                                `}
                                            >
                                                {
                                                    completed ? (
                                                        <Check size={20} />
                                                    ) : locked ? (
                                                        <Lock />
                                                    ) : (
                                                        s.id
                                                    )
                                                }
                                            </div>
                                            <p className='mt-3 text-sm font-semibold text-center'>{s.title}</p>

                                        </motion.div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                {
                    activeStep == 4 && userData?.partnerStatus === "rejected" && (
                        <RejectionCard
                            title="Partner Rejected"
                            reason={userData.rejectionReason}
                            actionLabel={`Review and Update`}
                            onAction={() => {
                                router.push("/partner/onboarding/vehicle")
                            }}
                        />
                    )
                }

                {
                    activeStep == 4 && userData?.partnerStatus === "pending" && (
                        <StatusCard
                            icon={<Clock size={18} />}
                            title={"Documents Under Review"}
                            desc={"Your documents have been successfully submitted and are currently under review. We’ll notify you once the verification is complete"}
                        />
                    )
                }

                {activeStep === 5 && (

                    userData?.videoKycStatus === "approved" ? (
                        <StatusCard
                            icon={<Check size={18} />}
                            title={"Video KYC approved"}
                            desc={"You can now process to pricing."}
                        />
                    ) : userData?.videoKycStatus === "rejected" ? (
                        <RejectionCard
                            title="Video KYC Rejected"
                            reason={userData?.videoKycRejectionReason}
                            actionLabel={requestLoading ? "Requesting...." : `Request Again`}
                            onAction={async () => {
                                setRequestLoading(true);
                                await axios.get("/api/partner/video-kyc/request");
                                setRequestLoading(false);
                                window.location.reload();
                            }}
                        />
                    ) : userData?.videoKycStatus === "in_progress" && userData.videoKycRoomId ? (
                        <ActionCard
                            icon={<Video size={18} />}
                            title={"Admin Started Video KYC"}
                            button={"Join call"}
                            onClick={() => router.push(`/video-kyc/${userData.videoKycRoomId}`)}
                        />
                    ) : (
                        <StatusCard
                            icon={<Clock size={20} />}
                            title={"Waiting for Admin"}
                            desc={"Admin will initiate Video KYC shortly."}
                        />
                    )
                )
                }

                {
                    activeStep === 6 && (
                        <StatusCard
                            icon={<IndianRupee size={18} />}
                            title={"Set Your Vehicle Pricing"}
                            desc={"You're almost ready—set your pricing to start earning"}
                        />
                    )
                }

                {
                    activeStep === 7 && vehicleData?.status === "pending" && (
                        <StatusCard
                            icon={<Clock size={20} />}
                            title="Pricing Under Review"
                            desc="Your pricing details are currently being evaluated by our team."
                        />
                    )
                }

                {
                    activeStep === 7 && vehicleData?.status === "rejected" && (
                        <RejectionCard
                            title="Pricing Rejected"
                            reason={vehicleData.rejectionReason}
                            actionLabel="Edit & Resubmit"
                            onAction={() => setShowPricing(true)}
                        />
                    )
                }

                {
                    activeStep === 8 && vehicleData?.status === "approved" && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='relative overflow-hidden rounded-3xl p-10 shadow-2xl 
            bg-gradient-to-br from-black via-zinc-900 to-gray-800 text-white'
                        >

                            {/* Glow effect */}
                            <div className='absolute -top-10 -right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl'></div>

                            {/* Content */}
                            <div className='relative z-10'>

                                {/* Badge */}
                                <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                bg-green-500/10 text-green-400 text-xs font-semibold mb-4'>
                                    <span className='w-2 h-2 bg-green-400 rounded-full'></span>
                                    LIVE STATUS
                                </div>

                                {/* Heading */}
                                <h2 className='text-3xl font-bold tracking-tight'>
                                    🚀 You're Live Now
                                </h2>

                                {/* Subtext */}
                                <p className='text-gray-400 mt-2 max-w-md'>
                                    Your vehicle is approved and visible to users. You can now start accepting bookings and earning.
                                </p>

                                {/* Actions */}
                                <div className='mt-8 flex flex-col sm:flex-row gap-4'>

                                    {/* Primary */}
                                    <button 
                                    onClick={()=>router.push("/partner/bookings")}
                                    className='bg-white text-black px-6 py-3 rounded-xl font-semibold 
                    flex items-center justify-center gap-2 hover:scale-[1.02] transition'>
                                        Go to Bookings
                                        <ArrowRight size={16} />
                                    </button>

                                    {/* Secondary */}
                                    <button
                                        onClick={handleViewVehicle}
                                        className='border border-white/20 px-6 py-3 rounded-xl font-semibold 
                    text-white hover:bg-white/10 transition'>
                                        View Vehicle Details
                                    </button>

                                </div>

                            </div>
                        </motion.div>
                    )
                }
            </div>

            <PricingModal
                open={showPricing}
                data={vehicleData}
                onClose={() => setShowPricing(false)}
            />

            <AnimatePresence>
                {showVehicleModal && (
                    <motion.div
                        className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center px-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className='bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative'
                        >

                            {/* CLOSE */}
                            <button
                                onClick={() => setShowVehicleModal(false)}
                                className='absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm shadow'
                            >
                                ✕
                            </button>

                            {/* LOADING */}
                            {vehicleLoading ? (
                                <div className='p-10 text-center'>
                                    <div className='w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto'></div>
                                    <p className='mt-4 text-gray-500'>Fetching vehicle details...</p>
                                </div>
                            ) : vehicleDetails ? (
                                <>
                                    {/* HERO IMAGE */}
                                    <div className='relative h-56 w-full'>
                                        <img
                                            src={vehicleDetails.imageUrl}
                                            className='w-full h-full object-cover'
                                        />

                                        {/* overlay */}
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>

                                        {/* vehicle name */}
                                        <div className='absolute bottom-4 left-6 text-white'>
                                            <h2 className='text-2xl font-bold'>
                                                {vehicleDetails.vehicleModel}
                                            </h2>
                                            <p className='text-sm opacity-80'>
                                                {vehicleDetails.number}
                                            </p>
                                        </div>

                                        {/* status */}
                                        <div className='absolute top-4 left-4'>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                    ${vehicleDetails.status === "approved"
                                                    ? "bg-green-500 text-white"
                                                    : vehicleDetails.status === "rejected"
                                                        ? "bg-red-500 text-white"
                                                        : "bg-yellow-400 text-black"
                                                }`}>
                                                {vehicleDetails.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className='p-6 space-y-6'>

                                        {/* VEHICLE INFO */}
                                        <div>
                                            <h3 className='text-sm font-semibold text-gray-500 mb-3'>
                                                Vehicle Information
                                            </h3>

                                            <div className='grid grid-cols-2 gap-4 text-sm'>
                                                <div className='bg-gray-50 p-3 rounded-xl'>
                                                    <p className='text-gray-500'>Type</p>
                                                    <p className='font-semibold'>{vehicleDetails.type}</p>
                                                </div>

                                                <div className='bg-gray-50 p-3 rounded-xl'>
                                                    <p className='text-gray-500'>Model</p>
                                                    <p className='font-semibold'>{vehicleDetails.vehicleModel}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* PRICING */}
                                        <div>
                                            <h3 className='text-sm font-semibold text-gray-500 mb-3'>
                                                Pricing Details
                                            </h3>

                                            <div className='grid grid-cols-3 gap-4'>
                                                <div className='bg-black text-white p-4 rounded-xl text-center'>
                                                    <p className='text-xs opacity-70'>Base Fare</p>
                                                    <p className='text-lg font-bold'>₹ {vehicleDetails.baseFare}</p>
                                                </div>

                                                <div className='bg-gray-100 p-4 rounded-xl text-center'>
                                                    <p className='text-xs text-gray-500'>Per KM</p>
                                                    <p className='text-lg font-bold'>₹ {vehicleDetails.pricePerKM}</p>
                                                </div>

                                                <div className='bg-gray-100 p-4 rounded-xl text-center'>
                                                    <p className='text-xs text-gray-500'>Waiting</p>
                                                    <p className='text-lg font-bold'>₹ {vehicleDetails.waitingCharge}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* OWNER */}
                                        <div>
                                            <h3 className='text-sm font-semibold text-gray-500 mb-3'>
                                                Owner Info
                                            </h3>

                                            <div className='bg-gray-50 p-4 rounded-xl text-sm space-y-1'>
                                                <p className='text-gray-900'><span className='text-gray-500'>Name: </span> {userData?.name || "-"}</p>
                                                <p className='text-gray-900'><span className='text-gray-500'>Email: </span> {userData?.email || "-"}</p>
                                                <p className='text-gray-900'><span className='text-gray-500'>Phone: </span> {userData?.mobileNumber || "-"}</p>
                                            </div>
                                        </div>

                                    </div>
                                </>
                            ) : (
                                <div className='p-10 text-center text-gray-500'>
                                    No vehicle data found
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    )
}

export default PartnerDashboard