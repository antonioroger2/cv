'use client';

import { motion } from 'framer-motion';
import { Plus, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function FloatingAdminButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2"
        >
          <Link
            href="/editor"
            onClick={() => setIsOpen(false)}
            className="neu-btn flex items-center gap-3 px-4 py-3 whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="font-medium">New Project</span>
          </Link>

          <Link
            href="/admin-access-8842/dashboard"
            onClick={() => setIsOpen(false)}
            className="neu-btn flex items-center gap-3 px-4 py-3 whitespace-nowrap"
          >
            <Settings size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg transition-all whitespace-nowrap"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </motion.div>
      )}

      {/* Main FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 flex items-center justify-center transition-all ${
          isOpen ? 'rotate-45' : ''
        }`}
        style={{ boxShadow: 'var(--neu-shadow)' }}
      >
        <Plus size={28} className="text-white" />
      </motion.button>
    </div>
  );
}
