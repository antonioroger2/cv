'use client';

import React from 'react';
import { Code } from 'lucide-react';
import {
  SiPython, SiReact, SiNextdotjs, SiDocker,
  SiTensorflow, SiPytorch, SiJavascript,
  SiTypescript, SiFlutter,
  SiGit, SiGithub, SiFirebase, SiAmazon,
  SiC, SiMongodb, SiMysql, SiArduino,
  SiRaspberrypi, SiScikitlearn, SiOpencv, SiNodedotjs,
  SiPostgresql, SiRedis, SiVercel, SiExpress, SiFlask,
  SiEsphome, SiEspressif, SiGo, SiKeras, SiNumpy, 
  SiPandas, SiHuggingface
} from 'react-icons/si';
import { IoLogoMicrosoft } from 'react-icons/io5';
import { TbBrandCpp, TbBrandOpenai } from 'react-icons/tb';
import { GiProcessor } from 'react-icons/gi'; // Good for hardware/CUDA

export interface SkillIcon {
  icon: React.ReactNode;
  color: string; // light mode color
  darkColor?: string; // dark mode color (optional)
}

export const iconMap: Record<string, SkillIcon> = {
  // Languages
  'Python': { icon: <SiPython size={20} />, color: 'text-yellow-400', darkColor: 'dark:text-yellow-300' },
  'JavaScript': { icon: <SiJavascript size={20} />, color: 'text-yellow-300', darkColor: 'dark:text-yellow-200' },
  'TypeScript': { icon: <SiTypescript size={20} />, color: 'text-blue-400', darkColor: 'dark:text-blue-300' },
  'C': { icon: <SiC size={20} />, color: 'text-blue-500', darkColor: 'dark:text-blue-400' },
  'C++': { icon: <TbBrandCpp size={22} />, color: 'text-blue-600', darkColor: 'dark:text-blue-400' },
  'Java': { icon: <Code size={20} />, color: 'text-red-500', darkColor: 'dark:text-red-400' },
  'Go': { icon: <SiGo size={20} />, color: 'text-cyan-400', darkColor: 'dark:text-cyan-300' },

  // ML/DL Frameworks & Data Science
  'TensorFlow': { icon: <SiTensorflow size={20} />, color: 'text-orange-500', darkColor: 'dark:text-orange-400' },
  'PyTorch': { icon: <SiPytorch size={20} />, color: 'text-orange-600', darkColor: 'dark:text-orange-400' },
  'Keras': { icon: <SiKeras size={20} />, color: 'text-red-500', darkColor: 'dark:text-red-400' },
  'Scikit-learn': { icon: <SiScikitlearn size={20} />, color: 'text-orange-400', darkColor: 'dark:text-orange-300' },
  'OpenCV': { icon: <SiOpencv size={20} />, color: 'text-green-400', darkColor: 'dark:text-green-300' },
  'Hugging Face': { icon: <SiHuggingface size={20} />, color: 'text-yellow-400', darkColor: 'dark:text-yellow-300' },
  'Numpy': { icon: <SiNumpy size={20} />, color: 'text-blue-300', darkColor: 'dark:text-blue-200' },
  'Pandas': { icon: <SiPandas size={20} />, color: 'text-indigo-300', darkColor: 'dark:text-indigo-200' },
  'DGL': { icon: <Code size={20} />, color: 'text-green-500', darkColor: 'dark:text-green-400' },
  'Transformers': { icon: <TbBrandOpenai size={20} />, color: 'text-teal-400', darkColor: 'dark:text-teal-300' },
  'CNN': { icon: <GiProcessor size={20} />, color: 'text-indigo-400', darkColor: 'dark:text-indigo-300' },
  'RNN': { icon: <Code size={20} />, color: 'text-purple-400', darkColor: 'dark:text-purple-300' },
  'LSTM': { icon: <Code size={20} />, color: 'text-pink-400', darkColor: 'dark:text-pink-300' },
  'CUDA': { icon: <SiEspressif size={20} />, color: 'text-green-500', darkColor: 'dark:text-green-400' },

  // Web Frameworks
  'React': { icon: <SiReact size={20} />, color: 'text-cyan-400', darkColor: 'dark:text-cyan-300' },
  'Next.js': { icon: <SiNextdotjs size={20} />, color: 'text-black', darkColor: 'dark:text-white' },
  'Node.js': { icon: <SiNodedotjs size={20} />, color: 'text-green-500', darkColor: 'dark:text-green-400' },
  'Express': { icon: <SiExpress size={20} />, color: 'text-gray-400', darkColor: 'dark:text-gray-200' },
  'Flask': { icon: <SiFlask size={20} />, color: 'text-black', darkColor: 'dark:text-white' },
  'Flutter': { icon: <SiFlutter size={20} />, color: 'text-cyan-400', darkColor: 'dark:text-cyan-300' },
  'MERN Stack (MongoDB, Express, React, Node.js)': { icon: <SiMongodb size={20} />, color: 'text-green-500', darkColor: 'dark:text-green-400' },

  // Databases
  'MongoDB': { icon: <SiMongodb size={20} />, color: 'text-green-500', darkColor: 'dark:text-green-400' },
  'MySQL': { icon: <SiMysql size={20} />, color: 'text-blue-500', darkColor: 'dark:text-blue-400' },
  'Postgres': { icon: <SiPostgresql size={20} />, color: 'text-sky-400', darkColor: 'dark:text-sky-300' },
  'Redis': { icon: <SiRedis size={20} />, color: 'text-red-500', darkColor: 'dark:text-red-400' },
  'Firebase': { icon: <SiFirebase size={20} />, color: 'text-yellow-500', darkColor: 'dark:text-yellow-400' },

  // Cloud & DevOps
  'AWS': { icon: <SiAmazon size={20} />, color: 'text-orange-500', darkColor: 'dark:text-orange-400' },
  'S3': { icon: <SiAmazon size={20} />, color: 'text-orange-500', darkColor: 'dark:text-orange-400' },
  'Azure': { icon: <IoLogoMicrosoft size={20} />, color: 'text-sky-500', darkColor: 'dark:text-sky-400' },
  'Docker': { icon: <SiDocker size={20} />, color: 'text-blue-500', darkColor: 'dark:text-blue-400' },
  'Git': { icon: <SiGit size={20} />, color: 'text-orange-600', darkColor: 'dark:text-orange-400' },
  'GitHub': { icon: <SiGithub size={20} />, color: 'text-black', darkColor: 'dark:text-white' },
  'Vercel deployment': { icon: <SiVercel size={20} />, color: 'text-black', darkColor: 'dark:text-white' },

  // IoT & Embedded
  'Arduino': { icon: <SiArduino size={20} />, color: 'text-teal-400', darkColor: 'dark:text-teal-300' },
  'Raspberry Pi': { icon: <SiRaspberrypi size={20} />, color: 'text-red-500', darkColor: 'dark:text-red-400' },
  'NodeMCU': { icon: <SiEspressif size={20} />, color: 'text-blue-400', darkColor: 'dark:text-blue-300' },
  'ESP32': { icon: <SiEspressif size={20} />, color: 'text-red-400', darkColor: 'dark:text-red-300' },
  'ESPHome': { icon: <SiEsphome size={20} />, color: 'text-blue-300', darkColor: 'dark:text-blue-200' },
};

export const getSkillIcon = (skillName: string): SkillIcon => {
  return iconMap[skillName] || { 
    icon: <Code size={20} />, 
    color: 'text-gray-400',
    darkColor: 'dark:text-gray-300'
  };
};