'use client'

import axios from 'axios'
import { BadgeCheck, ClockAlert, Crown, LogOut, Settings, Shield, ShieldCheck, User, UserCog, Users, XCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { setUserData } from '@/redux/userSlice'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Kpi from './Kpi'

type Stats = {
  totalApprovedPartners: number,
  totalPartners: number,
  totalPendingPartners: number,
  totalRejectedPartners: number
}
const AdminDashboard = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch();
  const [stats, setStats] = useState<Stats | null>(null);


  const handleGetData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetData();
  }, []);

  const handleLogOut = async () => {
    await signOut({ redirect: false });
    dispatch(setUserData(null))
    toast.success("Logged out successfully")
    router.refresh();
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200'>
      {/* navbar  */}
      <div className='sticky top-0 bg-white/80 backdrop-blur-lg border-b z-40'>
        <div className='max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between'>

          {/* Left: Logo */}
          <div className='flex items-center gap-2 sm:gap-3'>
            <Image
              width={90}
              height={90}
              priority
              src={"/admin.png"}
              alt='logo'
              className="w-20 sm:w-28 h-auto"
            />
          </div>

          {/* Right: Desktop */}
          <div className='hidden sm:flex items-center gap-4'>

            <div className='flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-zinc-900 text-white border border-zinc-700 shadow-sm'>
              <Crown size={14} className="text-yellow-500" />
              Admin Panel
            </div>

            <button
              onClick={handleLogOut}
              className='group flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full 
                   bg-white text-zinc-900 border border-zinc-200 
                   hover:bg-zinc-900 hover:text-white hover:border-zinc-900
                   transition-all duration-300 ease-in-out active:scale-95 shadow-sm'
            >
              <span>Logout</span>
              <LogOut size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>

          </div>

          {/* Mobile Right */}
          <div className='flex sm:hidden items-center gap-2'>

            {/* Icon badge */}
            <div className='p-2 rounded-full bg-zinc-900 text-white'>
              <Crown size={16} />
            </div>

            {/* Logout icon only */}
            <button
              onClick={handleLogOut}
              className='p-2 rounded-full border border-zinc-200 bg-white hover:bg-zinc-900 hover:text-white transition'
            >
              <LogOut size={16} />
            </button>

          </div>

        </div>
      </div>

      <main className='max-w-7xl mx-auto px-6 py-12 space-y-16'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
          <Kpi label="Total Partners" value={stats?.totalPartners} icon={Users} varient={"totalPartners"} />
          <Kpi label="Approved Partners" value={stats?.totalApprovedPartners} icon={BadgeCheck} varient={"approved"} />
          <Kpi label="Pending Partners" value={stats?.totalPendingPartners} icon={ClockAlert} varient={"pending"} />
          <Kpi label="Rejected Partners" value={stats?.totalRejectedPartners} icon={XCircle} varient={"rejected"} />
        </div>
      </main>

    </div>
  )
}

export default AdminDashboard