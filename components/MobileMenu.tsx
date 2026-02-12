'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

import { IdentityData } from '@/lib/types';

interface MobileMenuProps {
  identity: IdentityData;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ identity, isOpen, onClose }: MobileMenuProps) {
  const menuItems = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    ...(identity.education && identity.education.length > 0 ? [{ href: '#education', label: 'Education' }] : []),
    ...(identity.experience && identity.experience.length > 0 ? [{ href: '#experience', label: 'Experience' }] : []),
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 bg-bg-primary border-l border-border-light z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <div className="text-xl font-bold text-gradient">
                {identity.name}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <nav className="space-y-4">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={onClose}
                    className="block py-3 px-4 text-lg font-medium text-text-primary hover:text-accent-primary hover:bg-accent-primary/5 rounded-lg transition-all"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-border-light">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <a href={identity.resume} className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-colors text-[clamp(0.875rem,2vw,1rem)]">
            Download Resume
          </a>
          <a href="#projects" className="px-6 py-3 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all text-[clamp(0.875rem,2vw,1rem)]">
            View My Work
          </a>
        </motion.div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}