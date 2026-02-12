'use client';

import { Achievement } from '@/lib/types';
import { motion } from 'framer-motion';
import { Trophy, Calendar, ExternalLink } from 'lucide-react';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-text-primary mb-2">Honors & Awards</h2>
          <div className="w-12 h-1 bg-accent-primary rounded-full"></div>
        </motion.div>

        <div className="space-y-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-border-light"></div>

              {/* Timeline dot */}
              <div className="absolute left-4 top-6 w-4 h-4 bg-accent-tertiary rounded-full border-4 border-bg-primary"></div>

              <div className="ml-16">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent-tertiary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Trophy className="w-5 h-5 text-accent-tertiary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary mb-1">
                        {achievement.title}
                      </h3>
                      {achievement.issuer && (
                        <div className="text-accent-tertiary font-medium mb-2">
                          {achievement.issuer}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-text-muted mt-1 md:mt-0">
                    <Calendar size={14} />
                    <span>{formatDate(achievement.issueDate)}</span>
                  </div>
                </div>

                <p className="text-text-muted leading-relaxed mb-3 ml-13">
                  {achievement.description}
                </p>

                {achievement.certificateUrl && (
                  <div className="ml-13">
                    <a
                      href={achievement.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent-primary hover:text-accent-secondary text-sm font-medium transition-colors"
                    >
                      <span>View Certificate</span>
                      <ExternalLink size={14} />
                    </a>
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