'use client'

import axios from 'axios'
import { ArrowLeft, CalendarDays, Mail, Trash2, User, Inbox, MessageSquareText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Message = {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

const Page = () => {
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('/api/admin/messages')
      setMessages(data)
    } catch (error) {
      console.log(error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    try {
      setDeleteLoading(id)
      const { data } = await axios.delete('/api/admin/messages', {
        data: { id }
      })
      toast.success(data.message)
      setMessages((prev) => prev.filter((msg) => msg._id !== id))
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete message')
    } finally {
      setDeleteLoading(null)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-white p-4 sm:p-8 relative overflow-hidden'>
      {/* Decorative clean grid background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none -z-10" />

      <div className='max-w-6xl mx-auto'>

        {/* Top Management Header Layout */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 pb-6 border-b border-zinc-200/60'>
          <div className='space-y-1.5'>
            <div className='inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/5 text-zinc-800 text-xs font-semibold tracking-wide uppercase border border-zinc-900/10 mb-1'>
              <MessageSquareText size={12} className='text-zinc-600' />
              Communications Panel
            </div>
            <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700'>
              Contact Messages
            </h1>
            <p className='text-zinc-500 text-sm max-w-xl'>
              Review and manage high-priority inbound inquiries processed from user submissions.
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className='inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold px-5 py-3 rounded-xl transition duration-200 shadow-md shadow-zinc-900/10 hover:scale-[1.01] shrink-0'
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>

        {/* Global Skeleton / Loading State */}
        {loading && (
          <div className='space-y-4'>
            {[1, 2, 3].map((skeletonIndex) => (
              <div key={skeletonIndex} className='bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-4 animate-pulse shadow-sm'>
                <div className='flex justify-between items-center'>
                  <div className='h-4 bg-zinc-200 rounded w-1/4' />
                  <div className='h-3 bg-zinc-200 rounded w-1/6' />
                </div>
                <div className='h-4 bg-zinc-200 rounded w-1/3' />
                <div className='h-20 bg-zinc-100 rounded-xl w-full' />
              </div>
            ))}
          </div>
        )}

        {/* Zero-State Visual Frame */}
        {!loading && messages.length === 0 && (
          <div className='bg-white border border-zinc-200/80 rounded-[2rem] p-16 text-center shadow-sm max-w-2xl mx-auto mt-8 relative overflow-hidden'>
            <div className='w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center mx-auto text-zinc-400 mb-6'>
              <Inbox size={28} strokeWidth={1.5} />
            </div>
            <h2 className='text-xl font-bold tracking-tight text-zinc-900 mb-2'>
              Inbox Clear
            </h2>
            <p className='text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed'>
              There are no new form entries to display. Inbound user messages will automatically queue here when received.
            </p>
          </div>
        )}

        {/* Real-Time Message Rendering Stream */}
        {!loading && messages.length > 0 && (
          <div className='space-y-6'>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className='bg-white rounded-[1.75rem] border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8 flex flex-col justify-between group'
              >
                {/* Meta Matrix Header */}
                <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 mb-5 border-b border-zinc-100/80'>
                  
                  {/* Sender Context */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2.5 text-zinc-900'>
                      <div className='w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 border border-zinc-200/40 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300'>
                        <User size={14} />
                      </div>
                      <span className='font-bold tracking-tight text-base sm:text-lg'>
                        {msg.name}
                      </span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-150 pl-1.5'>
                      <Mail size={14} className='text-zinc-400' />
                      <a href={`mailto:${msg.email}`} className='hover:underline font-medium'>{msg.email}</a>
                    </div>
                  </div>

                  {/* Operational Datetime Timestamp */}
                  <div className='flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200/30 self-start sm:self-auto'>
                    <CalendarDays size={13} className='text-zinc-400' />
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Conceptualized Subject Information Block */}
                <div className='mb-4'>
                  <span className='text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-1'>
                    Inquiry Subject
                  </span>
                  <h3 className='font-extrabold text-lg text-zinc-900 tracking-tight'>
                    {msg.subject}
                  </h3>
                </div>

                {/* Main Content Node Payload block */}
                <div className='bg-zinc-50/80 border border-zinc-200/40 rounded-2xl p-5 mb-6 backdrop-blur-sm'>
                  <p className='text-zinc-700 text-sm sm:text-base whitespace-pre-wrap leading-relaxed font-normal'>
                    {msg.message}
                  </p>
                </div>

                {/* Destruction Action Button Layer */}
                <div className='flex justify-end pt-2'>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    disabled={deleteLoading === msg._id}
                    className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 border border-zinc-200 hover:border-red-200 text-zinc-700 hover:text-red-600 rounded-xl text-xs font-bold tracking-wide uppercase transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {deleteLoading === msg._id ? (
                      <div className='w-3.5 h-3.5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin' />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    {deleteLoading === msg._id ? 'Deleting' : 'Delete Record'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Page