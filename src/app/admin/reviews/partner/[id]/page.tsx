'use client'
import { IUser } from '@/models/user.model'
import axios from 'axios'
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'



const page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const handleGetPartner = async () => {
    try {
      const { data } = await axios.get(`/api/admin/reviews/partner/${id}`);
      setData(data.partner);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetPartner();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>

          {/* Text */}
          <p className="text-gray-600 text-sm font-medium">
            Loading partner details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200'>
      <div className='sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b'>
        <div className='max-w-7xl mx-auto px-4 h-16 flex items-center gap-4'>

          <button
            onClick={() => router.back()}
            className='w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center 
          hover:bg-gray-100 transition'
          >
            <ArrowLeft size={18} />
          </button>

          <div className='flex-1'>
            <div className='font-semibold'>
              {data?.name}
            </div>
            <div className='text-xs text-gray-500'>
              {data?.email}
            </div>
          </div>

          {
            data?.partnerStatus === 'approved' ? (
              <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex 
              items-center gap-2 bg-green-100 text-green-700'>
                <CheckCircle size={14} />
                Approved
              </div>
            )
              : data?.partnerStatus === 'rejected' ? (
                <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex 
              items-center gap-2 bg-red-100 text-red-700'>
                  <XCircle size={14} />
                  Rejected
                </div>
              ) : (
                <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex 
              items-center gap-2 bg-yellow-100 text-yellow-700'>
                  <Clock size={14} />
                  Pending
                </div>
              )
          }


        </div>
      </div>
    </div>
  )
}

export default page