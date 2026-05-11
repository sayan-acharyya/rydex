'use client'
import React, { useState } from 'react'
import { motion } from "motion/react"
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { vehicleType } from '@/models/vehicle.model'
import SearchMap from '@/components/SearchMap'

const page = () => {
    const router = useRouter();
    const params = useSearchParams();

    const [pickUp, setPickUp] = useState(params.get("pickup") || "");
    const [drop, setDrop] = useState(params.get("drop") || "");
    const [km, setKm] = useState<number>();

    const mobile = params.get("mobile");
    const pickUpLat = Number(params.get("pickuplat"))
    const pickUpLon = Number(params.get("pickuplon"))
    const dropLon = Number(params.get("droplat"))
    const dropLat = Number(params.get("droplon"))
    const vehicle = params.get("vehicle")

    return (
        <div className='min-h-screen bg-zinc-100 text-zinc-900 overflow-x-hidden'>
            <div className='absolute top-5 left-5 z-50'>
                <motion.button
                    onClick={() => router.back()}
                    whileTap={{ scale: 0.88 }}
                    className='w-11 h-11 rounded-full bg-white border border-zinc-200 shadow-sm flex
                            items-center justify-center hover:bg-zinc-50 transition-colors shrink-0'
                >
                    <ArrowLeft size={18} className='text-zinc-900' />
                </motion.button>
            </div>

            <div className='relative w-full h-[52vh] z-0'>
                <SearchMap
                    pickUp={pickUp}
                    drop={drop}
                    onChange={(p, d) => { setPickUp(p); setDrop(d) }}
                    onDistance={setKm}
                />
            </div>

        </div>
    )
}

export default page