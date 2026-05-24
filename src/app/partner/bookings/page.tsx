
'use client'
import { BookingStatus, PaymentStatus } from '@/models/booking.model';
import { IUser } from '@/models/user.model';
import { IVehicle } from '@/models/vehicle.model';
import axios from 'axios'
import { Car } from 'lucide-react';
import React, { useEffect, useState } from 'react'


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
  const [bookings, setBookings] = useState<IBooking[] | []>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("/api/partner/bookings");
        setBookings(data)

      } catch (error) {
        console.log(error);

      }
    }
    fetch();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* heading */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto py-6'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-100 p-2 rounded-lg'>
                <Car className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  Partner Bookings
                </h1>
                <p className='text-gray-500 text-sm mt-1'>
                  {bookings.length} {bookings.length === 1 ? "ride" : "rides"} assigned to you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='max-w-3xl mx-auto'>

          <div className='flex justify-between'>

          </div>

        </div>
      </div>

    </div>
  )
}

export default page