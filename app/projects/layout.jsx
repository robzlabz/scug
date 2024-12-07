'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50/50 via-background to-gold-50/30">
      <Header />
      
      {/* Decorative SVG Top */}
      <div className="absolute top-16 left-0 w-full overflow-hidden z-0">
        <svg className="w-full h-24 text-primary-100/50" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,160L40,165.3C80,171,160,181,240,181.3C320,181,400,171,480,181.3C560,192,640,224,720,213.3C800,203,880,149,960,144C1040,139,1120,181,1200,197.3C1280,213,1360,203,1400,197.3L1440,192L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex-grow relative z-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top right decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/10 rounded-full filter blur-3xl" />
        
        {/* Bottom left decoration */}
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-gold-200/10 rounded-full filter blur-3xl" />
      </div>

      <Footer />
    </div>
  );
}
