'use client';

import { Experience } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (expandedId) {
      itemRefs.current[expandedId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [expandedId]);

  const formatDate = (dateString: string) => {
    const parsed = Date.parse(dateString);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    const match = dateString.match(/^([A-Za-z]{3,})\s+(\d{4})$/);
    if (match) {
      const fallback = Date.parse(`${match[1]} 1, ${match[2]}`);
      if (!Number.isNaN(fallback)) {
        return new Date(fallback).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      }
    }
    return dateString;
  };

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <section id="experience" className="pt-25 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Experience</h2>
          <div className="w-12 h-1 bg-accent-primary rounded-full"></div>
        </motion.div>

        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border-light"></div>

          <div className="space-y-0">
            {experiences.map((exp, index) => {
              const isExpanded = expandedId === exp.id;

              return (
                <motion.div
                  key={exp.id}
                  ref={(el) => { itemRefs.current[exp.id] = el; }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative pl-10 pb-8 last:pb-0 group"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1.5 top-[9px] w-[9px] h-[9px] rounded-full border-2 border-accent-primary bg-bg-primary group-hover:bg-accent-primary transition-colors duration-200"></div>

                  {/* Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(exp.id); } }}
                    onClick={() => toggle(exp.id)}
                    aria-expanded={isExpanded}
                    className="cursor-pointer rounded-lg border border-border-light bg-bg-primary p-6 hover:border-accent-primary/30 transition-all duration-200"
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-text-primary leading-snug">{exp.title}</h3>
                        <p className="text-sm text-text-secondary mt-0.5">{exp.company}</p>

                        <div className="mt-2 text-sm text-text-muted flex items-center gap-3" aria-hidden="true">
                          <Calendar size={14} />
                          <span>
                          {/* Safe check: render empty string if date is missing */}
                          {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate ?? '')}
                        </span>
                        </div>

                        {/* compact view: only dates shown (location/duration/type removed per spec) */}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                        <span className="text-sm text-text-secondary md:hidden">Details</span>
                        <ChevronDown
                          size={16}
                          className={`text-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {/* make the entire card keyboard-focusable and operable */}
                    {/* added role/button and onKeyDown to the clickable card below */}

                    {/* Expandable content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pt-5 mt-5 border-t border-border-light/60 grid gap-6 md:grid-cols-3">

                            {/* Left: description + roles (primary) */}
                            <div className="md:col-span-2 space-y-5">
                              <p className="text-base text-text-muted leading-relaxed">{exp.description}</p>

                              {exp.roles && exp.roles.length > 0 && (
                                <div className="space-y-4">
                                  <div className="text-xs text-text-secondary">Period</div>
                                  <div className="text-sm text-text-primary">{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate!)}</div>
                                  <div className="grid gap-3">
                                    {exp.roles.map((role) => (
                                      <div key={role.id} className="rounded-lg bg-bg-tertiary/50 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="min-w-0">
                                            <p className="text-sm font-medium text-text-primary">{role.title}</p>
                                            <p className="text-xs text-text-muted mt-1">
                                              {formatDate(role.startDate)} – {role.current ? 'Present' : formatDate(role.endDate!)}
                                            </p>
                                          </div>
                                        </div>

                                        <p className="text-sm text-text-muted mt-3">{role.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right: compact metadata */}
                            <aside className="md:col-span-1 bg-bg-secondary/60 rounded-md p-4 h-full text-sm">
                              <div className="space-y-4 text-text-muted">
                                {exp.location && (
                                  <div>
                                    <div className="text-xs text-text-secondary">Location</div>
                                    <div className="text-sm text-text-primary">{exp.location}</div>
                                  </div>
                                )}

                                <div>
                                  <div className="text-xs text-text-secondary">Company</div>
                                  <div className="text-sm text-text-primary">{exp.company}</div>
                                </div>

                              </div>
                            </aside>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}