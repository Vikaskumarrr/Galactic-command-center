"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Shield, Rocket, Target, Award, Zap } from 'lucide-react';
import styles from './ProfilePanel.module.css';

interface ProfilePanelProps {
  onClose: () => void;
}

const stats = [
  { icon: Rocket, label: 'Missions Completed', value: 147, color: 'var(--force-blue)' },
  { icon: Target, label: 'Accuracy Rating', value: '94.2%', color: 'var(--jedi-green)' },
  { icon: Shield, label: 'Shields Deployed', value: 312, color: 'var(--holo-violet)' },
  { icon: Zap, label: 'Hyperspace Jumps', value: 89, color: 'var(--warning-yellow)' },
];

const badges = [
  { icon: Star, label: 'Gold Star Pilot', color: 'var(--warning-yellow)' },
  { icon: Award, label: 'Rebel Hero', color: 'var(--jedi-green)' },
  { icon: Shield, label: 'Shield Master', color: 'var(--force-blue)' },
];

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ onClose }) => {
  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.panel}
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close profile">
          <X size={20} />
        </button>

        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <motion.div
            className={styles.avatarRing}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div className={styles.ringInner} />
          </motion.div>
          <div className={styles.avatar}>
            <img
              src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=commander&backgroundColor=0a0b1e"
              alt="Commander avatar"
              className={styles.avatarImg}
            />
          </div>
          <motion.h2
            className={styles.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Commander Skywalker
          </motion.h2>
          <motion.p
            className={styles.rank}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            ★ Admiral · Rebel Alliance ★
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <div className={styles.badgesSection}>
          <h3 className={styles.sectionTitle}>Achievements</h3>
          <div className={styles.badgesRow}>
            {badges.map((badge, i) => (
              <motion.div
                key={badge.label}
                className={styles.badge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 400 }}
                title={badge.label}
              >
                <badge.icon size={18} style={{ color: badge.color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePanel;
