'use client';

import { Education } from '@/lib/types';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award } from 'lucide-react';

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
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
    <section id="education" className="pt-25 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-text-primary mb-2">Education</h2>
          <div className="w-12 h-1 bg-accent-primary rounded-full"></div>
        </motion.div>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={`${edu.institution}-${edu.degree}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-border-light"></div>

              {/* Timeline dot */}
              <div className="absolute left-4 top-6 w-4 h-4 bg-accent-secondary rounded-full border-4 border-bg-primary"></div>

              <div className="ml-16">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{edu.degree}</h3>
                    <div className="flex items-center gap-2 text-accent-secondary font-medium">
                      <GraduationCap size={16} />
                      <span>{edu.institution}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-text-muted mt-1 md:mt-0">
                    <Calendar size={14} />
                    <span>
                      {edu.startDate && edu.endDate
                        ? `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`
                        : edu.year || 'Ongoing'
                      }
                    </span>
                  </div>
                </div>

                {(edu.cgpa || edu.grade) && (
                  <div className="flex items-center gap-1 text-sm text-text-muted mb-3">
                    <Award size={14} />
                    <span>
                      {edu.cgpa ? `CGPA: ${edu.cgpa}` : edu.grade ? `Grade: ${edu.grade}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}