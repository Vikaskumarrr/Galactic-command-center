'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import styles from './FeatureCard.module.css';

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
  colorVariant?: 'force-blue' | 'jedi-green' | 'empire-red';
}

/**
 * FeatureCard renders an individual feature with an icon, title, and
 * description inside a glassmorphism-styled card. Uses Framer Motion
 * whileInView for scroll-triggered entrance animation with a
 * configurable delay for staggered effects.
 *
 * Requirements: 3.2 (icon, title, description), 3.3 (staggered animation),
 * 3.4 (galactic design system / glassmorphism)
 */
export function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
  colorVariant = 'force-blue',
}: FeatureCardProps) {
  const variantClass =
    colorVariant === 'force-blue'
      ? styles.forceBlue
      : colorVariant === 'jedi-green'
        ? styles.jediGreen
        : styles.empireRed;

  return (
    <motion.article
      className={`${styles.featureCard} ${variantClass}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        delay,
      }}
      aria-label={title}
    >
      <div className={styles.scanline} />

      <div className={`${styles.iconContainer} ${variantClass}`} aria-hidden="true">
        {icon}
      </div>

      <h3 className={styles.title}>{title}</h3>

      <p className={styles.description}>{description}</p>
    </motion.article>
  );
}
