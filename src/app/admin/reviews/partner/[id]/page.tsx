'use client'
import AnimatedCard from '@/components/AnimatedCard'
import DocPreview from '@/components/DocPreview'
import { IPartnerBank } from '@/models/partnerBank.model'
import { IPartnerDocs } from '@/models/partnerDocs.model'
import { IUser } from '@/models/user.model'
import { IVehicle } from '@/models/vehicle.model'
import axios from 'axios'
import { ArrowLeft, Car, CheckCircle, Clock, FileText, Landmark, ShieldCheck, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import toast from 'react-hot-toast'



const page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [vehicleDetails, setVehicleDetails] = useState<IVehicle | null>(null);
  const [partnerDocs, setPartnerDocs] = useState<IPartnerDocs | null>(null);
  const [partnerBank, setPartnerBank] = useState<IPartnerBank | null>(null);
  const [showApproved, setShowApproved] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approveLoading, setApproveLoading] = useState(false); // ✅ added


  const handleGetPartner = async () => {
    try {
      const { data } = await axios.get(`/api/admin/reviews/partner/${id}`);
      setData(data.partner);
      setVehicleDetails(data.vehicle);
      setPartnerDocs(data.documents);
      setPartnerBank(data.bank);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }


  const handleApproved = async () => {
    try {
      setApproveLoading(true); // ✅ start loading

      const { data } = await axios.get(`/api/admin/reviews/partner/${id}/approve`);
      toast.success("Partner approved successfully");
      setShowApproved(false);
      await handleGetPartner();
      
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve partner ");
    } finally {
      setApproveLoading(false); // ✅ stop loading
    }
  }
  
  const handleRejected = async () => {
    try {
      const { data } = await axios.post(`/api/admin/reviews/partner/${id}/reject`, { rejectionReason });
      toast.success("Partner rejected successfully");
      setShowReject(false);
      await handleGetPartner();
       
      
    } catch (error) {
      console.log(error);
      toast.error("Failed to rejected partner ");
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
          {/* back button */}
          <button
            onClick={() => router.back()}
            className='w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center 
          hover:bg-gray-100 transition'
          >
            <ArrowLeft size={18} />
          </button>

          {/* header name and email */}
          <div className='flex-1'>
            <div className='font-semibold'>
              {data?.name}
            </div>
            <div className='text-xs text-gray-500'>
              {data?.email}
            </div>
          </div>

          {/* status button  */}
          <>
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
          </>


        </div>
      </div>

      <main className='max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10'>

        <div className='lg:col-span-2 space-y-8 '>
          {/* vehicle details */}
          <AnimatedCard title="Vehicle Details" icon={<Car size={18} />}>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Vehicle Type:</span>
              <span className='font-semibold text-lg'>{vehicleDetails?.type || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Registration Number:</span>
              <span className='font-semibold text-md'>{vehicleDetails?.number || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Model:</span>
              <span className='font-semibold text-md'>{vehicleDetails?.vehicleModel || "-"}</span>
            </div>
          </AnimatedCard>
          {/* partner docs */}
          <AnimatedCard title="Documents" icon={<FileText size={18} />}>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              <DocPreview label={"Aadhaar"} url={partnerDocs?.aadharUrl} />
              <DocPreview label={"Driving License"} url={partnerDocs?.licenseUrl} />
              <DocPreview label={"Registration Certificate"} url={partnerDocs?.rcUrl} />
            </div>
          </AnimatedCard>
        </div>

        <div className='space-y-8'>
          <AnimatedCard title={'Bank Details'} icon={<Landmark size={18} />}>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Account Hodel:</span>
              <span className='font-semibold text-lg'>{partnerBank?.accountHolder || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Account Number:</span>
              <span className='font-semibold text-md'>{partnerBank?.accountNumber || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>IFSC Code:</span>
              <span className='font-semibold text-md'>{partnerBank?.ifsc || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>UPI:</span>
              <span className='font-semibold text-md'>{partnerBank?.upi || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Mobile Number:</span>
              <span className='font-semibold text-md'>{data?.mobileNumber || "-"}</span>
            </div>
          </AnimatedCard>
          {data?.partnerStatus == "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white rounded-4xl p-8 shadow-xl space-y-6'
            >
              <div className='flex items-center gap-2 font-semibold'>
                <ShieldCheck size={18} />
                Admin Check
              </div>
              <p className='text-sm text-gray-500'>
                Verify documents carefully before approving
              </p>
              <div className='flex flex-col gap-4'>
                <button
                  onClick={() => setShowApproved(true)}
                  className='py-3   rounded-2xl bg-linear-to-r from-black to-gray-800 text-white 
              font-semibold hover:opacity-90 transition'
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowReject(true)}
                  className='py-3 rounded-2xl bg-gray-200  font-semibold hover:bg-gray-300 transition'>
                  Reject
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* confermatin model */}
      {
        <AnimatePresence>
          {
            showApproved && (
              <motion.div
                className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center
                justify-center px-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className='bg-white rounded-3xl p-6 w-full max-w-sm'
                >
                  <h2 className='text-lg font-bold'>Approved Partner ?</h2>
                  <p className='text-sm text-gray-500 mt-2'>Confirm all information has been verified.</p>

                  <div className='flex gap-3 mt-6'>
                    <button
                      onClick={() => setShowApproved(false)}
                      className='flex-1 py-2 rounded-xl bg-gray-200 hover:bg-gray-300'>Cancle</button>
                    <button
                      onClick={handleApproved}
                      disabled={approveLoading}
                      className='flex-1 py-2 rounded-xl bg-gray-950 hover:bg-gray-900 text-white 
                      disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                      {
                        approveLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Approving...
                          </>
                        ) : (
                          "Yes, Approved"
                        )
                      }
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )
          }
        </AnimatePresence>
      }

      {/* rejction model */}
      {
        <AnimatePresence>
          {
            showReject && (
              <motion.div
                className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center
                justify-center px-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className='bg-white rounded-3xl p-6 w-full max-w-sm'
                >
                  <h2 className='text-lg font-bold'>Reject Partner ?</h2>
                  <p className='text-sm text-gray-500 mt-2' >
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder='Enter rejection reason (required)'
                      className='w-full mt-3 border rounded-xl p-3 text-sm border-gray-500'
                    />
                  </p>

                  <div className='flex gap-3 mt-6'>
                    <button
                      onClick={() => setShowReject(false)}
                      className='flex-1 py-2 rounded-xl bg-gray-200 hover:bg-gray-300'>Cancle</button>
                    <button
                      onClick={handleRejected}
                      className='flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white'>
                      Reject
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )
          }
        </AnimatePresence>
      }
    </div>
  )
}

export default page;