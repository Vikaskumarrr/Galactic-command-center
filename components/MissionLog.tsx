"use client";

import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MissionLog.module.css';
import { componentAnimationVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/theme';

interface Mission {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  priority: 'low' | 'medium' | 'high';
}

interface MissionLogProps {
  missions: Mission[];
}

const getStatusIcon = (status: Mission['status'], priority: Mission['priority']) => {
  const iconClass = `${styles.statusIcon} ${
    status === 'completed' ? styles.completed :
    status === 'in-progress' ? styles.inProgress :
    priority === 'high' ? styles.highPriority : styles.pending
  }`;

  switch (status) {
    case 'completed':
      return <CheckCircle2 size={20} className={iconClass} />;
    case 'in-progress':
      return <Clock size={20} className={iconClass} />;
    default:
      return <Circle size={20} className={iconClass} />;
  }
};

const getPriorityClass = (priority: Mission['priority']) => {
  switch (priority) {
    case 'high': return styles.priorityHigh;
    case 'medium': return styles.priorityMedium;
    default: return styles.priorityLow;
  }
};

const getStatusClass = (status: Mission['status']) => {
  switch (status) {
    case 'completed': return styles.statusCompleted;
    case 'in-progress': return styles.statusInProgress;
    default: return styles.statusPending;
  }
};

export const MissionLog: React.FC<MissionLogProps> = ({ missions }) => {
  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.missionLog}`}
      role="region"
      aria-label="Active mission directives"
    >
      <div className="scanline" aria-hidden="true" />
      <h2 className={styles.title}>Active Directives</h2>

      <motion.div 
        className={styles.missionList}
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        role="list"
      >
        <AnimatePresence>
          {missions.map((mission) => (
            <motion.div
              key={mission.id}
              variants={staggerItemVariants}
              layout
              className={styles.missionItem}
              role="listitem"
            >
              {getStatusIcon(mission.status, mission.priority)}
              <div className={styles.missionContent}>
                <div className={styles.missionTitle}>{mission.title}</div>
                <div className={styles.missionMeta}>
                  <span className={`${styles.priorityBadge} ${getPriorityClass(mission.priority)}`}>
                    {mission.priority}
                  </span>
                  <span className={`${styles.statusBadge} ${getStatusClass(mission.status)}`}>
                    {mission.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MissionLog;
