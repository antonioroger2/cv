'use client';

import { useEffect, useState, useRef } from 'react';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group h-full"
    >
      <div 
        className="
          relative flex flex-col h-full 
          bg-bg-secondary/30 backdrop-blur-sm 
          rounded-2xl border border-white/5 
          overflow-hidden 
          transition-all duration-300 
          hover:border-accent-primary/50 hover:shadow-2xl hover:shadow-accent-primary/10
          cursor-pointer
        "
        onClick={onExpand}
      >
        {/* Image / Thumbnail Section */}
        <div className="relative aspect-video overflow-hidden bg-bg-tertiary">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              onError={(e) => {
                // Fallback if image load fails
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}

          {/* Fallback for no image (Abstract Pattern instead of Initials) */}
          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-primary ${project.image ? 'hidden' : ''}`}>
             <div className="relative">
                <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full" />
                <FolderGit2 className="relative w-12 h-12 text-text-muted/50" />
             </div>
          </div>
          
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-accent-primary/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-lg z-10">
              <Star size={10} fill="currentColor" />
              Featured
            </div>
          )}

          {/* Hover Overlay with Action Button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              className="
                transform translate-y-4 group-hover:translate-y-0
                transition-all duration-300
                px-5 py-2.5 
                bg-accent-primary text-white 
                rounded-full font-medium text-sm
                flex items-center gap-2 
                shadow-lg hover:bg-accent-primary/90
              "
            >
              <Eye size={16} />
              View Details
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-text-primary line-clamp-1 group-hover:text-accent-primary transition-colors">
              {project.title}
            </h3>
          </div>

          <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
            {project.description || 'No description available for this project.'}
          </p>

          {/* Tech Stack - Limited to 3 */}
          <div className="mt-auto">
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {project.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="
                      text-[11px] font-medium px-2 py-1 
                      rounded-md bg-white/5 border border-white/10 
                      text-text-muted
                    "
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="text-[10px] font-semibold text-text-muted/60 px-1">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="View Code"
                  >
                    <Github size={16} />
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Live Demo"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              
               </div>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
              <Link
                href={`/editor?id=${project.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-lg bg-accent-primary/10 text-accent-primary hover:bg-accent-primary hover:text-white transition-all"
              >
                <Edit3 size={14} /> Edit
              </Link>
              <button
                onClick={(e) => e.stopPropagation()}
                className="px-3 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation(); // Prevents opening the project details modal
                  
                  if (window.confirm('Are you sure you want to delete this project?')) {
                    try {
                      await deleteProject(project.id);

                    } catch (error) {
                      console.error("Error deleting project:", error);
                      alert("Failed to delete project.");
                    }
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN CAROUSEL                                  */
/* -------------------------------------------------------------------------- */

interface ProjectsCarouselProps {
  projects?: Project[];
  isAdmin?: boolean;
}

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
  // maxScrollIndex represents the starting index of the last full view
  const maxScrollIndex = Math.max(0, safeProjects.length - cardsPerView);
  const totalPages = Math.ceil(safeProjects.length / cardsPerView);

  /* ----------------------------- AUTO SCROLL ----------------------------- */

  /* ----------------------------- AUTO SCROLL ----------------------------- */

useEffect(() => {
  if (isPaused || safeProjects.length <= cardsPerView) return;

  autoScrollRef.current = setInterval(() => {
    goToNext(); // This now uses the reset logic defined above
  }, AUTO_SCROLL_INTERVAL);

  return () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };
}, [isPaused, maxScrollIndex, cardsPerView, safeProjects.length]);

  /* ----------------------------- NAVIGATION ----------------------------- */

const goToNext = () => {
  setCurrentIndex((prev) => {
    // If we're at or past the max index, reset to 0
    if (prev >= maxScrollIndex) return 0;
    return Math.min(prev + cardsPerView, maxScrollIndex);
  });
};

const goToPrev = () => {
  setCurrentIndex((prev) => {
    // If we're at the beginning, jump to the last possible index
    if (prev <= 0) return maxScrollIndex;
    return Math.max(prev - cardsPerView, 0);
  });
};

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
          New projects are currently in development. Check back soon to see what we're building!
        </p>
      </div>
    );
  }

  /* ----------------------------- RENDER LOGIC ----------------------------- */

  const visibleProjects = safeProjects.slice(currentIndex, currentIndex + cardsPerView);
  const currentPage = Math.floor(currentIndex / cardsPerView);

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

          {/* Navigation Buttons (Only show if we have more projects than view) */}
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

        
        {/* Project Count */}
        <div className="text-center mt-4">
          <p className="text-sm text-text-muted">
            Showing {currentIndex + 1}-{Math.min(currentIndex + cardsPerView, safeProjects.length)} of {safeProjects.length} projects
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectDetailModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}