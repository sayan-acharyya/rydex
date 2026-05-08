'use client'

import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { ArrowLeft, CheckCircle, Clock, ImageIcon, IndianRupee, Truck, XCircle } from 'lucide-react';
import { vehicleType } from '@/models/vehicle.model';
import { IUser } from '@/models/user.model';
import AnimatedCard from '@/components/AnimatedCard';


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

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get(`/api/admin/reviews/vehicle/${id}`);
                setData(data);

            } catch (error: any) {
                console.log(error.response.data.message ?? error);

            }
        }
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
                </div>
            </main>
        </div>
    )
}

export default page;

