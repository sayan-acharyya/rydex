'use client'
import React, { useState } from 'react'
import { motion } from "motion/react";
import { useRouter } from 'next/navigation';
import { ArrowLeft, BadgeCheck, CheckCircle, CreditCard, Landmark, Phone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const page = () => {
    const router = useRouter();

    const [accountHolder, setAccountHolder] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [upi, setUpi] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ REGEX
    const IFSC_REGX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const ACCOUNT_REGX = /^[0-9]{9,18}$/;
    const MOBILE_REGX = /^[6-9]\d{9}$/;
    const UPI_REGX = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

    const sanitizedIfsc = ifsc.trim();

    // ✅ VALIDATION
    const isNameValid = accountHolder.trim().length >= 3;
    const isAccountValid = ACCOUNT_REGX.test(accountNumber);
    const isIfscValid = IFSC_REGX.test(sanitizedIfsc);
    const isMobileValid = MOBILE_REGX.test(mobileNumber);
    const isUpiValid = upi.trim() === "" || UPI_REGX.test(upi);

    const canSubmit =
        isNameValid &&
        isAccountValid &&
        isIfscValid &&
        isMobileValid &&
        isUpiValid;

    // ✅ SUBMIT
    const handleBank = async () => {
        if (!canSubmit) {
            toast.error("Please fix the highlighted fields");
            return;
        }

        try {
            setLoading(true);

            await axios.post("/api/partner/onboarding/bank", {
                accountHolder: accountHolder.trim(),
                accountNumber,
                ifsc: sanitizedIfsc,
                upi: upi.trim(),
                mobileNumber
            });

            toast.success("Bank details saved successfully");

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
            >

                {/* HEADER */}
                <div className='relative text-center'>
                    <button onClick={() => router.back()} className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition'>
                        <ArrowLeft size={18} />
                    </button>

                    <p className='text-xs text-gray-500 font-medium'>step 3 of 3</p>
                    <h1 className='text-2xl font-bold mt-1'>Bank & Payout Setup</h1>
                    <p className='text-sm text-gray-500 mt-2'>Used for partner payouts</p>
                </div>

                {/* FORM */}
                <div className='mt-8 space-y-6'>

                    {/* NAME */}
                    <div>
                        <label className='text-xs font-semibold text-gray-500'>Account holder name</label>
                        <div className='flex items-center gap-2 mt-2'>
                            <BadgeCheck className='text-gray-400' />
                            <input
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)}
                                placeholder='As per bank records'
                                className={`flex-1 border-b pb-2 text-sm focus:outline-none transition
                                ${!isNameValid && accountHolder ? "border-red-400" : "border-gray-300 focus:border-black"}`}
                            />
                        </div>
                        {!isNameValid && accountHolder && (
                            <p className="text-xs text-red-400 mt-1">Minimum 3 characters required</p>
                        )}
                    </div>

                    {/* ACCOUNT */}
                    <div>
                        <label className='text-xs font-semibold text-gray-500'>Bank account number</label>
                        <div className='flex items-center gap-2 mt-2'>
                            <CreditCard className='text-gray-400' />
                            <input
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                                placeholder='Enter account number'
                                className={`flex-1 border-b pb-2 text-sm focus:outline-none transition
                                ${!isAccountValid && accountNumber ? "border-red-400" : "border-gray-300 focus:border-black"}`}
                            />
                        </div>
                        {!isAccountValid && accountNumber && (
                            <p className="text-xs text-red-400 mt-1">Enter 9–18 digit account number</p>
                        )}
                    </div>

                    {/* IFSC */}
                    <div>
                        <label className='text-xs font-semibold text-gray-500'>IFSC code</label>
                        <div className='flex items-center gap-2 mt-2'>
                            <Landmark className='text-gray-400' />
                            <input
                                value={ifsc}
                                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                                placeholder='HDFC0001234'
                                className={`flex-1 border-b pb-2 text-sm focus:outline-none transition
                                ${!isIfscValid && ifsc ? "border-red-400" : "border-gray-300 focus:border-black"}`}
                            />
                        </div>
                        {!isIfscValid && ifsc && (
                            <p className="text-xs text-red-400 mt-1">Invalid IFSC format</p>
                        )}
                    </div>

                    {/* MOBILE */}
                    <div>
                        <label className='text-xs font-semibold text-gray-500'>Mobile number</label>
                        <div className='flex items-center gap-2 mt-2'>
                            <Phone className='text-gray-400' />
                            <input
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                                placeholder='10 digit mobile number'
                                className={`flex-1 border-b pb-2 text-sm focus:outline-none transition
                                ${!isMobileValid && mobileNumber ? "border-red-400" : "border-gray-300 focus:border-black"}`}
                            />
                        </div>
                        {!isMobileValid && mobileNumber && (
                            <p className="text-xs text-red-400 mt-1">Enter valid 10-digit mobile</p>
                        )}
                    </div>

                    {/* UPI */}
                    <div>
                        <label className='text-xs font-semibold text-gray-500'>UPI ID (optional)</label>
                        <input
                            value={upi}
                            onChange={(e) => setUpi(e.target.value)}
                            placeholder='name@upi'
                            className={`w-full border-b pb-2 text-sm focus:outline-none transition
                            ${!isUpiValid && upi ? "border-red-400" : "border-gray-300 focus:border-black"}`}
                        />
                        {!isUpiValid && upi && (
                            <p className="text-xs text-red-400 mt-1">Invalid UPI ID</p>
                        )}
                    </div>

                </div>

                {/* INFO */}
                <div className='mt-8 flex items-start gap-3 text-xs text-gray-500'>
                    <CheckCircle size={16} className='mt-0.5' />
                    <p>Bank details are verified before first payout. This usually takes 24–48 hours</p>
                </div>

                {/* BUTTON */}
                <motion.button
                    whileHover={canSubmit ? { scale: 1.02 } : {}}
                    whileTap={canSubmit ? { scale: 0.97 } : {}}
                    disabled={!canSubmit || loading}
                    onClick={handleBank}
                    className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'
                >
                    {loading ? "Uploading..." : "Continue"}
                </motion.button>

            </motion.div>
        </div>
    )
}

export default page