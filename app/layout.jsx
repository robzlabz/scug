import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion, AnimatePresence } from 'framer-motion'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SCUG - Secangkir Cinta Untuk Guru',
  description: 'Program berbagi keberkahan untuk para guru setiap hari Rabu.',
}

export default function RootLayout({ children }) {
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
  )
}
