
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { CheckCircle, Loader, Loader2, Mic, MicOff, PhoneOff, Video, VideoOff, XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';


const page = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { userData } = useSelector((state: RootState) => state.user);
    const [joined, setJoined] = useState(false);
    const previewRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [loading, setLoading] = useState(false);

    const { roomId } = useParams();


    useEffect(() => {
        if (joined) return;
        let localstream: MediaStream
        const init = async () => {
            try {
                localstream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })
                setStream(localstream)
                if (previewRef.current) {
                    previewRef.current.srcObject = localstream
                }
            } catch (error) {
                console.log(error);

            }
        }
        init();
    }, []);

    const toggleCamera = () => {
        if (!stream) return;
        stream.getVideoTracks().forEach((track) => track.enabled = !isCameraOn);
        setIsCameraOn(!isCameraOn);
    }

    const toggleMic = () => {
        if (!stream) return;
        stream.getAudioTracks().forEach((track) => track.enabled = !isMicOn);
        setIsMicOn(!isMicOn);
    }

    const startCall = async () => {
        if (!containerRef) {
            return null;
        }
        setLoading(true)
        const displayName = userData?.role == "admin" ? "Admin" : `${userData?.name} (${userData?.email})`

        try {
            const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
            const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRECT

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appId,
                serverSecret!,
                roomId?.toString()!,
                userData?._id.toString()!,
                displayName
            )

            const zp = ZegoUIKitPrebuilt.create(kitToken);

            zp.joinRoom({
                container: containerRef.current,

                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
                },
                showPreJoinView: false
            });
            setJoined(true);
            setLoading(false)
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

                    {/* Show ONLY when call is active */}
                    {
                        joined && (
                            <div className='flex flex-wrap gap-3'>
                                {userData?.role === "admin" && (
                                    <>
                                        <button className='bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2'>
                                            <CheckCircle size={16} />Approve
                                        </button>
                                        <button className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm flex items-center gap-2' >
                                            <XCircle size={16} />Reject
                                        </button>
                                    </>
                                )}
                                <button className='bg-red-700 hover:bg-red-800 px-4 py-2 rounded-full text-sm flex items-center gap-2'>
                                    <PhoneOff size={16} />End Call
                                </button>
                            </div>
                        )
                    }

                    {/* Status Badge */}
                    <span className='px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20'>
                        ● {joined ? "In Call" : "Live"}
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
                <div ref={containerRef} className={`absolute inset-0 ${joined ? "block" : "hidden"}`} />
                {!joined && (
                    <div className='h-full flex items-center justify-center px-4 py-10'>
                        <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center '>
                            <div className='relative rounded-2xl overflow-hidden border border-white/10 bg-white/5'>
                                <video
                                    autoPlay

                                    playsInline
                                    className='w-full h-75 sm:h-100 object-cover'
                                    ref={previewRef} />
                                {!isCameraOn && (
                                    <div className='absolute inset-0 bg-black flex items-center justify-center'>
                                        <VideoOff size={40} />
                                    </div>
                                )}
                            </div>
                            <div className='space-y-8 text-center lg:text-left'>
                                <h1 className='text-3xl sm:text-4xl font-bold'>
                                    Secure Video KYC
                                </h1>
                                <div className='flex justify-center lg:justify-start gap-6'>
                                    <button
                                        onClick={toggleCamera}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition
                                             ${isCameraOn ? "bg-white text-black " :
                                                "bg-white/10 border border-white/20"
                                            }`}
                                    >
                                        {isCameraOn ? <Video /> : <VideoOff />}
                                    </button>
                                    <button
                                        onClick={toggleMic}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition
                                             ${isMicOn ? "bg-white text-black " :
                                                "bg-white/10 border border-white/20"
                                            }`}
                                    >
                                        {isMicOn ? <Mic /> : <MicOff />}
                                    </button>
                                </div>


                                <button
                                    disabled={loading}
                                    onClick={startCall}
                                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold tracking-wide
  transition-all duration-300 shadow-md
  ${loading
                                            ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                                            : "bg-white text-black hover:bg-gray-100 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                        }`}
                                >
                                    {loading ? (
                                        <><Loader className="animate-spin w-5 h-5" /> Connecting...</>
                                    ) : (
                                        <>

                                            Join Secure Call
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default page


