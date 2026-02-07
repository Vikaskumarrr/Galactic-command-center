"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CrewRoster.module.css';
import { componentAnimationVariants } from '@/lib/theme';

interface CrewMember {
  id: string;
  name: string;
  role: string;
  species: string;
  affiliation: string;
  details: string;
}

interface CrewRosterProps {
  crew: CrewMember[];
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAffiliationClass = (affiliation: string) => {
  const lower = affiliation.toLowerCase();
  if (lower.includes('rebel') || lower.includes('alliance') || lower.includes('republic')) {
    return 'rebel';
  }
  if (lower.includes('empire') || lower.includes('imperial') || lower.includes('sith')) {
    return 'imperial';
  }
  return 'neutral';
};

export const CrewRoster: React.FC<Partial<CrewRosterProps>> = ({ crew = [] }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.crewRoster}`}
      role="region"
      aria-label="Crew roster"
    >
      <div className="scanline" aria-hidden="true" />
      <h2 className={styles.title}>Crew Roster</h2>

      <div className={styles.crewGrid} role="list">
        {crew.map((member) => {
          const isExpanded = expandedId === member.id;
          const affiliationClass = getAffiliationClass(member.affiliation);

          return (
            <motion.div
              key={member.id}
              layout
              className={`${styles.crewCard} ${isExpanded ? styles.expanded : ''}`}
              onClick={() => handleCardClick(member.id)}
              role="listitem"
              aria-expanded={isExpanded}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(member.id);
                }
              }}
            >
              <div className={styles.cardHeader}>
                <div className={`${styles.avatar} ${styles[affiliationClass]}`}>
                  {getInitials(member.name)}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.crewName}>{member.name}</div>
                  <div className={styles.crewRole}>{member.role}</div>
                  <div className={styles.crewSpecies}>{member.species}</div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.expandedDetails}
                  >
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Affiliation</span>
                      <span className={styles.detailValue}>
                        <span className={`${styles.affiliationBadge} ${styles[affiliationClass]}`}>
                          {member.affiliation}
                        </span>
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Details</span>
                      <span className={styles.detailValue}>{member.details}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CrewRoster;
