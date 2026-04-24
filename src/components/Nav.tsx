'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthModel from './AuthModel'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Bike, Car, ChevronRight, LogOut, Menu, Truck, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { setUserData } from '@/redux/userSlice'
import toast from 'react-hot-toast'
import { div } from 'motion/react-client'

const Nav = () => {

    const Nav_Items = ["Home", "Bookings", "About Us", "Contact"]
    const pathName = usePathname()
    const [authOpen, setAuthOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { userData } = useSelector((state: RootState) => state.user)

    const dispatch = useDispatch();

    const handleLogOut = async () => {
        await signOut({ redirect: false });
        dispatch(setUserData(null))
        setProfileOpen(false)
        toast.success("Log out successfully")

    }

    return (
        <>
            <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`fixed top-3 left-1/2 -translate-x-1/2
             py-3 w-[94%] md:w-[86%] z-50 rounded-full
             bg-white/10 backdrop-blur-md border border-white/10
             text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)]`}
            >
                <div className='max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between'>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Image
                            width={70}
                            height={70}
                            priority
                            src={"/logo.jpeg"}
                            alt='logo'

                        />
                    </div>

                    {/* Nav Links */}
                    <div className='hidden md:flex items-center gap-8 relative'>
                        {Nav_Items.map((i, index) => {

                            let href = i === "Home" ? `/` : `/${i.toLowerCase().replace(/\s+/g, "")}`
                            const active = href === pathName

                            return (
                                <Link
                                    href={href}
                                    key={index}
                                    className={`relative text-sm font-medium transition duration-300
                                ${active ? "text-white" : "text-gray-300 hover:text-white"}`}
                                >
                                    {i}

                                    {/* Active underline */}
                                    {active && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute left-0 -bottom-1 w-full h-[2px] bg-white rounded-full"
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Button */}
                    <div className='flex items-center gap-3 relative'>

                        <div className='hidden md:block relative'>
                            {!userData ? (
                                <motion.button
                                    onClick={() => setAuthOpen(true)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='px-5 py-2 rounded-full text-sm font-semibold
                    bg-white text-black shadow-md hover:bg-gray-200 transition'
                                >
                                    Login
                                </motion.button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className='w-11 h-11 rounded-full bg-white text-black font-bold'>
                                        {userData.name.charAt(0).toUpperCase()}
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className='absolute top-14 right-0 w-[300px] bg-white text-black rounded-2xl shadow-xl border'
                                            >
                                                <div className='p-5'>
                                                    <p className='font-semibold text-lg'>{userData.name} </p>
                                                    <p className='text-xs uppercase text-gray-500 mb-4  '>
                                                        {userData.role}
                                                    </p>

                                                    {userData.role != "partner" &&
                                                        (
                                                            <div className='p-3 w-full flex items-center gap-3 py-3 hover:bg-gray-200 rounded-xl'>
                                                                <div className='flex -space-x-2'>
                                                                    <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'>
                                                                        <Bike size={14} /></div>
                                                                    <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'>
                                                                        <Car size={14} /></div>
                                                                    <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'>
                                                                        <Truck size={14} /></div>
                                                                </div>
                                                                Become a Partner
                                                                <ChevronRight size={16} className='ml-auto' />
                                                            </div>
                                                        )
                                                    }
                                                    <button
                                                        onClick={handleLogOut}
                                                        className='w-full flex items-center gap-3 py-3 hover:bg-gray-200 rounded-xl mt-2 px-3'
                                                    >
                                                        <LogOut size={16} /> Log out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>

                        <div className='md:hidden  '>
                            {!userData ? (
                                <motion.button
                                    onClick={() => setAuthOpen(true)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='px-5 py-2 rounded-full text-sm font-semibold
                    bg-white text-black shadow-md hover:bg-gray-200 transition'
                                >
                                    Login
                                </motion.button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className='w-11 h-11 rounded-full bg-white text-black font-bold'>
                                        {userData.name.charAt(0).toUpperCase()}
                                    </button>


                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className='md:hidden cursor-pointer '>
                            {menuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>

                    </div>

                </div>


            </motion.div>


            {/* mobile phone menu */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-black z-30 md:hidden backdrop-blur-sm"
                        />

                        {/* Menu Card */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-[85px] left-1/2 -translate-x-1/2 w-[92%] 
                   bg-[#0B0B0B]/95 backdrop-blur-lg
                   rounded-2xl shadow-2xl z-40 md:hidden overflow-hidden border border-white/10"
                        >
                            <div className="flex flex-col p-2">

                                {Nav_Items.map((i, index) => {
                                    const href =
                                        i === "Home"
                                            ? `/`
                                            : `/${i.toLowerCase().replace(/\s+/g, "")}`;

                                    const active = href === pathName;

                                    return (
                                        <Link
                                            href={href}
                                            key={index}
                                            onClick={() => setMenuOpen(false)}
                                            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active
                                                    ? "bg-white text-black"
                                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                                                }`}
                                        >
                                            <span>{i}</span>

                                            {/* Active indicator */}
                                            {active && (
                                                <motion.span
                                                    layoutId="nav-indicator"
                                                    className="ml-auto w-2 h-2 rounded-full bg-black"
                                                />
                                            )}
                                        </Link>
                                    );
                                })}

                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* mobile phone profile photo */}
            <AnimatePresence>
                {profileOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setProfileOpen(false)}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ duration: 0.3 }}
                            className="fixed bottom-0 left-0 w-full 
                   bg-white text-black rounded-t-3xl 
                   z-50 md:hidden shadow-2xl"
                        >
                            <div className="p-5">

                                {/* Handle bar */}
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

                                {/* User Info */}
                                <div className="mb-4">
                                    <p className="font-semibold text-lg">{userData?.name}</p>
                                    <p className="text-xs uppercase text-gray-500">
                                        {userData?.role}
                                    </p>
                                </div>

                                {/* Become Partner */}
                                {userData?.role !== "partner" && (
                                    <div className="flex items-center gap-3 px-3 py-3 
                            hover:bg-gray-100 rounded-xl transition">

                                        <div className="flex -space-x-2">
                                            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                                                <Bike size={14} />
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                                                <Car size={14} />
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                                                <Truck size={14} />
                                            </div>
                                        </div>

                                        <span className="text-sm font-medium">
                                            Become a Partner
                                        </span>

                                        <ChevronRight size={16} className="ml-auto" />
                                    </div>
                                )}

                                {/* Logout */}
                                <button
                                    onClick={handleLogOut}
                                    className="w-full flex items-center gap-3 px-3 py-3 mt-2 
                       hover:bg-red-50 text-red-600 rounded-xl transition"
                                >
                                    <LogOut size={16} />
                                    <span className="text-sm font-medium">Log out</span>
                                </button>

                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AuthModel open={authOpen} onClose={() => setAuthOpen(false)} />

        </>
    )
}

export default Nav