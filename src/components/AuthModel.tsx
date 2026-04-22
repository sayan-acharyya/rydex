'use client'

import React, { useState } from 'react';
import { motion } from "motion/react";
import { X } from 'lucide-react';
import Image from 'next/image';

type PropType = {
    open: boolean;
    onClose: () => void;
};

type StepType = "login" | "signup" | "otp";

const AuthModel = ({ open, onClose }: PropType) => {
    const [step, setStep] = useState<StepType>("login");

    if (!open) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='absolute inset-0 bg-black/80 backdrop-blur-md'
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className='relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] p-8 text-black'
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className='absolute right-4 top-4 p-2 rounded-full hover:bg-black/5 transition'
                >
                    <X size={20} className='text-gray-500 hover:text-black' />
                </button>

                {/* Header */}
                <div className='mb-6 text-center'>
                    <div className='flex justify-center'>
                        <Image
                            width={90}
                            height={70}
                            priority
                            src={"/logo2.png"}
                            alt='logo'
                            className="mx-auto"
                        />
                    </div>

                    <h2 className="text-lg font-semibold mt-3">
                        {step === "login" && "Welcome back"}
                        {step === "signup" && "Create your account"}
                        {step === "otp" && "Verify your email"}
                    </h2>

                    <p className='mt-1 text-sm text-gray-500'>
                        Premium rides, on demand
                    </p>
                </div>

                {/* Form Area */}
                <div className='space-y-4'>

                    {/* LOGIN */}
                    {step === "login" && (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />

                            <button className='w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90 transition'>
                                Sign In
                            </button>
                        </>
                    )}

                    {/* SIGNUP */}
                    {step === "signup" && (
                        <>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />

                            <button
                                onClick={() => setStep("otp")}
                                className='w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90 transition'
                            >
                                Continue
                            </button>
                        </>
                    )}

                    {/* OTP */}
                    {step === "otp" && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-black/80'
                            />

                            <button className='w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90 transition'>
                                Verify OTP
                            </button>
                        </>
                    )}

                    {/* Google Auth (hidden on OTP) */}
                    {step !== "otp" && (
                        <>
                            <div className="flex items-center gap-3 my-2">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-xs text-gray-400">OR</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition font-medium">
                                <Image
                                    src="/google.png"
                                    alt="Google"
                                    width={22}
                                    height={22}
                                />
                                Continue with Google
                            </button>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className='mt-6 text-center text-sm text-gray-500'>

                    {step === "login" && (
                        <>
                            Don’t have an account?{" "}
                            <span
                                onClick={() => setStep("signup")}
                                className='text-black hover:underline font-medium cursor-pointer'
                            >
                                Sign up
                            </span>
                        </>
                    )}

                    {step === "signup" && (
                        <>
                            Already have an account?{" "}
                            <span
                                onClick={() => setStep("login")}
                                className='text-black hover:underline font-medium cursor-pointer'
                            >
                                Sign in
                            </span>
                        </>
                    )}

                    {step === "otp" && (
                        <span
                            onClick={() => setStep("signup")}
                            className='text-black font-medium cursor-pointer'
                        >
                            ← Back
                        </span>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default AuthModel;