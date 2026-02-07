'use client';

import { motion } from 'framer-motion';
import { SpaceBattleCanvas } from './SpaceBattleCanvas';
import styles from './HeroSection.module.css';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

/**
 * HeroSection composes the SpaceBattleCanvas as a full-screen animated
 * background with a glassmorphism content overlay containing the page
 * title, subtitle, and primary call-to-action button.
 *
 * Requirements: 1.6 (Star Wars typography + glow), 1.7 (subtitle),
 * 1.8 (primary CTA button)
 */
export function HeroSection({ title, subtitle, ctaText, ctaHref }: HeroSectionProps) {
  return (
    <section className={styles.heroSection} aria-label="Hero">
      {/* Background layer: animated space battle */}
      <div className={styles.canvasBackground}>
        <SpaceBattleCanvas shipCount={10} />
      </div>

      {/* Content overlay */}
      <motion.div
        className={styles.contentOverlay}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      >
        <div className={styles.glassPanel}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
          >
            {subtitle}
          </motion.p>

          <motion.a
            href={ctaHref}
            className={styles.ctaButton}
            aria-label={ctaText}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {ctaText}
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
