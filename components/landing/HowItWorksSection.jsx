'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Gift, Heart } from 'lucide-react';

const steps = [
  {
    icon: CalendarDays,
    title: "Pilih Hari Rabu",
    description: "Daftar untuk berpartisipasi di hari Rabu yang tersedia"
  },
  {
    icon: Gift,
    title: "Siapkan Sedekah",
    description: "Siapkan makanan atau minuman untuk dibagikan kepada guru"
  },
  {
    icon: Heart,
    title: "Bagikan Kebaikan",
    description: "Berikan sedekah Anda dan raih keberkahan bersama"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Berpartisipasi</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bergabunglah dalam program Secangkir Cinta Untuk Guru dengan tiga langkah mudah
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-border"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
