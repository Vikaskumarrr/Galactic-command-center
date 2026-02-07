"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './StarshipFleet.module.css';
import { componentAnimationVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/theme';

interface Starship {
  id: string;
  name: string;
  model: string;
  shields: number;
  power: number;
  status: 'active' | 'repair' | 'combat';
}

interface StarshipFleetProps {
  fleetName: string;
  ships: Starship[];
}

const getStatusClass = (status: Starship['status']) => {
  switch (status) {
    case 'active': return styles.statusActive;
    case 'repair': return styles.statusRepair;
    case 'combat': return styles.statusCombat;
    default: return styles.statusActive;
  }
};

const getProgressColor = (value: number) => {
  if (value >= 70) return styles.progressGreen;
  if (value >= 40) return styles.progressYellow;
  return styles.progressRed;
};

export const StarshipFleet: React.FC<Partial<StarshipFleetProps>> = ({ fleetName = '', ships = [] }) => {
  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.starshipFleet}`}
      role="region"
      aria-label={`${fleetName} fleet deployment status`}
    >
      <div className="scanline" aria-hidden="true" />
      <h2 className={styles.title}>{fleetName} Deployment</h2>

      <motion.div 
        className={styles.shipList}
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        role="list"
      >
        {ships.map((ship) => (
          <motion.div
            key={ship.id}
            variants={staggerItemVariants}
            className={styles.shipCard}
            role="listitem"
            aria-label={`${ship.name} - ${ship.status}`}
          >
            <div className={styles.shipHeader}>
              <span className={styles.shipName}>{ship.name}</span>
              <span className={`${styles.statusBadge} ${getStatusClass(ship.status)}`}>
                {ship.status}
              </span>
            </div>
            <div className={styles.shipModel}>{ship.model}</div>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.statHeader}>
                  <span>Shields</span>
                  <span className={styles.statValue}>{ship.shields}%</span>
                </div>
                <div className={styles.progressBar}>
                  <motion.div
                    className={`${styles.progressFill} ${styles.progressBlue}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${ship.shields}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statHeader}>
                  <span>Power</span>
                  <span className={styles.statValue}>{ship.power}%</span>
                </div>
                <div className={styles.progressBar}>
                  <motion.div
                    className={`${styles.progressFill} ${getProgressColor(ship.power)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${ship.power}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StarshipFleet;
