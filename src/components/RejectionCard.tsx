'use client'
import { AlertTriangle } from 'lucide-react'
import React from 'react'

const RejectionCard = ({ title, reason, actionLabel, onAction }: any) => {
    return (
        <div className='relative bg-red-50/60 border border-red-200 
        rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 
        shadow-sm hover:shadow-md transition-all duration-300'>

            {/* Header */}
            <div className='flex items-center gap-3 mb-4'>
                <div className='w-9 h-9 flex items-center justify-center 
                rounded-xl bg-red-100 text-red-600'>
                    <AlertTriangle size={18} />
                </div>

                <h3 className='text-red-700 font-semibold text-sm sm:text-base md:text-lg'>
                    {title || "Verification Failed"}
                </h3>
            </div>

            {/* Reason */}
            <div className='bg-white border border-gray-200 rounded-xl p-4 
            text-sm sm:text-base text-gray-700 leading-relaxed'>
                {reason || "Your documents could not be verified. Please upload valid documents."}
            </div>

            {/* Action */}
            {onAction && (
                <div className='mt-5'>
                    <button
                        onClick={onAction}
                        className='w-full sm:w-auto px-6 py-2.5 
                        bg-red-600 text-white rounded-xl 
                        text-sm sm:text-base font-medium 
                        hover:bg-red-700 active:scale-[0.98] 
                        transition-all duration-200 shadow-sm'
                    >
                        {actionLabel || "Upload Again"}
                    </button>
                </div>
            )}
        </div>
    )
}

export default RejectionCard