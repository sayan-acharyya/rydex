'use client'

import axios from 'axios'
import {
  BadgeCheck,
  ClockAlert,
  Crown,
  LogOut,
  Truck,
  Users,
  Video,
  XCircle
} from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { setUserData } from '@/redux/userSlice'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Kpi from './Kpi'
import TabButton from './TabButton'
import { AnimatePresence, motion } from 'motion/react'
import ContentList from './ContentList'

type Stats = {
  totalApprovedPartners: number
  totalPartners: number
  totalPendingPartners: number
  totalRejectedPartners: number
}

type Tab = "partner" | "kyc" | "vehicle"

// You can improve this later based on real API shape
type Review = {
  _id?: string
}

const AdminDashboard = () => {
  const router = useRouter()
  const { userData } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  const [stats, setStats] = useState<Stats | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("partner")

  // ✅ FIXED: initialize as arrays
  const [partnerReviews, setPartnerReviews] = useState<Review[]>([])
  const [pendingKyc, setPendingKyc] = useState<Review[]>([])
  const [vehicleReviews, setVehicleReviews] = useState<Review[]>([])

  const handleGetData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard")

      setStats(data.stats)

      // ✅ Safe fallback in case API returns undefined
      setPartnerReviews(data.pendingPartnersReviews || [])

    } catch (error) {
      console.log(error)
    }
  }

  const handleGetPendingKYC = async () => {
    try {
      const { data } = await axios.get("/api/admin/video-kyc/pending")
  
      setPendingKyc(data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    handleGetData();
    handleGetPendingKYC();
  }, [])

  const handleLogOut = async () => {
    await signOut({ redirect: false })
    dispatch(setUserData(null))
    toast.success("Logged out successfully")
    router.refresh()
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200'>

      {/* Navbar */}
      <div className='sticky top-0 bg-white/80 backdrop-blur-lg border-b z-40'>
        <div className='max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between'>

          {/* Logo */}
          <Image
            width={90}
            height={90}
            priority
            src={"/admin.png"}
            alt='logo'
            className="w-20 sm:w-28 h-auto"
          />

          {/* Desktop */}
          <div className='hidden sm:flex items-center gap-4'>
            <div className='flex items-center gap-2 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full bg-zinc-900 text-white'>
              <Crown size={14} className="text-yellow-500" />
              Admin Panel
            </div>

            <button
              onClick={handleLogOut}
              className='group flex items-center gap-2 text-sm px-5 py-2 rounded-full bg-white border  border-gray-300 hover:bg-zinc-900 hover:text-white transition'
            >
              Logout
              <LogOut size={16} />
            </button>
          </div>

          {/* Mobile */}
          <div className='flex sm:hidden items-center gap-2'>
            <Crown size={16} />
            <button onClick={handleLogOut}>
              <LogOut size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* Main */}
      <main className='max-w-7xl mx-auto px-6 py-12 space-y-16'>

        {/* KPI */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
          <Kpi label="Total Partners" value={stats?.totalPartners} icon={Users} varient="totalPartners" />
          <Kpi label="Approved Partners" value={stats?.totalApprovedPartners} icon={BadgeCheck} varient="approved" />
          <Kpi label="Pending Partners" value={stats?.totalPendingPartners} icon={ClockAlert} varient="pending" />
          <Kpi label="Rejected Partners" value={stats?.totalRejectedPartners} icon={XCircle} varient="rejected" />
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-2xl p-2 shadow-lg   flex flex-wrap gap-2'>

          <TabButton
            active={activeTab === "partner"}
            count={partnerReviews.length}   // ✅ safe now
            icon={<Users size={15} />}
            onClick={() => setActiveTab("partner")}
          >
            Pending Partner Reviews
          </TabButton>

          <TabButton
            active={activeTab === "kyc"}
            count={pendingKyc.length}       // ✅ safe now
            icon={<Video size={15} />}
            onClick={() => setActiveTab("kyc")}
          >
            Pending Video KYC
          </TabButton>

          <TabButton
            active={activeTab === "vehicle"}
            count={vehicleReviews.length}   // ✅ safe now
            icon={<Truck size={15} />}
            onClick={() => setActiveTab("vehicle")}
          >
            Pending Vehicle Reviews
          </TabButton>

        </div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className='space-y-3'
          >
            {activeTab == "partner" &&
              <ContentList
                data={partnerReviews}
                type={"partner"}
              />
            }

            {activeTab == "kyc" &&
              <ContentList
                data={pendingKyc}
                type={"kyc"}
              />
            }

            {activeTab == "vehicle" &&
              <ContentList
                data={vehicleReviews}
                type={"vehicle"}
              />
            }

          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  )
}

export default AdminDashboard;
 