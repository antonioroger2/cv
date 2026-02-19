"use client";
import { IdentityData } from "@/lib/types";
import Image from 'next/image';
import SkillsCarousel from "./SkillsCarousel";

interface Props {
  identity: IdentityData;
}

export default function ProfileHeader({ identity }: Props) {
  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      <div className="text-center text-text-primary transition-colors duration-300">
        
        {/* Avatar Section - Removed motion.div */}
        <div className="mb-6 animate-fade-in">
          <div className="w-[clamp(8rem,13vh,12rem)] h-[clamp(8rem,13vh,12rem)] mx-auto rounded-full overflow-hidden ring-4 ring-cyan-500/30 shadow-2xl relative">
            <Image
              src={identity.avatar || "/data/avatar.jpg"}
              alt={identity.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 8rem, 12rem"
            />
          </div>
        </div>

        {/* Name and Title - Removed motion.div so it paints instantly */}
        <div className="mb-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Hi, I&apos;m
            </span>
            <br />
            <span className="text-text-primary">{identity.name}</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-light">
            {identity.role}
          </p>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            {identity.bio}
          </p>
          <SkillsCarousel />
        </div>
      </div>
    </div>
  );
}