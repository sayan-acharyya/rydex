'use client'
import Image from 'next/image'
import React from 'react'
import { FileText, ImageIcon } from 'lucide-react'

const DocPreview = ({ label, url }: any) => {
    const cleanUrl = url?.split('?')[0] || ""

    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(cleanUrl)
    const isPdf = cleanUrl.toLowerCase().endsWith('.pdf')

    return (
        <div className='group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden'>
            
            {/* Header */}
            <div className='px-4 py-3 border-b text-sm font-semibold text-gray-700 flex items-center justify-between'>
                <span>{label}</span>
                {url && (
                    <span className='text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500'>
                        Preview
                    </span>
                )}
            </div>

            {/* Preview Area */}
            <div className='h-52 relative flex items-center justify-center bg-gray-50'>
                
                {/* Empty State */}
                {!url && (
                    <div className='flex flex-col items-center text-gray-400'>
                        <ImageIcon size={28} />
                        <span className='text-xs mt-2'>No file uploaded</span>
                    </div>
                )}

                {/* Image Preview */}
                {isImage && (
                    <img
                        src={url}
                        alt={label}
                        
                        className='object-cover'
                    />
                )}

                {/* PDF Preview */}
                {isPdf && (
                    <iframe
                        src={url}
                        className='w-full h-full'
                    />
                )}

                {/* Fallback for other file types */}
                {!isImage && !isPdf && url && (
                    <div className='flex flex-col items-center text-gray-500'>
                        <FileText size={28} />
                        <span className='text-xs mt-2'>Unsupported preview</span>
                    </div>
                )}

                {/* Hover Overlay */}
                {url && (
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition'>
                        <a
                            href={url}
                            target='_blank'
                            className='text-white text-xs bg-black/60 px-3 py-1.5 rounded-md'
                        >
                            View Full
                        </a>
                    </div>
                )}
            </div>

            {/* Footer */}
            {url && (
                <a
                    href={url}
                    target='_blank'
                    className='block text-center text-xs py-2 font-medium text-gray-600 hover:bg-gray-100 transition'
                >
                    Open Full Document
                </a>
            )}
        </div>
    )
}

export default DocPreview