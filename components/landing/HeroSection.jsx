'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-gold-50 to-primary-100">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl mb-4 text-primary-800 font-arabic"
        >
          السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
        </motion.h2>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-700 via-gold-600 to-primary-800 bg-clip-text text-transparent"
        >
          Secangkir Cinta Untuk Guru
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-primary-700"
        >
          Berbagi keberkahan setiap hari Rabu, memberikan apresiasi kepada para guru 
          melalui hadiah berupa makanan dan minuman.
        </motion.p>
      </div>
      
      {/* Morphism effects */}
      <div className="absolute inset-0 -z-10">
        {/* Top left blob */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-200/40 to-gold-200/40 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Bottom right blob */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-gold-200/40 to-primary-200/40 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
        
        {/* Center decoration */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-100/30 via-gold-100/30 to-primary-100/30 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </section>
  );
}
