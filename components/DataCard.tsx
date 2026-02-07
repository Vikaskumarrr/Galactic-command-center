"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './DataCard.module.css';
import { componentAnimationVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/theme';

interface DataItem {
  label: string;
  value: string;
}

interface DataCardProps {
  title: string;
  description: string;
  items: DataItem[];
  accentColor: string;
}

const getColorValue = (color: string): string => {
  const colorMap: Record<string, string> = {
    blue: '#00e5ff',
    red: '#ff003c',
    green: '#00ff88',
    yellow: '#ffc800',
    purple: '#7f5af0',
    cyan: '#00e5ff',
    orange: '#ff8c00',
    pink: '#ff69b4',
    white: '#fffffe',
    gold: '#ffd700',
  };
  return colorMap[color.toLowerCase()] || color;
};

export const DataCard: React.FC<Partial<DataCardProps>> = ({
  title = '',
  description = '',
  items = [],
  accentColor = 'blue',
}) => {
  const colorValue = getColorValue(accentColor || 'blue');
  const glowColor = `${colorValue}66`;

  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.dataCard}`}
      style={{
        '--accent-color': colorValue,
        '--accent-glow': glowColor,
      } as React.CSSProperties}
      role="article"
      aria-label={title}
    >
      <div className="scanline" aria-hidden="true" />

      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}

      {items.length > 0 && (
        <motion.div
          className={styles.itemsGrid}
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={staggerItemVariants}
              className={styles.item}
            >
              <span className={styles.itemLabel}>{item.label}</span>
              <span className={styles.itemValue}>{item.value}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DataCard;
