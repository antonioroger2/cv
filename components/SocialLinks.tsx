'use client';

import { SocialLinks as SocialLinksType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, MessageCircle, Instagram, FileText } from 'lucide-react';

interface Props {
  social: SocialLinksType;
  resume: string;
}

export default function SocialLinks({ social, resume }: Props) {
  const links = [
    { href: `mailto:${social.email}`, icon: Mail, label: 'Email', hoverColor: 'hover:text-red-500' },
    { href: social.github, icon: Github, label: 'GitHub', hoverColor: 'hover:text-gray-600 dark:hover:text-gray-300' },
    { href: social.linkedin, icon: Linkedin, label: 'LinkedIn', hoverColor: 'hover:text-blue-600' },
    ...(social.telegram ? [{ href: social.telegram, icon: Send, label: 'Telegram', hoverColor: 'hover:text-sky-500' }] : []),
    ...(social.whatsapp ? [{ href: social.whatsapp, icon: MessageCircle, label: 'WhatsApp', hoverColor: 'hover:text-green-500' }] : []),
    ...(social.instagram ? [{ href: social.instagram, icon: Instagram, label: 'Instagram', hoverColor: 'hover:text-pink-500' }] : []),
  ];

  return (
    <div>
      <h3 className="text-primary-500 font-semibold mb-4 text-sm uppercase tracking-wider">
        Connect With Me
      </h3>
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        {links.map((link, index) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`neu-icon-btn ${link.hoverColor}`}
            title={link.label}
          >
            <link.icon size={22} />
          </motion.a>
        ))}

        {/* Resume Button */}
        <motion.a
          href={resume}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: links.length * 0.05, duration: 0.3 }}
          className="neu-btn-primary flex items-center gap-2 py-2 px-4"
          title="Download Resume"
        >
          <FileText size={18} />
          <span className="text-sm font-semibold">Resume</span>
        </motion.a>
      </div>
    </div>
  );
}
