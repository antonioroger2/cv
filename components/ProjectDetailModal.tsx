'use client';

import { Project } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, FileText, Calendar, Tag, Code, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: Props) {
  const [renderedMarkdown, setRenderedMarkdown] = useState<string>('');

  useEffect(() => {
    // Simple Markdown renderer (basic implementation)
    // In production, consider using react-markdown for better rendering
    if (project.markdownDescription) {
      let html = project.markdownDescription
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-3 overflow-x-auto"><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
        // Lists
        .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-3">')
        .replace(/\n/g, '<br>');

      // Wrap in paragraph if not already wrapped
      if (!html.startsWith('<')) {
        html = `<p class="mb-3">${html}</p>`;
      }

      setRenderedMarkdown(html);
    }
  }, [project]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-bg-primary rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&size=400&background=3b82f6&color=fff&bold=true`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary to-transparent"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-all"
            >
              <X size={20} />
            </button>
            {project.featured && (
              <div className="absolute top-4 left-4 bg-gradient-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-16rem)] overflow-y-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
          }}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Project Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">{project.title}</h1>
                  {project.tagline && (
                    <p className="text-lg text-accent-primary font-medium">{project.tagline}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <Tag size={18} />
                    Topic
                  </h3>
                  <p className="text-text-muted">{project.topic || 'Technology'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Description</h3>
                  <p className="text-text-muted leading-relaxed">{project.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Code size={18} />
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={`${project.id}-${tech}-${i}`}
                        className="skill-tag"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Links</h3>
                  <div className="flex gap-3">
                    {project.gitLink && (
                      <a
                        href={project.gitLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Github size={16} />
                        View Code
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {project.pdfReportLink && (
                      <a
                        href={`/report/${project.id}`}
                        className="btn-primary flex items-center gap-2"
                      >
                        <FileText size={16} />
                        View Report
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Calendar size={16} />
                  <span>Last updated: {new Date(project.lastUpdated * 1000).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Right Column - Markdown Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Project Details</h3>
                {project.markdownDescription ? (
                  <div className="border border-border-light rounded-xl p-6 max-h-96 overflow-y-auto" style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
                  }}>
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                    />
                  </div>
                ) : (
                  <div className="border border-border-light rounded-xl p-6 text-center text-text-muted">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No detailed description available</p>
                    <p className="text-sm mt-2">Add markdown content to the project for detailed information</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}