import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Top Navy Bar with Orange Accent */}
      <div className="bg-[#2c3e5f] relative">
        <div className="flex items-center justify-between">
          <div className="px-8 md:px-12 py-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">
              VIP Scale Monitor
            </h1>
          </div>
          
          {/* Right Side Decorative Elements from Image 2 */}
          <div className="hidden lg:block">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/78657e456_VIPScaleMonitor_JERYAFRANDI7.png"
              alt="Decorative Elements"
              className="h-32 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Decorative Elements from Image 4 */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:flex items-center justify-start"
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/523d03530_VIPScaleMonitor_JERYAFRANDI2.png"
              alt="Decorative Elements"
              className="w-full max-w-xs h-auto object-contain"
            />
          </motion.div>

          {/* Right Side - Main Content */}
          <div className="text-center lg:text-left space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold text-[#2c3e5f] leading-tight"
            >
              Apakah hari ini sudah<br />monitor infus?
            </motion.h2>

            {/* Buttons Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <Link to={createPageUrl('Monitor')} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#ff9b6a] hover:bg-[#ff8c57] text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg">
                  Monitor
                </button>
              </Link>
              <Link to={createPageUrl('RiwayatLog')} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#fbbf24] hover:bg-[#f59e0b] text-[#2c3e5f] px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg">
                  Riwayat Log
                </button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center lg:justify-start"
            >
              <Link to={createPageUrl('DemoAplikasi')}>
                <button className="bg-[#2d9b87] hover:bg-[#248a77] text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg">
                  Demo Aplikasi
                </button>
              </Link>
            </motion.div>

            {/* IV Illustration from Image 3 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex justify-center lg:justify-end"
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/efc874c92_VIPScaleMonitor_JERYAFRANDI45.png"
                alt="Ilustrasi Infus"
                className="w-full max-w-lg h-auto object-contain"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
