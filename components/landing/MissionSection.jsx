'use client';

import { motion } from 'framer-motion';
import { Coffee, Heart, Users } from 'lucide-react';

const features = [
  {
    icon: Coffee,
    title: "Secangkir Kebaikan",
    description: "Melalui sedekah makanan dan minuman, kita dapat memberikan apresiasi kepada para guru."
  },
  {
    icon: Users,
    title: "Komunitas Peduli",
    description: "Bergabung bersama para orang tua siswa dalam misi mulia berbagi kepada guru."
  },
  {
    icon: Heart,
    title: "Keberkahan Bersama",
    description: "Meraih keberkahan dengan berbagi setiap hari Rabu kepada para guru."
  }
];

export default function MissionSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-gold-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-700 to-gold-600 bg-clip-text text-transparent">
            Misi Kami
          </h2>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto">
            Membangun tradisi berbagi dan menghargai jasa para guru melalui 
            program sedekah makanan mingguan.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gold-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-primary-100 to-gold-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary-800">{feature.title}</h3>
                <p className="text-primary-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Morphism background effects */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-bl from-primary-200/30 to-gold-200/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-tr from-gold-200/30 to-primary-200/30 rounded-full filter blur-3xl" />
      </div>
    </section>
  );
}
