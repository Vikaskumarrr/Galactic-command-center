'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateStars } from '@/lib/blackHoleHero';
import styles from './CTASection.module.css';

export interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
}

export function CTASection({ title, subtitle, primaryCta }: CTASectionProps) {
  const stars = useMemo(() => generateStars(60), []);

  return (
    <div className={styles.ctaSection} role="region" aria-labelledby="cta-heading">
      {/* Header content */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.badge}>
          <span className={styles.badgeText}>Get started</span>
        </div>
        <h2 id="cta-heading" className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <Link href={primaryCta.href} className={styles.primaryButton}>
          {primaryCta.text}
        </Link>
      </motion.div>

      {/* Black hole visual */}
      <div className={styles.blackHoleWrap} aria-hidden="true">
        <div className={styles.blackHoleCenter}>
          <div className={styles.ringOuter} />
          <div className={styles.ringInner} />
          <div className={styles.accretionDisk} />
          <div className={styles.core} />
          <div className={styles.photonRing} />
        </div>
        <div className={styles.lightStreak} />
        <div className={styles.starsField}>
          {stars.map((star) => (
            <div key={star.id} className={styles.star} style={{
              top: star.top, left: star.left,
              width: `${star.size}px`, height: `${star.size}px`,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
