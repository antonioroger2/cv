'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Github, 
  Star, 
  FolderGit2, 
  Eye, 
  Edit3, 
  Trash2,
  X // Added X for a consistent modal close button
} from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import ProjectDetailModal from './ProjectDetailModal';
import { deleteProject } from '@/lib/database';

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                      */
/* -------------------------------------------------------------------------- */

const AUTO_SCROLL_INTERVAL = 5000;
const CARDS_PER_VIEW = {
  mobile: 1,
  tablet: 2,
  desktop: 3
};

/* -------------------------------------------------------------------------- */
/* MEDIA QUERY HOOK                                                            */
/* -------------------------------------------------------------------------- */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/* -------------------------------------------------------------------------- */
/* PROJECT CARD                                                                */
/* -------------------------------------------------------------------------- */

interface ProjectCardProps {
  project: Project;
  onExpand: () => void;
  isAdmin?: boolean;
}

function ProjectCard({ project, onExpand, isAdmin = false }: ProjectCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    if (project.image) {
      const img = new window.Image();
      img.src = project.image;
      img.onload = () => setImgLoaded(true);
      img.onerror = () => setImgError(true);
    }
  }, [project.image]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      className="group relative flex flex-col h-full bg-bg-secondary/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-lg overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-accent-primary/30 hover:shadow-2xl hover:shadow-accent-primary/10 cursor-pointer"
      style={{ willChange: 'transform' }}
      onClick={onExpand}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onExpand();
        }
      }}
    >
      {/* IMAGE HEADER */}
      <div className="relative aspect-video overflow-hidden flex items-center justify-center bg-bg-tertiary/50 shrink-0">
        {project.image && !imgError && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              opacity: imgLoaded ? 0.4 : 0,
              filter: 'grayscale(80%) contrast(1.1)',
              transition: 'opacity 0.6s ease-out, transform 0.7s ease-out, filter 0.7s ease-out',
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {/* Improved Image Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/20 to-transparent z-10 pointer-events-none mix-blend-multiply" />
        
        <div className="relative z-20 flex flex-col items-center justify-center group-hover:opacity-0 transition-opacity duration-500">
          <div className="absolute inset-0 bg-accent-primary/10 blur-3xl rounded-full transform scale-150 transition-all duration-500 group-hover:bg-accent-primary/30" />
          <FolderGit2
            className="relative w-12 h-12 text-text-muted/70 transition-colors duration-500 drop-shadow-lg"
            strokeWidth={1.5}
          />
        </div>

        {project.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-accent-primary/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(var(--accent-primary),0.5)] z-30">
            <Star size={10} fill="currentColor" />
            Featured
          </div>
        )}

        {/* Refined Hover Reveal */}
        <div className="absolute inset-0 bg-bg-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm z-40">
          <button
            onClick={(e) => { e.stopPropagation(); onExpand(); }}
            className="transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75 px-6 py-2.5 bg-accent-primary text-white rounded-full font-semibold text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(var(--accent-primary),0.4)] hover:bg-accent-primary/90 hover:scale-105"
          >
            <Eye size={16} strokeWidth={2.5} />
            View Project
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-6 gap-3 min-h-0 bg-gradient-to-b from-transparent to-bg-primary/50">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-text-primary tracking-tight line-clamp-1 group-hover:text-accent-primary transition-colors duration-300">
            {project.title}
          </h3>
        </div>
        <p className="text-sm text-text-muted mb-4 line-clamp-2 leading-relaxed font-light">
          {project.description || 'No description available for this project.'}
        </p>

        <div className="mt-auto space-y-5">
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {project.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-[11px] font-medium text-text-muted/70 px-1">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex gap-1.5 -ml-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 rounded-xl transition-all duration-300 hover:scale-110"
                  title="View Code"
                >
                  <Github size={18} strokeWidth={2} />
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 rounded-xl transition-all duration-300 hover:scale-110"
                  title="Live Demo"
                >
                  <ExternalLink size={18} strokeWidth={2} />
                </a>
              )}
            </div>

            {isAdmin && (
              <div className="flex gap-1.5 -mr-2">
                <Link
                  href={`/editor?id=${project.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 rounded-xl transition-all duration-300"
                >
                  <Edit3 size={16} strokeWidth={2} />
                </Link>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure?')) await deleteProject(project.id);
                  }}
                  className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PROJECTS CAROUSEL                                                           */
/* -------------------------------------------------------------------------- */

export type ProjectsCarouselProps = {
  projects?: Project[];
  isAdmin?: boolean;
};

export default function ProjectsCarousel({
  projects = [],
  isAdmin = false
}: ProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const cardsPerView = isMobile
    ? CARDS_PER_VIEW.mobile
    : isTablet
    ? CARDS_PER_VIEW.tablet
    : CARDS_PER_VIEW.desktop;

  const safeProjects = Array.isArray(projects) ? projects : [];
  const totalPages = Math.ceil(safeProjects.length / cardsPerView);
  const maxIndex = Math.max(0, safeProjects.length - cardsPerView);

  /* ----------------------------- NAVIGATION ----------------------------- */

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500); // Matched with CSS transition
  }, [isAnimating]);

  const goToNext = useCallback(() => {
    goTo(currentIndex >= maxIndex ? 0 : Math.min(currentIndex + cardsPerView, maxIndex));
  }, [currentIndex, maxIndex, cardsPerView, goTo]);

  const goToPrev = useCallback(() => {
    goTo(currentIndex <= 0 ? maxIndex : Math.max(currentIndex - cardsPerView, 0));
  }, [currentIndex, maxIndex, cardsPerView, goTo]);

  /* ----------------------------- AUTO SCROLL ----------------------------- */

  useEffect(() => {
    if (isPaused || safeProjects.length <= cardsPerView) return;
    autoScrollRef.current = setInterval(goToNext, AUTO_SCROLL_INTERVAL);
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, [isPaused, safeProjects.length, cardsPerView, goToNext]);

  /* ----------------------------- BODY SCROLL LOCK ----------------------- */

  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeProject]);

  /* ----------------------------- TOUCH SWIPE ----------------------------- */

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? goToNext() : goToPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  /* ----------------------------- EMPTY STATE ----------------------------- */

  if (safeProjects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-bg-secondary/20 backdrop-blur-md p-16 text-center transition-all hover:bg-bg-secondary/30">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-primary/10 text-accent-primary mb-6 ring-8 ring-accent-primary/5">
          <FolderGit2 size={36} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3 tracking-tight">Nothing here yet</h3>
        <p className="text-base text-text-muted max-w-md mx-auto font-light">
          New projects are currently brewing. Check back soon to see the latest updates!
        </p>
      </div>
    );
  }

  /* ----------------------------- RENDER ---------------------------------- */

  const gapPx = 24; 
  const currentPage = Math.round(currentIndex / cardsPerView);

  return (
    <>
      <div
        className="relative group/carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cleaner container without the heavy background gradients */}
        <div className="relative overflow-hidden rounded-3xl py-4 md:py-8 px-2 md:px-6">

          {/* TRACK WRAPPER */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex"
              style={{
                gap: `${gapPx}px`,
                transform: `translateX(calc(-${currentIndex} * (100% / ${cardsPerView} + ${gapPx / cardsPerView}px)))`,
                transition: isAnimating ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
                willChange: 'transform',
              }}
            >
              {safeProjects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    flex: `0 0 calc(${100 / cardsPerView}% - ${gapPx * (cardsPerView - 1) / cardsPerView}px)`,
                    minWidth: 0,
                  }}
                  className="py-2" // Added slight padding so the hover shadow isn't clipped
                >
                  <ProjectCard
                    project={project}
                    onExpand={() => setActiveProject(project)}
                    isAdmin={isAdmin}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* NAVIGATION BUTTONS */}
          {safeProjects.length > cardsPerView && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-text-primary hover:border-accent-primary/50 hover:text-accent-primary hover:bg-accent-primary/10 hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl opacity-0 group-hover/carousel:opacity-100 -translate-x-4 group-hover/carousel:translate-x-0 z-20"
                aria-label="Previous projects"
              >
                <ChevronLeft size={24} strokeWidth={2} className="-ml-0.5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-text-primary hover:border-accent-primary/50 hover:text-accent-primary hover:bg-accent-primary/10 hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl opacity-0 group-hover/carousel:opacity-100 translate-x-4 group-hover/carousel:translate-x-0 z-20"
                aria-label="Next projects"
              >
                <ChevronRight size={24} strokeWidth={2} className="-mr-0.5" />
              </button>
            </>
          )}
        </div>

        {/* PAGINATION DOTS */}
        <div className="flex flex-col items-center gap-3 mt-2">
          {totalPages > 1 && (
            <div className="flex gap-2.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i * cardsPerView)}
                  className={`rounded-full transition-all duration-500 ease-out ${
                    i === currentPage
                      ? 'w-8 h-2 bg-accent-primary shadow-[0_0_10px_rgba(var(--accent-primary),0.5)]'
                      : 'w-2 h-2 bg-text-muted/20 hover:bg-text-muted/50 hover:scale-125'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
            style={{ overscrollBehavior: 'contain' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
              className="relative w-full h-full max-w-3xl md:h-auto flex items-center justify-center p-0 md:p-6"
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 md:top-2 md:right-2 z-50 bg-bg-secondary/80 backdrop-blur-md hover:bg-bg-tertiary text-text-primary border border-white/10 rounded-full p-2.5 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                aria-label="Close project details"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              <div className="w-full h-full md:rounded-3xl bg-bg-primary overflow-y-auto max-h-[100dvh] md:max-h-[85vh] shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-white/5 scrollbar-hide">
                <ProjectDetailModal
                  project={activeProject}
                  onClose={() => setActiveProject(null)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}