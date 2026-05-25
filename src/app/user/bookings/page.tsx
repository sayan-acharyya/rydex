
'use client'
import { BookingStatus, PaymentStatus } from '@/models/booking.model';
import { IUser } from '@/models/user.model';
import { IVehicle } from '@/models/vehicle.model';
import axios from 'axios'
import { ArrowLeft, Bike, Calendar, Car, ChessKing, ChevronRight, Crown, IndianRupee, Loader2, MapPin, Phone, Shield, ShieldUser, Truck, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


interface IBooking {
    user: IUser;
    driver: IUser;
    vehicle: IVehicle;

    pickUpAddress: string;
    dropAddress: string;

    pickUpLocation: {
        type: "Point";
        coordinates: [number, number]; // [lng, lat]
    };

    dropLocation: {
        type: "Point";
        coordinates: [number, number]; // [lng, lat]
    };

    fare: number;

    userMobileNumber: string;
    driverMobileNumber: string;

    bookingStatus: BookingStatus;
    paymentStatus: PaymentStatus;
    paymentDeadline: Date;

    adminCommission: number;
    partnerAmount: number;

    pickUpOtp?: string;
    pickUpOtpExpires?: Date;

    dropOtp?: string;
    dropOtpExpires?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}


const page = () => {
    const router = useRouter();
    const { userData } = useSelector((state: RootState) => state.user)

    const [bookings, setBookings] = useState<IBooking[] | []>([]);

    const [selectStatus, setSelectStatus] = useState("All");
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get("/api/user/bookings");
                setBookings(data)
                setLoading(false)
            } catch (error: any) {
                console.log(error.response.data.message);
                setLoading(false)
            }
        }
        fetch();
    }, []);

    const filterBookings = selectStatus === "All"
        ? bookings
        : bookings.filter(b => b.bookingStatus === selectStatus.toLowerCase());

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
            completed: "bg-teal-100 text-teal-700 border-teal-200",
            requested: "bg-amber-100 text-amber-700 border-amber-200",
            awaiting_payment: "bg-blue-100 text-blue-700 border-blue-200",
            cancelled: "bg-rose-100 text-rose-700 border-rose-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
            expired: "bg-gray-100 text-gray-700 border-gray-200",
        };

        return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    const getVehicleIcon = (vehicleType?: string) => {
        switch (vehicleType?.toLowerCase()) {
            case "bike":
                return <Bike className="w-4 h-4 text-gray-400" />;

            case "auto":
                return <Car className="w-4 h-4 text-gray-400" />; // Replace with Auto icon if available

            case "truck":
                return <Truck className="w-4 h-4 text-gray-400" />;

            case "loading":
            case "car":
            default:
                return <Car className="w-4 h-4 text-gray-400" />;
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);

        return date
            .toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            })
            .replace(",", "");
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* heading */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto py-5">

                        <div className="flex items-center justify-between">

                            {/* Left Content */}
                            <div className="flex items-center gap-4">

                                <button
                                    onClick={() => router.back()}
                                    className="h-11 w-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                                </button>

                                <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                    <Car className="w-5 h-5 text-blue-600" />
                                </div>

                                <div>
                                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                                        My Bookings
                                    </h1>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {bookings.length}{" "}
                                        {bookings.length === 1 ? "ride" : "rides"} in your history
                                    </p>
                                </div>

                            </div>

                            {/* Right Badge */}
                            <span className="px-3 py-1 flex items-center gap-1.5 border border-blue-200 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                <User size={15} />
                                {userData?.name}
                            </span>

                        </div>

                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div className='max-w-3xl mx-auto'>

                    <div className='flex justify-between items-center mb-6'>
                        <div className='text-sm text-gray-500'>
                            Showing {filterBookings.length} bookings
                        </div>
                        <select
                            value={selectStatus}
                            onChange={(e) => setSelectStatus(e.target.value)}
                            className='bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option>All</option>
                            <option>requested</option>
                            <option >awaiting_payment</option>
                            <option >confirmed</option>
                            <option >started</option>
                            <option >completed</option>
                            <option >cancelled</option>
                            <option >rejected</option>
                            <option >expired</option>
                        </select>
                    </div>

                    {loading && (
                        <div className='flex justify-center py-16'>
                            <Loader2 className='animate-spin w-8 h-8 text-black' />
                        </div>
                    )}

                    {
                        !loading && filterBookings.length == 0 && (
                            <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
                                <Car className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                                <h1 className='text-lg font-medium text-gray-900'>
                                    No bookings yet
                                </h1>
                                <p className='text-gray-500 text-sm mt-1'>
                                    When customers book rides, they'll appear here
                                </p>
                            </div>
                        )
                    }

                    {
                        !loading && filterBookings.length > 0 && (
                            <div className='space-y-4'>
                                {
                                    filterBookings.map((b, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <div className='bg-white rounded-xl border border-gray-200
                      shadow-sm hover:shadow-md transition-all overflow-hidden'>
                                                <div className='flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200 '>
                                                    <div className='w-12 h-12 rounded-full overflow-hidden bg-blue-200  shrink-0 
                          border-2 border-white shadow-sm flex items-center justify-center'>
                                                        <User className='w-6 h-6 text-blue-600' />
                                                    </div>
                                                    <div className='flex-1'>
                                                        <div className='flex items-center justify-between'>
                                                            <h3 className='font-semibold text-gray-900 uppercase'>
                                                                {b.driver.name || "Customer"}
                                                            </h3>
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(b.bookingStatus)}`}
                                                            >
                                                                {b.bookingStatus || "-"}
                                                            </span>
                                                        </div>

                                                        <div className='flex items-center gap-1 mt-1 text-xs text-gray-600'>
                                                            <Phone className='w-3 h-3' />
                                                            <span>{b.driverMobileNumber}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='px-4 pt-3'>
                                                    <div className='bg-gray-50 rounded-lg p-2 flex items-center gap-2'>
                                                        {getVehicleIcon(b.vehicle.type)}
                                                        <div className='text-xs text-gray-600'>
                                                            {b.vehicle?.vehicleModel} • {b.vehicle?.number || "Vehicle not assigned"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 space-y-4">
                                                    {/* Pickup */}
                                                    <div className="flex gap-3">

                                                        <div className="flex flex-col items-center">
                                                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                                                                <MapPin className="w-3.5 h-3.5 text-green-600" />
                                                            </div>

                                                            {/* Line */}
                                                            <div className="w-px flex-1 bg-gray-300 my-1"></div>
                                                        </div>

                                                        <div className="pb-4">
                                                            <span className="text-[11px] font-semibold text-green-600 uppercase tracking-wider">
                                                                Pickup
                                                            </span>

                                                            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                                                {b.pickUpAddress}
                                                            </p>
                                                        </div>

                                                    </div>
                                                    {/* Drop */}
                                                    <div className="flex gap-3">

                                                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                                            <MapPin className="w-3.5 h-3.5 text-red-600" />
                                                        </div>

                                                        <div>
                                                            <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">
                                                                Drop
                                                            </span>

                                                            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                                                {b.dropAddress}
                                                            </p>
                                                        </div>

                                                    </div>

                                                </div>

                                                <div className='flex items-center justify-between px-4 py-3
                        bg-gray-50 border-t border-gray-200'>
                                                    <div className=' flex items-center gap-2 text-sm text-gray-600'>
                                                        <Calendar className='w-4 h-4 text-gray-400' />
                                                        <span>{formatDate(b.createdAt?.toString()!)}</span>
                                                    </div>
                                                    <div className='flex items-center gap-1 font-semibold text-gray-900'>
                                                        <IndianRupee className='w-4 h-4' />
                                                        <span>{b.fare}</span>
                                                    </div>
                                                </div>

                                                <div className='flex items-center justify-between px-4 py-3 border-t border-gray-200'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='text-xs text-gray-500'>Payment:</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${b.paymentStatus == "paid" ?
                                                            "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                            }`}>
                                                            {b.paymentStatus}
                                                        </span>
                                                    </div>
                                                    {
                                                        b.bookingStatus !== "completed" && (
                                                            <div className='flex items-center gap-2'>
                                                                <button
                                                                    onClick={() => router.push(`/user/active-ride`)}
                                                                    className='flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700
                              bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-lg transition-colors'>
                                                                    <span>Details</span>
                                                                    <ChevronRight className='w-4 h-4' />
                                                                </button>
                                                            </div>
                                                        )
                                                    }
                                                </div>

                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default page;
