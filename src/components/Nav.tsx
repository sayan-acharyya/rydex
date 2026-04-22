'use client'

import React, { useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthModel from './AuthModel'

const Nav = () => {

    const Nav_Items = ["Home", "Bookings", "About Us", "Contact"]
    const pathName = usePathname()
    const [authOpen, setAuthOpen] = useState(false)

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
                    <motion.button
                        onClick={() => setAuthOpen(true)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-5 py-2 rounded-full text-sm font-semibold
                    bg-white text-black shadow-md hover:bg-gray-200 transition'
                    >
                        Login
                    </motion.button>

                </div>


            </motion.div>
            
            <AuthModel open={authOpen} onClose={() => setAuthOpen(false)} />

        </>
    )
}

export default Nav