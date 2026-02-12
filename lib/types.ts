export interface Role {
  id: string;
  title: string;
  startDate: string;
  current: boolean;
  description: string;
  skills: string[];
  endDate?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  startDate: string;
  current?: boolean;
  endDate?: string;
  description: string;
  skills: string[];
  roles?: Role[];
}

export interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  year?: string;
  cgpa?: string;
  grade?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  skills: string[];
  logo: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  certificateUrl?: string;
  logo?: string;
}

export interface SocialLinks {
  email: string;
  github: string;
  linkedin: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
}

export interface IdentityData {
  name: string;
  username: string;
  role: string;
  bio: string;
  avatar: string;
  location: string;
  status: string;
  statusColor: string;
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  achievements: Achievement[];
  careerObjective: string;
  social: SocialLinks;
  resume: string;
  skills: string[];
  metadata: {
    theme: string;
    accentColor: string;
    lastUpdated: string;
  };
}

// lib/types.ts

export interface Project {
  id: string;
  title: string;
  description?: string;
  techStack?: string[];
  gitLink?: string;
  pdfReportLink?: string;
  imageUrl?: string;
  featured?: boolean;
  order?: number;
  tagline?: string;
  topic?: string;
  markdownDescription?: string;
  lastUpdated?: number | Date | string;
  link?: string;
  github?: string;
  tags?: string[];
  image?: string;
}

export interface ContactFormData {
  id?: string;
  timestamp?: Date | string;
  name: string;
  email: string;
  message: string;
  [key: string]: unknown;
}