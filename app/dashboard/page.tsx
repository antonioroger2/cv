'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getContactSubmissions, getProjects } from '@/lib/database';
import { ContactFormData, Project } from '@/lib/types';
import { motion } from 'framer-motion';
import { Users, Mail, Globe, Github, LogOut } from 'lucide-react';
import AuthProvider from '@/components/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';

function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactFormData[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const unsubscribeSubmissions = getContactSubmissions((subs) => {
      setSubmissions(subs);
      setLoading(false);
    });

    const unsubscribeProjects = getProjects((projs) => {
      setProjects(projs);
    });

    return () => {
      unsubscribeSubmissions();
      unsubscribeProjects();
    };
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Calculate stats
  const totalProjects = projects.length;
  const totalSubmissions = submissions.length;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-slate-400 hover:text-slate-300"
            >
              ← Back to Portfolio
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Monitor your portfolio analytics and visitors</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-neumorphic p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Globe size={24} className="text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalProjects}</div>
            <div className="text-sm text-slate-400">Total Projects</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-neumorphic p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Mail size={24} className="text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalSubmissions}</div>
            <div className="text-sm text-slate-400">Contact Forms</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-neumorphic p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{projects.filter(p => p.featured).length}</div>
            <div className="text-sm text-slate-400">Featured Projects</div>
          </motion.div>
        </div>

        {/* Projects List */}
        <div className="card-neumorphic p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Projects</h3>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{project.title}</h4>
                    {project.description && (
                      <p className="text-sm text-slate-400">{project.description.slice(0, 100)}...</p>
                    )}
                  </div>
                  <div className="text-right">
                    {project.featured && (
                      <span className="text-xs bg-accent-400/20 text-accent-400 px-2 py-1 rounded">Featured</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  {project.gitLink && (
                    <a href={project.gitLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-blue-400">
                      <Github size={16} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-green-400">
                      <Globe size={16} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Submissions */}
        {submissions.length > 0 && (
          <div className="card-neumorphic p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Form Submissions</h3>
            <div className="space-y-4">
              {submissions.map((sub, index) => (
                <div key={index} className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-white">{sub.name}</div>
                      <div className="text-sm text-slate-400">{sub.email}</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {sub.timestamp instanceof Timestamp
                        ? sub.timestamp.toDate().toLocaleDateString()
                        : sub.timestamp 
                          ? new Date(sub.timestamp as string).toLocaleDateString()
                          : 'N/A'}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">{sub.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>
  );
}
