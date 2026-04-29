'use client'

import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import AuthModel from './AuthModel'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Bike, Car, ChevronRight, LogOut, Menu, Truck, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { setUserData } from '@/redux/userSlice'
import toast from 'react-hot-toast'
import { auth } from '@/auth'


const Nav =   () => {
    const Nav_Items = ["Home", "Bookings", "About Us", "Contact"]
    const pathName = usePathname()
    const [authOpen, setAuthOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const router = useRouter();

    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch();

    // Handle Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogOut = async () => {
        await signOut({ redirect: false });
        dispatch(setUserData(null))
        setProfileOpen(false)
        toast.success("Log out successfully")
    }

    

    // Dynamic Classes based on scroll
    const navBgClass = scrolled
        ? "bg-white text-black shadow-lg border-gray-200"
        : `${userData?.role == "partner" ? "bg-black":"bg-black/50"}  backdrop-blur-md border-white/10 text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)]`;

    const profileBtnClass = scrolled
        ? "bg-black text-white" // Black bg, white text on scroll
        : "bg-white text-black"; // White bg, black text when at top

    return (
        <>
            <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`fixed top-3 left-1/2 -translate-x-1/2 py-3 w-[94%] md:w-[86%] z-50 rounded-full border transition-all duration-300 ${navBgClass}`}
            >
                <div className='max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between'>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Image
                            width={80}
                            height={80}
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
                                    ${active
                                            ? (scrolled ? "text-black" : "text-white")
                                            : (scrolled ? "text-gray-600 hover:text-black" : "text-gray-300 hover:text-white")
                                        }`}
                                >
                                    {i}
                                    {active && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className={`absolute left-0 -bottom-1 w-full h-[2px] rounded-full ${scrolled ? "bg-black" : "bg-white"}`}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Button / Profile */}
                    <div className='flex items-center gap-3 relative'>
                        <div className='hidden md:block relative'>
                            {!userData ? (
                                <motion.button
                                    onClick={() => setAuthOpen(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 
                                    ${scrolled ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-200"}`}
                                >
                                    Login
                                </motion.button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className={`w-11 h-11 rounded-full font-bold transition-colors duration-300 ${profileBtnClass}`}
                                    >
                                        {userData.name.charAt(0).toUpperCase()}
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className='absolute top-14 right-0 w-[300px] bg-white text-black rounded-2xl shadow-xl border p-5'
                                            >
                                                <p className='font-semibold text-lg'>{userData.name} </p>
                                                <p className='text-xs uppercase text-gray-500 mb-4'>{userData.role}</p>

                                                {userData.role !== "partner" && userData.role !== "admin" && (
                                                    <div
                                                        onClick={() => {
                                                            setProfileOpen(false);
                                                            router.push("/partner/onboarding/vehicle");
                                                        }}
                                                        className='p-3 w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl cursor-pointer'>
                                                        <div className='flex -space-x-2'>
                                                            <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Bike size={14} /></div>
                                                            <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Car size={14} /></div>
                                                            <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Truck size={14} /></div>
                                                        </div>
                                                        Become a Partner
                                                        <ChevronRight size={16} className='ml-auto' />
                                                    </div>
                                                )}
                                                <button
                                                    onClick={handleLogOut}
                                                    className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2 px-3'
                                                >
                                                    <LogOut size={16} /> Log out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>

                        {/* Mobile Controls */}
                        <div className='md:hidden flex items-center gap-3'>
                            {userData && (
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className={`w-10 h-10 rounded-full font-bold text-sm transition-colors duration-300 ${profileBtnClass}`}
                                >
                                    {userData.name.charAt(0).toUpperCase()}
                                </button>
                            )}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className='cursor-pointer'
                            >
                                {menuOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-black z-30 md:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="fixed top-[85px] left-1/2 -translate-x-1/2 w-[92%] bg-[#0B0B0B]/95 backdrop-blur-lg rounded-2xl shadow-2xl z-40 md:hidden overflow-hidden border border-white/10"
                        >
                            <div className="flex flex-col p-2">
                                {Nav_Items.map((i, index) => {
                                    const href = i === "Home" ? `/` : `/${i.toLowerCase().replace(/\s+/g, "")}`;
                                    const active = href === pathName;
                                    return (
                                        <Link
                                            href={href}
                                            key={index}
                                            onClick={() => setMenuOpen(false)}
                                            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? "bg-white text-black" : "text-gray-300 hover:text-white hover:bg-white/10"}`}
                                        >
                                            <span>{i}</span>
                                            {active && <div className="ml-auto w-2 h-2 rounded-full bg-black" />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Profile Bottom Sheet */}
            <AnimatePresence>
                {profileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setProfileOpen(false)}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ duration: 0.3 }}
                            className="fixed bottom-0 left-0 w-full bg-white text-black rounded-t-3xl z-50 md:hidden shadow-2xl"
                        >
                            <div className="p-5 pb-8">
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
                                <div className="mb-4">
                                    <p className="font-semibold text-lg">{userData?.name}</p>
                                    <p className="text-xs uppercase text-gray-500">{userData?.role}</p>
                                </div>
                                {userData?.role !== "partner" && (
                                    <div
                                        onClick={() => {
                                            setProfileOpen(false);
                                            router.push("/partner/onboarding/vehicle");
                                        }}
                                        className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-xl transition cursor-pointer">
                                        <div className="flex -space-x-2">
                                            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center"><Bike size={12} /></div>
                                            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center"><Car size={12} /></div>
                                            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center"><Truck size={12} /></div>
                                        </div>
                                        <span className="text-sm font-medium">Become a Partner</span>
                                        <ChevronRight size={16} className="ml-auto" />
                                    </div>
                                )}
                                <button
                                    onClick={handleLogOut}
                                    className="w-full flex items-center gap-3 px-3 py-3 mt-2 hover:bg-red-50 text-red-600 rounded-xl transition"
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