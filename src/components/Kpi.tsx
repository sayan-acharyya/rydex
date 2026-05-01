'use client'
import React from 'react'
import { motion } from "framer-motion"

type KpiStyle = {
    iconBG: string;
    iconColor: string;
    glowColor: string;
    accent: string;
};

export const KPI_CONFIG: Record<string, KpiStyle> = {
    totalPartners: {
        iconBG: "bg-purple-50",
        iconColor: "text-purple-600",
        glowColor: "group-hover:shadow-purple-200/50",
        accent: "bg-purple-600",
    },
    approved: {
        iconBG: "bg-emerald-50",
        iconColor: "text-emerald-600",
        glowColor: "group-hover:shadow-emerald-200/50",
        accent: "bg-emerald-600",
    },
    pending: {
        iconBG: "bg-amber-50",
        iconColor: "text-amber-600",
        glowColor: "group-hover:shadow-amber-200/50",
        accent: "bg-amber-600",
    },
    rejected: {
        iconBG: "bg-red-50",
        iconColor: "text-red-600",
        glowColor: "group-hover:shadow-red-200/50",
        accent: "bg-red-600",
    },
};

const Kpi = ({ label, value, icon: Icon, varient }: any) => {
    const cfg = KPI_CONFIG[varient] || KPI_CONFIG.totalPartners;

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`group relative bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden ${cfg.glowColor}`}
        >
            {/* Premium Animated Background Gradient */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 ${cfg.accent}`} />

            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            <div className='relative z-10 flex flex-col gap-4'>
                <div className='flex items-start justify-between'>
                    <motion.div
                        whileHover={{ rotate: -8, scale: 1.1 }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${cfg.iconBG}`}
                    >
                        <Icon className={`w-6 h-6 ${cfg.iconColor}`} strokeWidth={2.5} />
                    </motion.div>

                    {/* Tiny accent bar */}
                    <div className={`w-1 h-8 rounded-full opacity-20 ${cfg.accent}`} />
                </div>

                <div>
                    <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-1'>
                        {label}
                    </p>

                    <div className='flex items-baseline gap-1'>
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='text-3xl font-black text-zinc-900 tracking-tight'
                        >
                            {value}
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${cfg.accent}`} />
        </motion.div>
    )
}

export default Kpi;


//2:13:40