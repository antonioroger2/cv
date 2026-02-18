'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Github, 
  Star, 
  FolderGit2, 
  Eye, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import ProjectDetailModal from './ProjectDetailModal';
import { deleteProject } from '@/lib/database';

/* -------------------------------------------------------------------------- */
/* CONFIG                                   */
/* -------------------------------------------------------------------------- */

const AUTO_SCROLL_INTERVAL = 5000; // 5 seconds
const CARDS_PER_VIEW = {
  mobile: 1,
  tablet: 2,
  desktop: 3
};

/* -------------------------------------------------------------------------- */
/* MEDIA QUERY HOOK                             */
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
/* PROJECT CARD                                  */
/* -------------------------------------------------------------------------- */

interface ProjectCardProps {
  project: Project;
  onExpand: () => void;
  isAdmin?: boolean;
}

function ProjectCard({ project, onExpand, isAdmin = false }: ProjectCardProps) {
  // Preload image and handle errors
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group h-full"
    >
      <div
        className="relative flex flex-col h-full bg-gradient-to-br from-bg-secondary/40 via-bg-tertiary/60 to-bg-primary/40 rounded-3xl border border-white/10 shadow-xl overflow-hidden transition-all duration-300 hover:border-accent-primary/70 hover:shadow-2xl hover:shadow-accent-primary/20 cursor-pointer"
        onClick={onExpand}
      >
        {/* ----------------------------------------------------------------- */}
        {/* IMAGE / THUMBNAIL HEADER SECTION                                  */}
        {/* ----------------------------------------------------------------- */}
        <div className="relative aspect-video overflow-hidden flex items-center justify-center bg-bg-secondary/50">
            
            {/* LAYER 1: The Thumbnail (Washed out background) */}
            {project.image && !imgError && (
              <img
                ref={imgRef}
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                  opacity: imgLoaded ? 0.25 : 0, // Low opacity for "washed out" look
                  filter: 'grayscale(100%) brightness(0.8)', // Grayscale by default
                  transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1), transform 0.7s',
                }}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            )}

            {/* LAYER 2: The Glass Gradient (Overlays the image) */}
            {/* This creates the radial glow effect mentioned in your screenshot logic */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary/80 via-bg-tertiary/50 to-bg-primary/80 z-10 pointer-events-none" />
            
            {/* LAYER 3: The Logo / Icon (Centered on Top) */}
            <div className="relative z-20 flex flex-col items-center justify-center">
                {/* Glowing backdrop for the icon */}
                <div className="absolute inset-0 bg-accent-primary/20 blur-2xl rounded-full transform scale-150" />
                <FolderGit2 
                  className="relative w-16 h-16 text-text-muted group-hover:text-accent-primary transition-colors duration-300 drop-shadow-lg" 
                  strokeWidth={1.5}
                />
            </div>

            {/* LAYER 4: Featured Badge */}
            {project.featured && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-accent-primary/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-lg z-30">
                <Star size={10} fill="currentColor" />
                Featured
              </div>
            )}

            {/* LAYER 5: Hover Interaction Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-40">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand();
                }}
                className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-5 py-2.5 bg-accent-primary text-white rounded-full font-medium text-sm flex items-center gap-2 shadow-lg hover:bg-accent-primary/90"
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
        </div>


          {/* Content Section */}
          <div className="flex flex-col flex-1 p-6 gap-2">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-text-primary line-clamp-1 group-hover:text-accent-primary transition-colors">
                {project.title}
              </h3>
            </div>
            <p className="text-base text-text-secondary mb-4 line-clamp-2 leading-relaxed">
              {project.description || 'No description available for this project.'}
            </p>
            {/* Tech Stack - Limited to 3 */}
            <div className="mt-auto">
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[12px] font-medium px-2 py-1 rounded-md bg-white/10 border border-white/20 text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-[11px] font-semibold text-text-muted/60 px-1">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="View Code"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                
                {/* Admin Controls */}
                {isAdmin && (
                  <div className="flex gap-2 ml-auto">
                    <Link
                      href={`/editor?id=${project.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-all"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure?')) await deleteProject(project.id);
                      }}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
}

// ... Rest of the file (ProjectsCarousel export) remains unchanged
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
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const cardsPerView = isMobile
    ? CARDS_PER_VIEW.mobile
    : isTablet
    ? CARDS_PER_VIEW.tablet
    : CARDS_PER_VIEW.desktop;

  const safeProjects = Array.isArray(projects) ? projects : [];

  // Calculate limits
  const maxScrollIndex = Math.max(0, safeProjects.length - cardsPerView);

  /* ----------------------------- NAVIGATION ----------------------------- */

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= maxScrollIndex) return 0;
      return Math.min(prev + cardsPerView, maxScrollIndex);
    });
  }, [maxScrollIndex, cardsPerView]);

  const goToPrev = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return maxScrollIndex;
      return Math.max(prev - cardsPerView, 0);
    });
  };

  /* ----------------------------- AUTO SCROLL ----------------------------- */

  useEffect(() => {
    if (isPaused || safeProjects.length <= cardsPerView) return;

    autoScrollRef.current = setInterval(() => {
      goToNext();
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [isPaused, maxScrollIndex, cardsPerView, safeProjects.length, goToNext]);

  /* ----------------------------- BODY SCROLL LOCK ----------------------------- */

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeProject]);

  /* ----------------------------- EMPTY STATE ----------------------------- */

  if (safeProjects.length === 0) {
    return (
      <div className="rounded-2xl border border-border-light bg-gradient-to-br from-bg-secondary to-bg-tertiary p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 text-accent-primary mb-4">
          <Star size={32} />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">
          Coming Soon
        </h3>
        <p className="text-sm text-text-muted max-w-md mx-auto">
          New projects are currently in development. Check back soon to see what we&apos;re building!
        </p>
      </div>
    );
  }

  /* ----------------------------- RENDER LOGIC ----------------------------- */

  const visibleProjects = safeProjects.slice(currentIndex, currentIndex + cardsPerView);

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-secondary/50 to-bg-tertiary/50 p-4 md:p-8">
          <div className={`grid gap-6 ${
            isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'
          }`}>
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onExpand={() => setActiveProject(project)}
                  isAdmin={isAdmin}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {safeProjects.length > cardsPerView && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-bg-primary/90 backdrop-blur-sm border border-border-light rounded-full flex items-center justify-center text-text-primary hover:border-accent-primary hover:text-accent-primary hover:bg-accent-primary/10 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed z-20"
                aria-label="Previous projects"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-bg-primary/90 backdrop-blur-sm border border-border-light rounded-full flex items-center justify-center text-text-primary hover:border-accent-primary hover:text-accent-primary hover:bg-accent-primary/10 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed z-20"
                aria-label="Next projects"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-text-muted">
            Showing {currentIndex + 1}-{Math.min(currentIndex + cardsPerView, safeProjects.length)} of {safeProjects.length} projects
          </p>
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm md:backdrop-blur-none md:bg-black/40"
            style={{ overscrollBehavior: 'contain' }}
          >
            <div
              className="relative w-full h-full max-w-2xl md:max-w-3xl md:h-auto flex items-center justify-center p-0 md:p-8"
            >
              {/* Close button always visible at top right */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-primary md:top-2 md:right-2"
                aria-label="Close project details"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <div className="w-full h-full md:rounded-2xl bg-bg-primary overflow-y-auto max-h-[100dvh] md:max-h-[90vh] shadow-2xl">
                <ProjectDetailModal
                  project={activeProject}
                  onClose={() => setActiveProject(null)}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}