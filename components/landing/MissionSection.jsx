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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Misi Kami</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
              className="p-6 rounded-lg bg-card"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
