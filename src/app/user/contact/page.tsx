'use client'

import React, { useState } from 'react';
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, ShieldCheck } from "lucide-react";
import axios from 'axios';
import toast from 'react-hot-toast';

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const { data } = await axios.post(
        "/api/contact",
        formData
      );

      console.log(data);

      setIsSuccess(true);
      toast.success("Thanks for reaching out! We'll contact you shortly.");
      // clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // hide success after 4 sec
      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 pt-24 text-zinc-900 selection:bg-black selection:text-white">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative overflow-hidden">
          {/* Subtle geometric grid mask for premium texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none -z-10" />

          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/5 text-zinc-800 text-xs font-semibold tracking-wider uppercase border border-zinc-900/10 mb-6 backdrop-blur-sm">
              <MessageSquare size={12} className="text-zinc-700" />
              Support & Communications Hub
            </span>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-600 leading-none mb-6">
              We'd Love to<br />Hear From You
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              Have questions, feedback, or need assistance? Our core operations team is here to support you with everything related to rides, fleet management, or driver partnerships.
            </p>
          </div>
        </section>

        {/* Info Contact Cards */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Mail, title: "Email Us", detail: "support@rydex.com", desc: "Reach our support desk anytime for rapid ticket logging." },
              { icon: Phone, title: "Call Us", detail: "+91 98765 43210", desc: "Direct communications available during system business hours." },
              { icon: MapPin, title: "Visit Us", detail: "Kolkata, West Bengal, India", desc: "Our corporate headquarters and regional operations node." }
            ].map((card, i) => (
              <div key={i} className="group border border-zinc-200 hover:border-zinc-900 bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300 flex items-center justify-center mb-6 text-zinc-700">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xl tracking-tight text-zinc-900">{card.title}</h3>
                  <p className="text-zinc-500 text-sm mt-2">{card.desc}</p>
                </div>
                <p className="font-semibold text-zinc-900 mt-6 tracking-tight group-hover:underline underline-offset-4 cursor-pointer">
                  {card.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Dynamic Form Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-12 gap-16 items-center">

            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
                Let's Start a Conversation
              </h2>

              <p className="text-zinc-500 text-base md:text-lg leading-relaxed">
                Whether you're a rider looking for a premium experience, a driver matching with flexible earnings, or a business manager analyzing fleet metrics, we're built to respond.
              </p>

              <div className="pt-4 space-y-4 border-t border-zinc-100">
                {[
                  { icon: Mail, text: "support@rydex.com" },
                  { icon: Phone, text: "+91 98765 43210" },
                  { icon: MapPin, text: "Kolkata, India" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-zinc-600 font-medium group">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200/50 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-200">
                      <item.icon size={14} />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Form Card Column */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 shadow-xl shadow-zinc-200/40 rounded-[2.5rem] p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all duration-200"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help?"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all duration-200"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Message</label>
                  <textarea
                    rows={5}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write your message..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Success Feedback Alert */}
                {isSuccess && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm animate-fade-in">
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                    <span>Your message has been processed successfully. Our operations unit will contact you back shortly.</span>
                  </div>
                )}

                {/* Submit Action Button */}
                <button

                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-zinc-900/10 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Premium Core Support Callout Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white p-12 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Need Immediate Assistance?
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Riders with active route questions or operators encountering platform access interruptions can access our rapid priority portal directly.
              </p>
              <a
                href="tel:9832243680"
                className="mt-4 bg-white hover:bg-zinc-100 text-zinc-950 px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02]">
                Contact Live Support
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Page;