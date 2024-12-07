'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function JoinSection() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mari Bergabung dalam Kebaikan
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain"
            <br />
            <span className="text-sm italic">- HR. Ahmad, ath-Thabrani, ad-Daruqutni</span>
          </p>
          <Link href="/projects">
            <Button size="lg" className="font-semibold">
              Mulai Berbagi Sekarang
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
