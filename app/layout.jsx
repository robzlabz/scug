'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <html lang='id'>
      <body className={inter.className}>
        {children}
      </body>
      </html>;
  }

  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow relative">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
