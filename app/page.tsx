'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Project } from '@/lib/types';
import { getProjects } from '@/lib/database';
import identity from '@/lib/identity.json'; 

// Keep above-the-fold imports static
import FloatingAdminButton from '@/components/FloatingAdminButton';
import ThemeToggle from '@/components/ThemeToggle';
import MobileMenu from '@/components/MobileMenu';
import { useAuth } from '@/components/AuthProvider';
import ProfileHeader from '@/components/ProfileAbout';

// Dynamically import heavy, below-the-fold components
const ProjectsCarousel = dynamic(() => import('@/components/ProjectsCarousel'), { 
  ssr: false, 
  loading: () => <div className="animate-pulse h-64 bg-white/5 rounded-2xl"></div> 
});
const ExperienceSection = dynamic(() => import('@/components/ExperienceSection'));
const EducationSection = dynamic(() => import('@/components/EducationSection'));
const CertificationsSection = dynamic(() => import('@/components/CertificationsSection'));
const AchievementsSection = dynamic(() => import('@/components/AchievementsSection'));

function ScrollReveal({ children, id, className = "" }: { children: ReactNode, id?: string, className?: string }) {
  const ref = useRef(null);
  const controls = useAnimation();
  const isVisible = useInView(ref, { amount: 0.4, once: false });
  const isStillInZone = useInView(ref, { amount: 0.05, once: false });

  useEffect(() => {
    if (isVisible) {
      controls.start({ opacity: 1, y: 0, scale: 1 });
    } else if (!isStillInZone) {
      controls.start({ opacity: 0, y: 50, scale: 0.95 });
    }
  }, [isVisible, isStillInZone, controls]);

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={controls}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const isMountedRef = useRef(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true; // Fix for "Can't perform state update"

    const unsubscribe = getProjects((projectsData) => {
      if (isMounted) {
        setProjects(projectsData);
        setProjectsLoading(false);
        setRefreshing(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleRefreshProjects = () => {
    setRefreshing(true);
    const unsubscribe = getProjects((projectsData) => {
      if (isMountedRef.current) {
        setProjects(projectsData);
        setRefreshing(false);
      }
    }, true);
    setTimeout(() => unsubscribe(), 1000);
  };

  const sectionClass = "snap-start snap-always min-h-screen flex items-center py-16 px-6 lg:px-8";

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-gradient-to-br from-bg-primary via-bg-secondary/50 to-bg-primary scroll-smooth">
      
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="fixed top-0 w-full z-50 nav-blur border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gradient">{identity.name}</div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="nav-link">About</a>
              <a href="#projects" className="nav-link">Projects</a>
              <a href="#contact" className="nav-link">Contact</a>
              <ThemeToggle />
            </div>
            <button 
              aria-label="Open mobile menu" 
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)} 
              className="md:hidden p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu identity={identity} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="relative z-10">
        
        {/* About */}
        <section className={`${sectionClass} pt-24`}> 
          <div className="w-full max-w-6xl mx-auto" id="about">
            <ProfileHeader identity={identity} />
          </div>
        </section>

        {/* Projects */}
        <section className={sectionClass}>
          <ScrollReveal id="projects">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-text-primary">Projects</h2>
                  <div className="w-12 h-1 bg-accent-primary mt-2 rounded-full"></div>
                </div>
                <button onClick={handleRefreshProjects} disabled={refreshing} className="text-sm text-text-muted hover:text-accent-primary">
                  {refreshing ? 'Refreshing…' : '↻ Refresh'}
                </button>
              </div>
              {projectsLoading ? (
                 <div className="text-center p-12 text-text-muted">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="card-glass p-12 text-center">
                  <h3 className="text-lg font-semibold">Coming Soon</h3>
                </div>
              ) : (
                <ProjectsCarousel projects={projects} isAdmin={!!user} />
              )}
            </div>
          </ScrollReveal>
        </section>

        {/* Dynamic Sections */}
        {identity.education && (
          <section className={sectionClass}>
            <ScrollReveal id="education">
              <EducationSection education={identity.education} />
            </ScrollReveal>
          </section>
        )}

        {identity.experience && (
          <section className={sectionClass}>
            <ScrollReveal id="experience">
              <ExperienceSection experiences={identity.experience} />
            </ScrollReveal>
          </section>
        )}

        {identity.certifications && (
          <section className={sectionClass}>
            <ScrollReveal id="certifications">
              <CertificationsSection certifications={identity.certifications} />
            </ScrollReveal>
          </section>
        )}

        {identity.achievements && (
          <section className={sectionClass}>
            <ScrollReveal id="achievements">
              <AchievementsSection achievements={identity.achievements} />
            </ScrollReveal>
          </section>
        )}

        {/* Contact */}
        <section className={`${sectionClass} pb-24`} id="contact">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="card-glass relative overflow-hidden p-8 md:p-16 border border-white/10 rounded-3xl backdrop-blur-md">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 tracking-tight">
                  Start a <span className="text-gradient">conversation?</span>
                </h2>
                <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                  Whether you have a specific project in mind or just want to say hi, my inbox is always open.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <motion.a 
                    href={`mailto:${identity.social.email}`} 
                    className="btn-primary w-full sm:w-auto px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Get In Touch</span>
                  </motion.a>
                  <motion.a 
                    href={identity.resume} 
                    className="btn-ghost w-full sm:w-auto px-8 py-4 rounded-full font-semibold border border-border-light hover:bg-white/5"
                    target="_blank" 
                    rel="noreferrer"
                    whileHover={{ y: -2 }}
                  >
                    View Resume
                  </motion.a>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-white/5">
                  {Object.entries(identity.social).map(([platform, url]) => (
                    url && platform !== 'email' && (
                      <a 
                        key={platform} 
                        href={url as string} 
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
                      >
                        <span className="text-sm font-medium capitalize">{platform}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Footer */}
        <section className="snap-start snap-always py-10 px-6 border-t border-border-light/30 bg-bg-primary">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-text-muted text-sm">
              <span className="font-semibold text-text-secondary">{identity.name}</span>.
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted/60">
              <a href="https://github.com/antonioroger2/cv" target="_blank" className="underline hover:opacity-80 transition">
                Built with
              </a>
              <span className="px-2 py-1 bg-white/5 rounded text-text-secondary">Next.js</span>
            </div>
          </div>
        </section>

      </main>
      {user && <FloatingAdminButton />}
    </div>
  );
}