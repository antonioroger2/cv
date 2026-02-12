'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProject } from '@/lib/database';
import { Project } from '@/lib/types';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function ReportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadProject = async () => {
    try {
      const data = await getProject(params.id);
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!project || !project.pdfReportLink) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Report Not Found</h1>
          <p className="text-slate-400 mb-6">
            The PDF report for this project is not available.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex-1 px-6 text-center">
            <h1 className="text-xl font-bold text-white truncate">
              {project.title} - Project Report
            </h1>
          </div>

          <a
            href={project.pdfReportLink}
            download
            className="flex items-center gap-2 btn-secondary text-sm py-2"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:inline">Download Report</span>
          </a>
        </div>
      </div>

      {/* Report Download */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Report</h2>
          <p className="text-slate-400 mb-6">
            Click the download button above to access the PDF report for this project.
          </p>
        </div>
      </div>
    </div>
  );
}