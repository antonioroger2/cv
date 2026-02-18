'use client';

import { Certification } from '@/lib/types';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink } from 'lucide-react';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const formatDate = (dateString: string) => {
    const cleanDate = dateString.replace(/\(Present\)$/, '');
    const parsed = Date.parse(cleanDate);
    if (!Number.isNaN(parsed)) {
      const date = new Date(parsed);
      const formatted = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (date > new Date()) {
        return `${formatted}(Present)`;
      }
      return formatted;
    }

    const match = cleanDate.match(/^([A-Za-z]{3,})\s+(\d{4})$/);
    if (match) {
      const fallbackParsed = Date.parse(`${match[1]} 01, ${match[2]}`);
      if (!Number.isNaN(fallbackParsed)) {
        const date = new Date(fallbackParsed);
        const formatted = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        if (date > new Date()) {
          return `${formatted}(Present)`;
        }
        return formatted;
      }
    }

    return dateString;
  };

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-text-primary mb-2">Licenses & Certifications</h2>
          <div className="w-12 h-1 bg-accent-primary rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-neumorphic p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-accent-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-text-primary mb-1 line-clamp-2">
                    {cert.title}
                  </h3>

                  <div className="text-accent-primary font-medium mb-2">
                    {cert.issuer}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-text-muted mb-2">
                    <Calendar size={14} />
                    <span>Issued {formatDate(cert.issueDate)}</span>
                  </div>

                  {cert.expiryDate && (
                    <div className="text-sm text-text-muted mb-2">
                      Expires: {formatDate(cert.expiryDate)}
                    </div>
                  )}

                  {cert.credentialId && (
                    <div className="text-sm text-text-muted mb-3">
                      Credential ID: {cert.credentialId}
                    </div>
                  )}

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cert.skills.map((skill, i) => (
                        <span
                          key={`${cert.id}-skill-${i}`}
                          className="skill-tag text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent-primary hover:text-accent-secondary text-sm font-medium transition-colors"
                    >
                      <span>View Certificate</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}