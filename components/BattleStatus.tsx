"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './BattleStatus.module.css';
import { componentAnimationVariants } from '@/lib/theme';
import type { ThreatLevel } from '@/lib/theme';

interface BattleStatusProps {
  alliedForces: number;
  enemyForces: number;
  threatLevel: ThreatLevel;
  shieldPower: number;
  weaponPower: number;
  engagementName: string;
}

export const BattleStatus: React.FC<Partial<BattleStatusProps>> = ({
  alliedForces = 0,
  enemyForces = 0,
  threatLevel = 'low',
  shieldPower = 0,
  weaponPower = 0,
  engagementName = '',
}) => {
  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.battleStatus}`}
      role="region"
      aria-label="Battle status dashboard"
    >
      <div className="scanline" aria-hidden="true" />
      <h2 className={styles.title}>Battle Status</h2>
      <div className={styles.engagementName}>Engagement: {engagementName}</div>

      {/* Force Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Allied Forces</div>
          <motion.div
            className={`${styles.metricValue} ${styles.allied}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {alliedForces}
          </motion.div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Enemy Forces</div>
          <motion.div
            className={`${styles.metricValue} ${styles.enemy}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {enemyForces}
          </motion.div>
        </div>

        <div className={`${styles.metricCard} ${styles.threatCard}`}>
          <div className={styles.metricLabel}>Threat Level</div>
          <motion.div
            className={`${styles.threatLevel} ${styles[threatLevel]}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            role="status"
            aria-label={`Threat level: ${threatLevel}`}
          >
            {threatLevel}
          </motion.div>
        </div>
      </div>

      {/* Power Distribution */}
      <div className={styles.powerSection}>
        <div className={styles.sectionTitle}>Power Distribution</div>
        <div className={styles.powerBars}>
          <div className={styles.powerBar}>
            <span className={styles.powerLabel}>Shields</span>
            <div className={styles.powerTrack} role="progressbar" aria-valuenow={shieldPower} aria-valuemin={0} aria-valuemax={100}>
              <motion.div
                className={`${styles.powerFill} ${styles.shields}`}
                initial={{ width: 0 }}
                animate={{ width: `${shieldPower}%` }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className={styles.powerValue}>{shieldPower}%</span>
          </div>

          <div className={styles.powerBar}>
            <span className={styles.powerLabel}>Weapons</span>
            <div className={styles.powerTrack} role="progressbar" aria-valuenow={weaponPower} aria-valuemin={0} aria-valuemax={100}>
              <motion.div
                className={`${styles.powerFill} ${styles.weapons}`}
                initial={{ width: 0 }}
                animate={{ width: `${weaponPower}%` }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className={styles.powerValue}>{weaponPower}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BattleStatus;
