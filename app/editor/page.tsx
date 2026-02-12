'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { addProject, updateProject, getProject } from '@/lib/database';
import { Project } from '@/lib/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import AuthProvider from '@/components/AuthProvider';

function EditorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

  const getUniqueTechStack = (techStackString: string) => {
    const techStackArray = techStackString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return techStackArray.filter((tech, index) => {
      const lowerTech = tech.toLowerCase();
      return techStackArray.findIndex(t => t.toLowerCase() === lowerTech) === index;
    });
  };
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    gitLink: '',
    pdfReportLink: '',
    imageUrl: '',
    featured: false,
    order: 0,
    tagline: '',
    topic: '',
    markdownDescription: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (projectId && user) {
      loadProject();
    }
  }, [projectId, user]);

  const loadProject = async () => {
    try {
      const project = await getProject(projectId!);
      if (project) {
        setFormData({
          title: project.title,
          description: project.description,
          techStack: project.techStack.join(', '),
          gitLink: project.gitLink,
          pdfReportLink: project.pdfReportLink,
          imageUrl: project.imageUrl,
          featured: project.featured || false,
          order: project.order || 0,
          tagline: project.tagline || '',
          topic: project.topic || '',
          markdownDescription: project.markdownDescription || '',
        });
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate URLs
      if (formData.gitLink && !formData.gitLink.startsWith('https://') && !formData.gitLink.startsWith('http://')) {
        toast.error('GitHub link must start with https:// or http://');
        setLoading(false);
        return;
      }
      
      if (formData.imageUrl && !formData.imageUrl.startsWith('https://') && !formData.imageUrl.startsWith('http://')) {
        toast.error('Image URL must start with https:// or http://');
        setLoading(false);
        return;
      }
      
      if (formData.pdfReportLink && !formData.pdfReportLink.startsWith('https://') && !formData.pdfReportLink.startsWith('http://')) {
        toast.error('PDF Report link must start with https:// or http://');
        setLoading(false);
        return;
      }

      const techStackArray = formData.techStack
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Remove case-insensitive duplicates
      const uniqueTechStack = techStackArray.filter((tech, index) => {
        const lowerTech = tech.toLowerCase();
        return techStackArray.findIndex(t => t.toLowerCase() === lowerTech) === index;
      });

      // Warn user if duplicates were removed
      if (uniqueTechStack.length < techStackArray.length) {
        toast.warning(`Removed ${techStackArray.length - uniqueTechStack.length} duplicate tag(s)`);
      }

      const projectData: Omit<Project, 'id' | 'lastUpdated'> = {
        title: formData.title,
        description: formData.description,
        techStack: uniqueTechStack,
        gitLink: formData.gitLink,
        pdfReportLink: formData.pdfReportLink,
        imageUrl: formData.imageUrl,
        featured: formData.featured,
        order: formData.order,
        tagline: formData.tagline,
        topic: formData.topic,
        markdownDescription: formData.markdownDescription,
      };

      if (projectId) {
        await updateProject(projectId, projectData);
        toast.success('Project updated successfully');
      } else {
        const newProjectId = await addProject(projectData);
        toast.success('Project created successfully');
      }

      router.push('/');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-slate-400 hover:text-slate-300 mb-4"
          >
            ← Back to Portfolio
          </button>
          <h1 className="text-4xl font-bold mb-2">
            {projectId ? 'Edit Project' : 'New Project'}
          </h1>
          <p className="text-slate-400">
            {projectId ? 'Update your project details' : 'Add a new project to your portfolio'}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-neumorphic p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="input-neumorphic w-full"
                placeholder="My Awesome Project"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="input-neumorphic w-full resize-none"
                placeholder="Brief description of your project..."
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="input-neumorphic w-full"
                placeholder="A catchy one-liner about your project"
              />
              <p className="text-xs text-slate-500 mt-1">
                Optional short tagline that appears prominently
              </p>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Topic/Category
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="input-neumorphic w-full"
                placeholder="Web Development, AI/ML, Mobile App, etc."
              />
              <p className="text-xs text-slate-500 mt-1">
                Categorize your project (helps with organization)
              </p>
            </div>

            {/* Markdown Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Detailed Description (Markdown)
              </label>
              <textarea
                value={formData.markdownDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 2500) {
                    setFormData({ ...formData, markdownDescription: value });
                  }
                }}
                rows={8}
                className="input-neumorphic w-full resize-none font-mono text-sm"
                placeholder="# Project Overview

## Features
- Feature 1
- Feature 2

## Technical Details
**Tech Stack:** React, Node.js

## Screenshots
![Screenshot](image-url)

## Getting Started
\`\`\`bash
npm install
npm start
\`\`\`"
              />
              <p className="text-xs text-slate-500 mt-1">
                Rich markdown content (max 2500 chars). Supports headers, lists, code blocks, links, and more.
                <span className="text-slate-400 ml-2">
                  {formData.markdownDescription.length}/2500
                </span>
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tech Stack * (comma-separated)
              </label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                required
                className="input-neumorphic w-full"
                placeholder="Python, TensorFlow, React, Node.js"
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter technologies separated by commas. Duplicates will be automatically removed (case-insensitive).
              </p>
              {(() => {
                const uniqueStack = getUniqueTechStack(formData.techStack);
                const originalStack = formData.techStack.split(',').map(s => s.trim()).filter(s => s.length > 0);
                return uniqueStack.length > 0 && uniqueStack.length !== originalStack.length ? (
                  <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-xs text-blue-300">Will be saved as: {uniqueStack.join(', ')}</p>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Git Link */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub Link
              </label>
              <input
                type="url"
                value={formData.gitLink}
                onChange={(e) => setFormData({ ...formData, gitLink: e.target.value })}
                className="input-neumorphic w-full"
                placeholder="https://github.com/username/repo"
              />
            </div>

            {/* PDF Report Link */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                PDF Report Link
              </label>
              <input
                type="url"
                value={formData.pdfReportLink}
                onChange={(e) => setFormData({ ...formData, pdfReportLink: e.target.value })}
                className="input-neumorphic w-full"
                placeholder="https://firebasestorage.googleapis.com/..."
              />
              <p className="text-xs text-slate-500 mt-1">
                Upload to Firebase Storage and paste the public URL
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
                className="input-neumorphic w-full"
                placeholder="https://firebasestorage.googleapis.com/..."
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="mt-3 w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/1e293b/94a3b8?text=Invalid+Image';
                  }}
                />
              )}
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-slate-300">
                Mark as Featured Project
              </label>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Display Order (higher = shown first)
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="input-neumorphic w-full"
                placeholder="0"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {loading ? 'Saving...' : (projectId ? 'Update Project' : 'Create Project')}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function Editor() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <EditorPage />
      </Suspense>
    </AuthProvider>
  );
}
