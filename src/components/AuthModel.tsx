'use client'

import React, { useState } from 'react';
import { motion } from "motion/react";
import { Loader, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { em } from 'motion/react-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type PropType = {
    open: boolean;
    onClose: () => void;
};

type StepType = "login" | "signup" | "otp";

const AuthModel = ({ open, onClose }: PropType) => {



    if (!open) return null;

    const [step, setStep] = useState<StepType>("login");

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);



    const { data: session, status } = useSession();

    useEffect(() => {
        console.log("Status:", status)
        if (status === "authenticated") {
            console.log("User Data:", session?.user);
        }
    }, [status, session]);

    const handleSignup = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/auth/register", {
                name,
                email,
                password
            });
            setLoading(false)
            toast.success("Enter OTP");
            setStep("otp");

            setName("");

            setPassword("");

        } catch (error: any) {
            const msg =
                error?.response?.data?.message || "Signup failed";

            toast.error(msg);
            setLoading(false)
        }
    };

    const handleLogin = async () => {
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            });

            if (res?.error) {
                toast.error("wrong credentials"); // ❌ wrong credentials
            } else {
                toast.success("Login Successful ");

                setEmail("");
                setPassword("");
                onClose();
            }

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);

            await signIn("google", {
                callbackUrl: "/" // redirect after login
            });

        } catch (error) {
            toast.error("Google login failed");
            setLoading(false);
        }
    };

    const handleChangeOtp = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const updated = [...otp]
        updated[index] = value;
        setOtp(updated)

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`)?.focus()
        }

        if (!value && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus()
        }
    }

    const handleVerifyEmail = async () => {


        try {
            const { data } = await axios.post("/api/auth/verify-email", {
                email,
                otp: otp.join("")
            })


            toast.success("email verified Successfully")
            setStep("login")

        } catch (error: any) {
            const msg =
                error?.response?.data?.message || "Signup failed";

            toast.error(msg);

        }
    }

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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Email"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className={`w-full py-3 rounded-xl font-semibold transition
    ${loading
                                        ? "bg-black/70 cursor-not-allowed text-white"
                                        : "bg-black text-white hover:opacity-90"
                                    }`}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </>
                    )}

                    {/* SIGNUP */}
                    {step === "signup" && (
                        <>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="Full Name"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Email"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/80'
                            />

                            {loading ?
                                <button
                                    disabled
                                    className='w-full py-3 rounded-xl bg-black text-white font-semibold 
    flex items-center justify-center gap-2 
    opacity-80 cursor-not-allowed'
                                >
                                    <Loader className='w-5 h-5 animate-spin' />
                                    Processing...
                                </button>
                                :
                                <button
                                    onClick={handleSignup}
                                    className='w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90 transition'
                                >
                                    Continue
                                </button>}
                        </>
                    )}

                    {/* OTP */}
                    {step === "otp" && (
                        <>
                            {/* <input
                                type="text"
                                placeholder="Enter OTP"
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-black/80'
                            /> */}
                            <div className='mt-6 flex justify-between gap-2'>
                                {
                                    otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            value={digit}
                                            maxLength={1}
                                            onChange={(e) => handleChangeOtp(i, e.target.value)}
                                            className='w-10 h-12 sm:w-12 text-center text-lg font-semibold 
                                            rounded-xl bg-white border border-black/20 outline-none'
                                        />
                                    ))
                                }
                            </div>

                            <button
                                onClick={handleVerifyEmail}
                                className='w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90 transition'>
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

                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl 
    border border-gray-200 bg-gray-100 
    hover:bg-gray-200 transition 
    disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Image
                                            src="/google.png"
                                            alt="Google"
                                            width={22}
                                            height={22}
                                        />
                                        Continue with Google
                                    </>
                                )}
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


//4:40:40