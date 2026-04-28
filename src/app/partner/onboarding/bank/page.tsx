
'use client'
import React, { useState } from 'react'
import { motion } from "motion/react";
import { useRouter } from 'next/navigation';
import { ArrowLeft, BadgeCheck, CheckCircle, CreditCard, Landmark, Phone, Smartphone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// accountHolder,
//     accountNumber,
//     ifsc,
//     upi,
//     status: "added"



const page = () => {
    const router = useRouter();

    const [accountHolder, setAccountHolder] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [upi, setUpi] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBank = async () => {
        // ✅ basic validation
        if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            await axios.post("/api/partner/onboarding/bank", {
                accountHolder,
                accountNumber,
                ifsc,
                upi,
                mobileNumber
            });

            toast.success("Bank details saved successfully");

            // ✅ final onboarding step complete
            // router.push("/partner/dashboard");

        } catch (error: any) {
            console.error(error);

            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-full max-w-xl bg-white rounded-3xl border border-gray-200
            shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
            >
                <div className='relative text-center'>
                    <button onClick={() => router.back()} className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 
                    flex items-center justify-center hover:bg-gray-100 transition'>
                        <ArrowLeft size={18} />
                    </button>

                    <p className='text-xs text-gray-500 font-medium'>
                        step 3 of 3
                    </p>

                    <h1 className='text-2xl font-bold mt-1'>
                        Bank & Payout Setup
                    </h1>

                    <p className='text-sm text-gray-500 mt-2'>
                        Used for partner payouts
                    </p>

                </div>

                <div className='mt-8 space-y-6'>
                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-500'>
                            Account holder name
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><BadgeCheck /></div>
                            <input
                                id='ahn'
                                type='text'
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)}
                                placeholder='As per bank records'
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="an" className='text-xs font-semibold text-gray-500'>
                            Bank account number
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><CreditCard /></div>
                            <input
                                id='an'
                                type='text'
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder='Enter account number'
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-500'>
                            IFSC code
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><Landmark /></div>
                            <input
                                id='ahn'
                                type='text'
                                value={ifsc}
                                onChange={(e) => setIfsc(e.target.value)}
                                placeholder='HDFC0001234'
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-500'>
                            Mobile number
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><Phone /></div>
                            <input
                                id='ahn'
                                type='text'
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder='10 digit mobile number'
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-500'>
                            UPI ID (optional)
                        </label>
                        <div className='flex items-center gap-2 mt-2'>

                            <input
                                id='ahn'
                                type='text'
                                value={upi}
                                onChange={(e) => setUpi(e.target.value)}
                                placeholder='name@upi'
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                            />
                        </div>
                    </div>

                </div>

                <div className='mt-8 flex items-start gap-3 text-xs text-gray-500'>
                    <CheckCircle size={16} className='mt-0.5' />
                    <p>
                        Bank details are verified before first payout.
                        This usually takes 24-48 hours
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                    onClick={handleBank}
                    className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex
                    items-center justify-center gap-2 disabled:opacity-40 transition'
                >
                    {loading ? "Uploading..." : "Continue"}
                </motion.button>

            </motion.div>
        </div >
    )
}

export default page