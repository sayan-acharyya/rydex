
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';


const page = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { userData } = useSelector((state: RootState) => state.user);
    const [joined, setJoined] = useState(false);
    const previewRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(()=>{

    },[]);

    const startCall = async () => {
        if (!containerRef) {
            return null;
        }
        try {
            const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
            const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRECT

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appId,
                serverSecret!,
                "jnvkfd",
                userData?._id.toString()!,
                "Sayan Acharyya"
            )

            const zp = ZegoUIKitPrebuilt.create(kitToken);

            zp.joinRoom({
                container: containerRef.current,

                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
                },
                showPreJoinView: false
            });
            setJoined(true)
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div className='min-h-screen bg-black text-white flex flex-col'>

            {/* Header */}
            <div className='px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/80 backdrop-blur-md sticky top-0 z-50'>

                <div className='flex items-center gap-4'>

                    {/* Logo */}
                    {userData?.role === "admin" ? (
                        <Image
                            width={80}
                            height={80}
                            priority
                            src={"/adminv.png"}
                            alt='logo'
                            className="w-16 sm:w-20 h-auto object-contain"
                        />
                    ) : (
                        <img
                            width={80}
                            height={80}
                            src={"/logo.jpeg"}
                            alt="logo"
                            className="w-16 sm:w-20 h-auto object-contain rounded-lg"
                        />
                    )}

                    {/* Text Section */}
                    <div>
                        <h1 className='text-lg sm:text-xl font-semibold tracking-wide'>
                            {userData?.role === "admin" ? "RYDEX Admin" : "RYDEX Partner"}
                        </h1>

                        <p className='text-xs text-gray-400 mt-1'>
                            {userData?.role === "admin"
                                ? "Verification Dashboard"
                                : "Video KYC Dashboard"}
                        </p>
                    </div>

                </div>

                {/* Optional Right Section (future use) */}
                <div className='flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end'>

                    {/* Status Badge */}
                    <span className='px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20'>
                        ● Live
                    </span>

                    {/* User Info */}
                    <div className='text-right hidden sm:block'>
                        <p className='text-sm font-medium'>
                            {userData?.name || "User"}
                        </p>
                        <p className='text-xs text-gray-400'>
                            {userData?.role}
                        </p>
                    </div>



                </div>

            </div>

            <div className='flex-1 relative '>
                {!joined && (
                    <div className='h-full flex items-center justify-center px-4 py-10'>
                        <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center '>
                            <div className='relative rounded-2xl overflow-hidden border border-white/10 bg-white/5'>
                                <video ref={previewRef} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default page


//5:50:25