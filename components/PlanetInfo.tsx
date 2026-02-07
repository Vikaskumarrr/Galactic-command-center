"use client";

import React from 'react';
import { Globe, Wind, Users, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './PlanetInfo.module.css';
import { componentAnimationVariants } from '@/lib/theme';

interface PlanetInfoProps {
  name: string;
  climate: string;
  population: string;
  terrain: string;
  description: string;
}

export const PlanetInfo: React.FC<Partial<PlanetInfoProps>> = ({ 
  name = '', 
  climate = '', 
  population = '', 
  terrain = '', 
  description = '' 
}) => {
  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.planetInfo}`}
      role="article"
      aria-label={`Information about planet ${name}`}
    >
      <div className="scanline" aria-hidden="true" />
      <h2 className={styles.title}>{name}</h2>
      <p className={styles.description}>{description}</p>
      
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <Wind size={18} className={styles.statIcon} aria-hidden="true" />
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Climate</span>
            <span className={styles.statValue}>{climate}</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <Users size={18} className={styles.statIcon} aria-hidden="true" />
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Population</span>
            <span className={styles.statValue}>{population}</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <Mountain size={18} className={styles.statIcon} aria-hidden="true" />
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Terrain</span>
            <span className={styles.statValue}>{terrain}</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <Globe size={18} className={styles.statIcon} aria-hidden="true" />
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Type</span>
            <span className={styles.statValue}>Terrestrial</span>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanetInfo;
