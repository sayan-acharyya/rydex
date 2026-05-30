'use client'

import Image from 'next/image';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import {
  Car,
  ShieldCheck,
  Clock3,
  MapPin,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import VehicleSlider from '@/components/VehicleSlider';

const Page = () => {
  const router = useRouter();

  return (
    <>
      <Nav />

      <main className="bg-gradient-to-b from-zinc-50 via-white to-zinc-50 min-h-screen pt-16 text-zinc-900 selection:bg-black selection:text-white">

        {/* Hero Section with Corporate Background Image */}
        <section className="relative h-[65vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-zinc-950">
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full z-0 opacity-40 mix-blend-luminosity">
            <Image
              src="/aboutus.png" // Replace this with your actual image path or asset name
              alt="Rydex Corporate Office Background"
              fill
              priority
              className="object-cover object-center scale-105 animate-fade-in duration-1000"
            />
          </div>

          {/* Premium Gradient Overlays for maximum text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/30 z-10" />

          {/* Hero Content */}
          <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wider uppercase border border-white/20 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              About Rydex
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
              Smarter Rides.<br />Better Journeys.
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
              Rydex is an advanced ecosystem connecting people seamlessly. We merge cutting-edge real-time dispatch logic with a deep commitment to commuter safety, pricing parity, and driver empowerment.
            </p>
          </div>
        </section>

        {/* Mission & Real-time Stats */}
        <section className="bg-zinc-900 text-zinc-100 py-24 rounded-[3rem] mx-4 md:mx-8 mt-12 relative overflow-hidden shadow-2xl z-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex p-2 bg-zinc-800 rounded-2xl text-zinc-400">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Our Mission & Impact
              </h2>

              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                We believe urban and regional mobility must be accessible, decentralized, and fundamentally reliable. Our technical focus is engineered toward providing optimal routing and lowering driver commissions.
              </p>

              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                By stripping away operational redundancies, every single booking builds a sustainable dynamic between community demands and local driver livelihoods.
              </p>
            </div>

            {/* Stats Grid Card */}
            <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-inner">
              <div className="grid grid-cols-2 gap-8">
                <div className="group transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white">24/7</h3>
                  <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mt-2">Active Support</p>
                </div>

                <div className="group transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white">100%</h3>
                  <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mt-2">No Hidden Fees</p>
                </div>

                <div className="group transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white">&lt; 3m</h3>
                  <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mt-2">Avg. Dispatch</p>
                </div>

                <div className="group transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white">Top</h3>
                  <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mt-2">Safety Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Rydex Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Rethinking Ride-Hailing
            </h2>
            <p className="mt-4 text-zinc-500 text-md sm:text-lg">
              Engineered systematically for both riders and drivers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock3, title: "Instant Dispatch", desc: "No artificial wait queues. Our algorithm matches you to the closest localized vector in under 3 seconds." },
              { icon: ShieldCheck, title: "Biometric Verification", desc: "Strict continuous authentication protocols for drivers ensures security boundaries are met." },
              { icon: MapPin, title: "Smart Mesh Routing", desc: "Predictive traffic tracking algorithms bypass city gridlocks cleanly to minimize trip friction." },
              { icon: Car, title: "Dynamic Fleet Options", desc: "Instantly cycle through high-efficiency internal combustion engines, EVs, micromobility, or regional shuttles." }
            ].map((feature, i) => (
              <div key={i} className="group border border-zinc-200 hover:border-zinc-900 bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300 flex items-center justify-center mb-6 text-zinc-700">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xl tracking-tight text-zinc-900">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mt-3">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <VehicleSlider />

        {/* Audience Split Cards */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Riders Card */}
            <div className="group relative bg-zinc-50 hover:bg-zinc-900 border border-zinc-200 hover:border-zinc-900 rounded-[2.5rem] p-10 md:p-12 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[340px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-200/50 group-hover:bg-zinc-800/20 rounded-full blur-3xl pointer-events-none -z-10" />
              <div>
                <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100">
                  <Users size={26} />
                </div>
                <h3 className="text-3xl font-black tracking-tight mt-8 text-zinc-900 group-hover:text-white transition-colors duration-300">
                  For Riders
                </h3>
                <p className="mt-4 text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300 leading-relaxed max-w-md text-sm md:text-base">
                  Get high-reliability dispatch with transparent flat pricing structures, zero surge-multipliers, and highly vetted operations teams.
                </p>
              </div>
            </div>

            {/* Drivers Card */}
            <div className="group relative bg-zinc-50 hover:bg-zinc-900 border border-zinc-200 hover:border-zinc-900 rounded-[2.5rem] p-10 md:p-12 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[340px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-200/50 group-hover:bg-zinc-800/20 rounded-full blur-3xl pointer-events-none -z-10" />
              <div>
                <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100">
                  <Car size={26} />
                </div>
                <h3 className="text-3xl font-black tracking-tight mt-8 text-zinc-900 group-hover:text-white transition-colors duration-300">
                  For Drivers
                </h3>
                <p className="mt-4 text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300 leading-relaxed max-w-md text-sm md:text-base">
                  Retain up to 92% of localized trip revenue. Work inside flexible schedules while utilizing premium enterprise dashboards built to track margins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Call To Action */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="relative rounded-[3rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white p-12 md:p-20 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-700/20 rounded-full blur-3xl pointer-events-none -z-10" />

            <h2 className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-none">
              Ready to experience modern transportation?
            </h2>

            <p className="mt-6 text-zinc-400 max-w-xl mx-auto text-base sm:text-lg">
              Create your profile under 2 minutes to book instant rides or join our trusted logistics operator fleet.
            </p>

            <button
              onClick={() => router.push('/user/book')}
              className="mt-10 inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-950 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] shadow-xl text-md"
            >
              Get Started Now
              <ArrowRight size={20} className="text-zinc-950" />
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Page;