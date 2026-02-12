"use client";
import { IdentityData } from "@/lib/types";
import { motion } from "framer-motion";
import SkillsCarousel from "./SkillsCarousel";
interface Props {
identity: IdentityData;
}
export default function ProfileHeader({ identity }: Props) {
return (
<div className="max-w-4xl mx-auto w-full px-">
<div className="text-center text-text-primary transition-colors duration-300">
{/* Avatar Section */}
<motion.div
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.6 }}
className="mb-6"
>
<div className="w-[clamp(8rem,13vh,12rem)] h-[clamp(8rem,13vh,12rem)] mx-auto rounded-full overflow-hidden ring-4 ring-cyan-500/30 shadow-2xl">
<img
src={identity.avatar || "public/data/avatar.jpg"}
alt={identity.name}
className="w-full h-full object-cover"
loading="eager"
/>
</div>
</motion.div>
{/* Name and Title */}
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.3, duration: 0.6 }}
className="mb-4"
>
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
</motion.div>
{/* Bio */}
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.4, duration: 0.6 }}
className="mb-8"
>
<p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
{identity.bio}
</p>
<SkillsCarousel />
</motion.div>
</div>
</div>
  );
}