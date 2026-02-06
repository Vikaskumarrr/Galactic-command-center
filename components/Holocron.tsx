"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Holocron.module.css';
import { componentAnimationVariants } from '@/lib/theme';

interface HolocronProps {
  message: string;
  speaker: string;
}

export const Holocron: React.FC<HolocronProps> = ({ message, speaker }) => {
  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.holocron}`}
      role="article"
      aria-label={`Wisdom from ${speaker}`}
    >
      <div className={styles.scanline} aria-hidden="true" />
      <Sparkles size={32} className={styles.icon} aria-hidden="true" />
      <blockquote className={styles.quote}>
        "{message}"
      </blockquote>
      <cite className={styles.speaker}>
        — {speaker}
      </cite>
    </motion.div>
  );
};

export default Holocron;
