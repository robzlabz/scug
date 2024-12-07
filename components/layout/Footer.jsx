'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white/90">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-white/20 rounded-lg transform rotate-6"></div>
                <div className="absolute inset-0 bg-white/30 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold">SCUG</h3>
            </div>
            <p className="text-white/70">
              Secangkir Cinta Untuk Guru - Program berbagi keberkahan untuk para guru setiap hari Rabu.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Tautan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-white/70 hover:text-white transition-colors">
                  Proyek
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-white/70" />
                <span className="text-white/70">+62 123 4567 8900</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-white/70" />
                <span className="text-white/70">info@scug.org</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-white/70 mt-1" />
                <span className="text-white/70">Jl. Contoh No. 123, Kota, Indonesia</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Sosial Media</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
          <p>© {new Date().getFullYear()} SCUG. All rights reserved.</p>
        </div>
      </div>

      {/* Decorative SVG */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative w-full h-24 text-primary-800"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div> */}
    </footer>
  );
}
