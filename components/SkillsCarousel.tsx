'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import skillsData from '../public/data/skills.json'; 
import { getSkillIcon } from './SkillIconMap';

interface SkillCategory {
  id: string;
  title: string;
  items: string[];
}

export default function SkillsCarousel() {
  const [index, setIndex] = useState(0);
  const categories = (skillsData as { categories: SkillCategory[] }).categories;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [categories.length]);

  const currentCategory = categories[index];

  return (
    <div className="w-full max-w-2xl mx-auto py-4 flex flex-col items-center">
      <div className="relative w-full min-h-[180px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            // Removed: bg-white/5, backdrop-blur, border, and shadow-lg
            className="w-full p-5 flex flex-col items-center"
          >
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center justify-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
              {currentCategory.title}
            </h3>
            
            <div className="flex flex-wrap justify-center gap-3">
              {currentCategory.items.map((skill, i) => {
                const { icon, color } = getSkillIcon(skill);
                return (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary/60 border border-border-light text-sm text-text-secondary font-medium hover:bg-bg-secondary/80 transition-colors"
                  >
                    <span className={`${color} text-lg`}>{icon}</span>
                    {skill}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      </div>
  );
}