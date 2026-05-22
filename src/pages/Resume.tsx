import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Calendar } from 'lucide-react';

type TabType = 'career' | 'activity';

export default function Resume() {
  const { data } = useData();
  const { experiences, educations, activities } = data;
  const [activeTab, setActiveTab] = useState<TabType>('career');

  return (
    <div className="space-y-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2">Resume</h1>
        <p className="text-muted-foreground text-sm mb-6">
          My professional journey and educational background.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-muted w-fit mb-8">
          <button
            onClick={() => setActiveTab('career')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'career'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Briefcase size={16} />
            Career & Education
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'activity'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Award size={16} />
            Activity
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'career' ? (
            <motion.div
              key="career"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Work Experience */}
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Briefcase size={18} />
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={exp.logo}
                        alt={exp.company}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-sm">{exp.position}</h3>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                              exp.current
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {exp.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <GraduationCap size={18} />
                  Education
                </h2>
                <div className="space-y-4">
                  {educations.map((edu, index) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={edu.logo}
                        alt={edu.school}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">{edu.school}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={activity.logo}
                    alt={activity.organization}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.organization}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {activity.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
