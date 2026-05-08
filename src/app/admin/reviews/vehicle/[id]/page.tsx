'use client'

import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, CheckCircle, Clock, ImageIcon, IndianRupee, ShieldCheck, Truck, XCircle } from 'lucide-react';
import { vehicleType } from '@/models/vehicle.model';
import { IUser } from '@/models/user.model';
import AnimatedCard from '@/components/AnimatedCard';
import toast from 'react-hot-toast';


interface IVehicle {
    owner: IUser,
    type: vehicleType,
    vehicleModel: string,
    number: string,
    imageUrl?: string,
    baseFare?: number,
    pricePerKM?: number,
    waitingCharge?: number,
    status: "approved" | "pending" | "rejected",
    rejectionReason?: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
}

const page = () => {
    const { id } = useParams();
    const [data, setData] = useState<IVehicle | null>(null);
    const router = useRouter();

    const [showApproved, setShowApproved] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);

    const load = async () => {
        try {
            const { data } = await axios.get(`/api/admin/reviews/vehicle/${id}`);
            setData(data);

        } catch (error: any) {
            console.log(error.response.data.message ?? error);

        }
    }



    const handleApproved = async () => {
        try {
            setApproveLoading(true); // ✅ start loading

            const { data } = await axios.get(`/api/admin/reviews/vehicle/${id}/approve`);
            toast.success("Vehicle approved successfully");
            setShowApproved(false);
            await load();

        } catch (error) {
            console.log(error);
            toast.error("Failed to approve partner ");
        } finally {
            setApproveLoading(false); // ✅ stop loading
        }
    }

    const handleRejected = async () => {
        setRejectLoading(true);
        try {
            const { data } = await axios.post(`/api/admin/reviews/vehicle/${id}/reject`, { reason:rejectionReason });
            toast.error("Vehicle rejected");
            setShowReject(false);
            setRejectLoading(false)
            await load();

        } catch (error) {
            console.log(error);
            toast.error("Failed to rejected partner ");
            setRejectLoading(false)
        }
    }

    useEffect(() => {
        load();
    }, [id]);


    return (
        <div className='min-h-screen bg-gray-100'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b'>
                <div className='max-w-7xl mx-auto px-4 h-16 flex items-center gap-4'>
                    {/* back button */}
                    <button
                        onClick={() => router.back()}
                        className='w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center 
          hover:bg-gray-100 transition'
                    >
                        <ArrowLeft size={18} />
                    </button>

                    {/* header name and email */}
                    <div className='flex-1'>
                        <div className='font-semibold'>
                            {data?.owner?.name}
                        </div>
                        <div className='text-xs text-gray-500'>
                            {data?.owner?.email}
                        </div>
                    </div>

                    {/* status button  */}
                    <>
                        {
                            data?.status === 'approved' ? (
                                <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex 
              items-center gap-2 bg-green-100 text-green-700'>
                                    <CheckCircle size={14} />
                                    Approved
                                </div>
                            )
                                : data?.status === 'rejected' ? (
                                    <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex 
              items-center gap-2 bg-red-100 text-red-700'>
                                        <XCircle size={14} />
                                        Rejected
                                    </div>
                                ) : (
                                    <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex 
              items-center gap-2 bg-yellow-100 text-yellow-700'>
                                        <Clock size={14} />
                                        Pending
                                    </div>
                                )
                        }
                    </>


                </div>
            </div>

            <main className='max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12'>
                <div className='space-y-8'>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='rounded-3xl overflow-hidden shadow-xl bg-white'
                    >
                        {
                            data?.imageUrl ? (
                                <img
                                    src={data?.imageUrl} alt='vehicle image'
                                    className='w-full h-112.5  object-cover'
                                />
                            ) : (
                                <div className='h-[450px] grid place-items-center text-gray-300'>
                                    <ImageIcon
                                        size={25}

                                    />
                                </div>
                            )
                        }
                    </motion.div>


                    <AnimatedCard title={"Owner Information"} icon={<ShieldCheck size={18} />}>
                        <div className='space-y-3 text-sm'>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Name:</span>
                                <span className='font-semibold'>{data?.owner?.name || "-"}</span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Email:</span>
                                <span className='font-semibold'>{data?.owner?.email || "-"}</span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Mobile:</span>
                                <span className='font-semibold'>{data?.owner?.mobileNumber || "-"}</span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Email Verified:</span>
                                <span className={`font-semibold ${data?.owner?.isEmailVerified ? "text-green-600" : "text-red-500"}`}>
                                    {data?.owner?.isEmailVerified ? "Yes" : "No"}
                                </span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Partner Status:</span>
                                <span className={`font-semibold ${data?.owner?.partnerStatus === "approved" ? "text-green-600" :
                                    data?.owner?.partnerStatus === "rejected" ? "text-red-500" :
                                        "text-yellow-600"
                                    }`}>
                                    {data?.owner?.partnerStatus}
                                </span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Video KYC:</span>
                                <span className={`font-semibold ${data?.owner?.videoKycStatus === "approved" ? "text-green-600" :
                                    data?.owner?.videoKycStatus === "rejected" ? "text-red-500" :
                                        "text-yellow-600"
                                    }`}>
                                    {data?.owner?.videoKycStatus}
                                </span>
                            </div>

                        </div>
                    </AnimatedCard>
                </div>

                <div className='space-y-8'>
                    <AnimatedCard title={"Vehicle Details"} icon={<Truck size={18} />}>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Vehicle Type:</span>
                            <span className='font-semibold text-lg'>{data?.type || "-"}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Registration Number:</span>
                            <span className='font-semibold text-md'>{data?.number || "-"}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Model:</span>
                            <span className='font-semibold text-md'>{data?.vehicleModel || "-"}</span>
                        </div>
                    </AnimatedCard>

                    <AnimatedCard title={"Pricing Configuration"} icon={<IndianRupee size={18} />}>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Base Fare:</span>
                            <span className='font-semibold text-lg'>₹ {data?.baseFare || 0}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Price per KM:</span>
                            <span className='font-semibold text-lg'>₹ {data?.pricePerKM || 0}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Waiting Charge:</span>
                            <span className='font-semibold text-lg'>₹ {data?.waitingCharge || 0}</span>
                        </div>
                    </AnimatedCard>
                    {data?.status == "pending" && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='bg-white rounded-4xl p-8 shadow-xl space-y-6'
                        >
                            <div className='flex items-center gap-2 font-semibold'>
                                <ShieldCheck size={18} />
                                Admin Check
                            </div>
                            <p className='text-sm text-gray-500'>
                                Verify documents carefully before approving
                            </p>
                            <div className='flex flex-col gap-4'>
                                <button
                                    onClick={() => setShowApproved(true)}
                                    className='py-3   rounded-2xl bg-linear-to-r from-black to-gray-800 text-white 
                                  font-semibold hover:opacity-90 transition'
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => setShowReject(true)}
                                    className='py-3 rounded-2xl bg-gray-200  font-semibold hover:bg-gray-300 transition'>
                                    Reject
                                </button>
                            </div>
                        </motion.div>
                    )}

                </div>


            </main>

            {/* confermatin model */}
            {
                <AnimatePresence>
                    {
                        showApproved && (
                            <motion.div
                                className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center
                            justify-center px-4'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className='bg-white rounded-3xl p-6 w-full max-w-sm'
                                >
                                    <h2 className='text-lg font-bold'>Approved Vehicle ?</h2>
                                    <p className='text-sm text-gray-500 mt-2'>Confirm all information has been verified.</p>

                                    <div className='flex gap-3 mt-6'>
                                        <button
                                            onClick={() => setShowApproved(false)}
                                            className='flex-1 py-2 rounded-xl bg-gray-200 hover:bg-gray-300'>Cancle</button>
                                        <button
                                            onClick={handleApproved}
                                            disabled={approveLoading}
                                            className='flex-1 py-2 rounded-xl bg-gray-950 hover:bg-gray-900 text-white 
                                  disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                                            {
                                                approveLoading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Approving...
                                                    </>
                                                ) : (
                                                    "Yes, Approved"
                                                )
                                            }
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            }

            {/* rejction model */}
            {
                <AnimatePresence>
                    {
                        showReject && (
                            <motion.div
                                className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center
                            justify-center px-4'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className='bg-white rounded-3xl p-6 w-full max-w-sm'
                                >
                                    <h2 className='text-lg font-bold'>Reject Vehicle ?</h2>
                                    <p className='text-sm text-gray-500 mt-2' >
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder='Enter rejection reason (required)'
                                            className='w-full mt-3 border rounded-xl p-3 text-sm border-gray-500'
                                        />
                                    </p>

                                    <div className='flex gap-3 mt-6'>
                                        <button
                                            onClick={() => setShowReject(false)}
                                            className='flex-1 py-2 rounded-xl bg-gray-200 hover:bg-gray-300'>Cancle</button>
                                        <button
                                            onClick={handleRejected}
                                            className='flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white'>
                                            {rejectLoading ? "Rejecting..." : "Reject"}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            }
        </div>
    )
}

export default page;

