'use client'

import React from 'react'
import { motion } from "motion/react"
import { Bike, Bus, Car, Truck } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'

const HeroSection = ({ onAuthRequired }: { onAuthRequired: () => void }) => {

    const { userData } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    return (
        <div className='relative min-h-screen w-full overflow-hidden'>

            <div
                style={{ backgroundImage: "url('/heroImage.jpg')" }}
                className='absolute inset-0 bg-cover bg-center' />

            <div className='absolute inset-0 bg-black/60' />

            <div className='relative z-10 min-h-screen flex flex-col 
            items-center justify-center px-4 text-center'>

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-white font-extrabold text-4xl sm:text-5xl md:text-7xl leading-tight"
                >
                    <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                        Book Any Vehicle
                    </span>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-3 max-w-xl text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed"
                >
                    From quick rides to heavy transport — all in one place
                </motion.p>

                {/* Icons (UPDATED ONLY THIS PART) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className='mt-8 text-gray-300 flex gap-8'
                >
                    {[Bike, Car, Bus, Truck].map((Icon, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -12, 0] }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        >
                            <Icon size={30} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Button */}
                {
                    !userData ? (
                        <motion.button
                            onClick={onAuthRequired}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='mt-10 px-10 py-4 bg-white text-black
                    rounded-full font-semibold shadow-xl'
                        >
                            Book Now
                        </motion.button>
                    ) : (
                        <motion.button
                            onClick={() => router.push('/book')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='mt-10 px-10 py-4 bg-white text-black
                    rounded-full font-semibold shadow-xl'
                        >
                            Book Now
                        </motion.button>
                    )
                }
            </div>
        </div>
    )
}

export default HeroSection