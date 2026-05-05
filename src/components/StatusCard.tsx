'use client'
import React from 'react'

const StatusCard = ({ icon, title, desc }: any) => {
    return (
        <div className='bg-blue-50/60 border border-blue-200 
        rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 
        shadow-sm hover:shadow-md transition-all duration-300'>

            {/* Header */}
            <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 flex items-center justify-center 
                rounded-xl bg-blue-100 text-blue-600'>
                    {icon}
                </div>

                <h3 className='text-blue-700 font-semibold 
                text-sm sm:text-base md:text-lg'>
                    {title}
                </h3>
            </div>

            {/* Description */}
            <p className='text-sm sm:text-base text-gray-700 leading-relaxed'>
                *** {desc}.
            </p>
        </div>
    )
}

export default StatusCard