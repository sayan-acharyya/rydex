'use client'
import React from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

type Props = {
    icon: React.ReactNode;
    title: string;
    button: string;
    onClick: () => void;
}

const ActionCard = ({ icon, title, button, onClick }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 py-4 flex items-center justify-between shadow-sm transition"
        >
            {/* subtle gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Left */}
            <div className="flex items-center gap-3 z-10">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center 
                bg-purple-100 text-purple-700 shadow-inner">
                    {icon}
                </div>

                <div>
                    <p className="text-sm font-semibold text-gray-900">
                        {title}
                    </p>
                    <p className="text-xs text-gray-400">
                        Secure video verification in progress
                    </p>
                </div>
            </div>

            {/* Right */}
            <motion.button
                onClick={onClick}
                whileTap={{ scale: 0.95 }}
                className="z-10 flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold 
                transition-all"
            >
                {button}
                <ArrowRight size={15} />
            </motion.button>
        </motion.div>
    )
}

export default ActionCard;