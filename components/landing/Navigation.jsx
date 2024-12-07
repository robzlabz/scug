'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { id: 'hero', label: 'Beranda' },
  { id: 'mission', label: 'Misi' },
  { id: 'how-it-works', label: 'Cara Kerja' },
  { id: 'projects', label: 'Proyek' },
  { id: 'join', label: 'Bergabung' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => ({
        id: item.id,
        offset: document.getElementById(item.id)?.offsetTop || 0
      }));

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offset) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden bg-white/80 backdrop-blur-sm border-gold-200/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Desktop Menu */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-sm rounded-lg border border-gold-200/50 shadow-lg">
        <ul className="flex items-center p-2 gap-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                variant="ghost"
                className={`text-sm ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-primary-100 to-gold-100 text-primary-700'
                    : 'text-primary-600 hover:bg-primary-50'
                }`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 md:hidden bg-white/90 backdrop-blur-sm rounded-lg border border-gold-200/50 shadow-lg"
          >
            <ul className="p-2 w-40">
              {menuItems.map((item) => (
                <li key={item.id} className="mb-1 last:mb-0">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-sm ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-primary-100 to-gold-100 text-primary-700'
                        : 'text-primary-600 hover:bg-primary-50'
                    }`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
