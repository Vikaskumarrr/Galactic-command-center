"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './StyledContent.module.css';
import { componentAnimationVariants } from '@/lib/theme';

interface StyledContentProps {
  title: string;
  content: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  style: 'heading' | 'paragraph' | 'quote' | 'highlight' | 'banner';
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

const VALID_STYLES = ['heading', 'paragraph', 'quote', 'highlight', 'banner'] as const;
type ValidStyle = typeof VALID_STYLES[number];

const VALID_SIZES = ['small', 'medium', 'large'] as const;
type ValidSize = typeof VALID_SIZES[number];

const normalizeStyle = (s: string): ValidStyle => 
  VALID_STYLES.includes(s as ValidStyle) ? (s as ValidStyle) : 'heading';

const normalizeSize = (s: string): ValidSize =>
  VALID_SIZES.includes(s as ValidSize) ? (s as ValidSize) : 'medium';

const getSizeClass = (size: string) => {
  switch (normalizeSize(size)) {
    case 'small': return styles.sizeSmall;
    case 'large': return styles.sizeLarge;
    default: return styles.sizeMedium;
  }
};

export const StyledContent: React.FC<Partial<StyledContentProps>> = ({
  title = '',
  content = '',
  color = 'blue',
  size = 'medium',
  style: displayStyle = 'heading',
}) => {
  const colorValue = getColorValue(color || 'blue');
  const safeStyle = normalizeStyle(displayStyle);
  const glowColor = `${colorValue}66`;

  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.styledContent} ${styles[safeStyle]} ${getSizeClass(size)}`}
      style={{
        '--accent-color': colorValue,
        '--accent-glow': glowColor,
      } as React.CSSProperties}
      role="article"
      aria-label={title}
    >
      <div className="scanline" aria-hidden="true" />

      {safeStyle === 'banner' && (
        <div className={styles.bannerAccent} />
      )}

      <h2 className={styles.title}>{title}</h2>

      {safeStyle === 'quote' ? (
        <blockquote className={styles.quoteText}>"{content}"</blockquote>
      ) : safeStyle === 'highlight' ? (
        <div className={styles.highlightBox}>
          <p className={styles.contentText}>{content}</p>
        </div>
      ) : (
        <p className={styles.contentText}>{content}</p>
      )}
    </motion.div>
  );
};

export default StyledContent;
