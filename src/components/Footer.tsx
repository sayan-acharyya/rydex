'use client'

import React from 'react'
import { motion } from "motion/react";
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {

  const LINKS = {
    product: ["Home", "Bookings", "About Us", "Contact"],
    company: ["About", "Careers", "Blog", "Press"],
    support: ["Help Center", "Terms of Service", "Privacy Policy", "Refund Policy"]
  }

  return (
    <div className='w-full bg-black text-white relative overflow-hidden'>

      {/* subtle gradient glow */}
      <div className='absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none' />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className='max-w-7xl mx-auto px-6 py-16 relative z-10'
      >

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>

          {/* Brand */}
          <div>
            <Image
              width={110}
              height={80}
              priority
              src={"/logo.jpeg"}
              alt='logo'
            />

            <p className='mt-4 text-gray-400 text-sm leading-relaxed'>
              Book any vehicle — from bikes to trucks. Trusted owners. Transparent pricing.
            </p>

            {/* Social */}
            <div className='flex gap-4 mt-6'>
              {[FaFacebook, FaInstagram, FaLinkedin, FaTwitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href='#'
                  className='w-10 h-10 flex items-center justify-center rounded-full border 
                  border-white/20 hover:bg-white hover:text-black transition-all duration-300'
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className='text-sm font-semibold mb-4 text-white/90'>Product</h3>
            <ul className='space-y-3'>
              {LINKS.product.map((item, i) => (
                <li key={i}>
                  <a href="#" className='text-sm text-gray-400 hover:text-white transition'>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className='text-sm font-semibold mb-4 text-white/90'>Company</h3>
            <ul className='space-y-3'>
              {LINKS.company.map((item, i) => (
                <li key={i}>
                  <a href="#" className='text-sm text-gray-400 hover:text-white transition'>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className='text-sm font-semibold mb-4 text-white/90'>Support</h3>
            <ul className='space-y-3'>
              {LINKS.support.map((item, i) => (
                <li key={i}>
                  <a href="#" className='text-sm text-gray-400 hover:text-white transition'>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className='border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row 
        justify-between items-center gap-4 text-xs text-gray-500'>

          <p>© {new Date().getFullYear()} RYDEX. All rights reserved.</p>

          <div className='flex gap-6'>
            <a href="#" className='hover:text-white transition'>Terms</a>
            <a href="#" className='hover:text-white transition'>Privacy</a>
            <a href="#" className='hover:text-white transition'>Cookies</a>
          </div>

        </div>

      </motion.div>
    </div>
  )
}

export default Footer