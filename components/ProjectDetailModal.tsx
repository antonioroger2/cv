'use client';

import { Project } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, FileText, Calendar, Tag, ArrowUpRight } from 'lucide-react';
import { useMemo, useEffect, useCallback, useState } from 'react';

interface Props {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: Props) {
  // ── Preload hero image ─────────────────────────────────────────────────────
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const heroImgSrc = project.imageUrl || project.image;

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    if (heroImgSrc) {
      const img = new window.Image();
      img.src = heroImgSrc;
      img.onload = () => setImgLoaded(true);
      img.onerror = () => setImgError(true);
    }
  }, [heroImgSrc]);

  // ── Lock body scroll without layout shift ──────────────────────────────────
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  // ── Escape key to close ────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── Lightweight markdown → HTML ────────────────────────────────────────────
  const renderedMarkdown = useMemo(() => {
    if (!project.markdownDescription) return '';
    let html = project.markdownDescription
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold mt-5 mb-2 text-text-primary">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-6 mb-3 text-text-primary">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-6 mb-4 text-text-primary">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic opacity-80">$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-bg-primary border border-border-light p-4 rounded-xl my-4 overflow-x-auto text-sm leading-relaxed"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-bg-primary border border-border-light px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent-primary underline underline-offset-2 hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc leading-relaxed">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-5 list-decimal leading-relaxed">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-text-secondary">')
      .replace(/\n/g, '<br>');

    if (!html.startsWith('<')) {
      html = `<p class="mb-4 leading-relaxed text-text-secondary">${html}</p>`;
    }
    return html;
  }, [project.markdownDescription]);

  const github = project.gitLink || project.github;
  const primaryLink = project.pdfReportLink || project.link;
  const primaryLabel = project.pdfReportLink ? 'Read Report' : 'Live Demo';
  const techList = project.techStack || project.tags || [];

  return (
    <AnimatePresence>
      {/* ── Backdrop ─────────────────────────────────────────────────────────── */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Modal ────────────────────────────────────────────────────────────── */}
      {/*
          Positioning decisions:
          - top-[72px] / sm:top-[80px]: clears most sticky navbars — adjust to match yours
          - bottom-4 / sm:bottom-6: breathing room at the bottom
          - inset-x-3 on mobile: 12px side margins, no centering trick needed
          - sm+: translate-x centering with capped max-width
          - z-[1000]: above backdrop (999) and any typical site navbar (≤100)
      -->
      */}
      <motion.div
        key="modal"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className={[
          'fixed z-[1000]',
          'inset-x-3 top-[72px] bottom-4',
          'sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[92vw] sm:max-w-4xl sm:top-[80px] sm:bottom-6',
          'bg-bg-primary rounded-2xl shadow-2xl',
          'flex flex-col overflow-hidden',
        ].join(' ')}
      >
        {/* ── Close button — always above everything including site nav ─────── */}
        <div className="absolute top-3 right-3 z-[1010]">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-sm text-white transition-colors shadow-lg ring-1 ring-white/10"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Hero image ───────────────────────────────────────────────────────── */}
        <div className="relative shrink-0 h-40 sm:h-56 w-full overflow-hidden rounded-t-2xl">

          {/* Skeleton pulse while image is loading */}
          {!imgLoaded && !imgError && heroImgSrc && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-primary animate-pulse z-10">
              <div className="w-16 h-16 rounded-full bg-white/10" />
            </div>
          )}

          {/* Hero image — fades in once preloaded */}
          {heroImgSrc && !imgError && (
            <img
              src={heroImgSrc}
              alt={project.title}
              className="w-full h-full object-cover"
              style={{
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)',
              }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          )}

          {/* Fallback avatar on error */}
          {imgError && (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&size=800&background=3b82f6&color=fff&bold=true&length=2`}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Gradient fade into modal body */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/25 to-transparent" />

          {project.featured && (
            <span className="absolute top-3 left-3 bg-accent-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md z-10">
              Featured
            </span>
          )}
        </div>

        {/* ── Scrollable content ────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 pb-8 pt-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(156,163,175,0.35) transparent' }}
        >
          <div className="grid md:grid-cols-[1fr_1.15fr] gap-x-8 gap-y-6 pt-1">

            {/* ── Left column: core metadata ─────────────────────────────────── */}
            <div className="space-y-5">

              {/* Title + tagline */}
              <div>
                <h1 className="text-2xl sm:text-[1.75rem] font-bold text-text-primary leading-tight">
                  {project.title}
                </h1>
                {project.tagline && (
                  <p className="mt-1.5 text-[15px] text-accent-primary font-medium">
                    {project.tagline}
                  </p>
                )}
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-text-muted border-y border-border-light py-3">
                <span className="flex items-center gap-1.5">
                  <Tag size={13} className="opacity-60 shrink-0" />
                  {project.topic || 'Technology'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="opacity-60 shrink-0" />
                  {project.lastUpdated
                    ? new Date(project.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })
                    : 'Recently'}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-2">
                  About
                </p>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tech stack */}
              {techList.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-2.5">
                    Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {techList.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-accent-primary/10 text-accent-primary text-[13px] font-medium border border-accent-primary/20 leading-none"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(github || primaryLink) && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-2.5">
                    Links
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {github && (
                      <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-light text-text-primary text-sm font-medium transition-colors"
                      >
                        <Github size={15} />
                        Source Code
                        <ArrowUpRight size={13} className="opacity-45" />
                      </a>
                    )}
                    {primaryLink && (
                      <a
                        href={primaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors shadow-md shadow-accent-primary/25"
                      >
                        <FileText size={15} />
                        {primaryLabel}
                        <ArrowUpRight size={13} className="opacity-75" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right column: markdown detail ─────────────────────────────── */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                Detailed Overview
              </p>

              {project.markdownDescription ? (
                <div className="bg-bg-secondary/40 border border-border-light rounded-xl p-5 sm:p-6">
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert text-[14.5px] leading-relaxed text-text-secondary"
                    dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                  />
                </div>
              ) : (
                <div className="border border-dashed border-border-light rounded-xl p-10 flex flex-col items-center justify-center text-center text-text-muted min-h-[160px]">
                  <FileText size={34} className="mb-3 opacity-20" />
                  <p className="text-sm">No detailed documentation yet.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}