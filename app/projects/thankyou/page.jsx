'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ThankYou() {
  const router = useRouter()

  useEffect(() => {
    // Trigger confetti animation
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-primary" />
            </motion.div>
          </div>

          <h1 className="text-2xl font-bold mb-4">Terima Kasih!</h1>
          
          <p className="text-muted-foreground mb-6">
            Data Anda telah kami terima. Admin kami akan segera menghubungi Anda
            untuk konfirmasi lebih lanjut.
          </p>

          <Button
            onClick={() => router.push('/projects')}
            className="w-full"
          >
            Kembali ke Halaman Projects
          </Button>
        </Card>
      </motion.div>
    </div>
  )
}
