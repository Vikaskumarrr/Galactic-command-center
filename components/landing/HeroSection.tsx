'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars';
import styles from './HeroSection.module.css';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6.5C9 6.327 8.86 6.188 8.688 6.188C7.652 6.188 6.813 5.348 6.813 4.313C6.813 4.14 6.673 4 6.5 4C6.327 4 6.188 4.14 6.188 4.313C6.188 5.348 5.348 6.188 4.313 6.188C4.14 6.188 4 6.327 4 6.5C4 6.673 4.14 6.813 4.313 6.813C5.348 6.813 6.188 7.652 6.188 8.688C6.188 8.86 6.327 9 6.5 9C6.673 9 6.813 8.86 6.813 8.688C6.813 7.652 7.652 6.813 8.688 6.813C8.86 6.813 9 6.673 9 6.5Z" fill="url(#sg1)" />
      <path d="M16.5 6C16.5 5.724 16.276 5.5 16 5.5C15.724 5.5 15.5 5.724 15.5 6C15.5 8.485 13.485 10.5 11 10.5C10.724 10.5 10.5 10.724 10.5 11C10.5 11.276 10.724 11.5 11 11.5C13.485 11.5 15.5 13.514 15.5 16C15.5 16.276 15.724 16.5 16 16.5C16.276 16.5 16.5 16.276 16.5 16C16.5 13.514 18.514 11.5 21 11.5C21.276 11.5 21.5 11.276 21.5 11C21.5 10.724 21.276 10.5 21 10.5C18.514 10.5 16.5 8.485 16.5 6Z" fill="url(#sg2)" />
      <path d="M7.5 12.5C7.5 12.224 7.276 12 7 12C6.724 12 6.5 12.224 6.5 12.5C6.5 14.157 5.157 15.5 3.5 15.5C3.224 15.5 3 15.724 3 16C3 16.276 3.224 16.5 3.5 16.5C5.157 16.5 6.5 17.843 6.5 19.5C6.5 19.776 6.724 20 7 20C7.276 20 7.5 19.776 7.5 19.5C7.5 17.843 8.843 16.5 10.5 16.5C10.776 16.5 11 16.276 11 16C11 15.724 10.776 15.5 10.5 15.5C8.843 15.5 7.5 14.157 7.5 12.5Z" fill="url(#sg3)" />
      <defs>
        <linearGradient id="sg1" x1="3" y1="20" x2="21.5" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E59CFF" /><stop offset="0.5" stopColor="#BA9CFF" /><stop offset="1" stopColor="#9CB2FF" />
        </linearGradient>
        <linearGradient id="sg2" x1="3" y1="20" x2="21.5" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E59CFF" /><stop offset="0.5" stopColor="#BA9CFF" /><stop offset="1" stopColor="#9CB2FF" />
        </linearGradient>
        <linearGradient id="sg3" x1="3" y1="20" x2="21.5" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E59CFF" /><stop offset="0.5" stopColor="#BA9CFF" /><stop offset="1" stopColor="#9CB2FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroSection({ title, subtitle, ctaText, ctaHref }: HeroSectionProps) {
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Interactive gravity stars background */}
      <GravityStarsBackground
        starsCount={100}
        starsSize={2}
        starsOpacity={0.7}
        glowIntensity={15}
        glowAnimation="ease"
        movementSpeed={0.3}
        mouseInfluence={120}
        mouseGravity="attract"
        gravityStrength={80}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          color: '#ffffff',
        }}
      />

      <div className={styles.heroContent}>
        <motion.a href="#features" className={styles.heroBadge}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>
          <SparkleIcon />
          <span className={styles.heroBadgeText}>AI-Powered Galactic Operations</span>
        </motion.a>
        <motion.h1 className={styles.heroTitle}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}>
          {title}
        </motion.h1>
        <motion.p className={styles.heroDescription}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}>
          {subtitle}
        </motion.p>
      </div>

      {/* Hero Screenshot */}
      <motion.div className={styles.heroScreenshot}
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1], delay: 0.4 }}>
        <div className={styles.screenshotWrapper}>
          <Image
            src="/Galactic-Command-Center-UI-Strikes-Back-02-07-2026_11_39_PM.png"
            alt="Galactic Command Center dashboard showing planet data, fleet diagnostics, and AI-powered chat"
            width={1024}
            height={768}
            className={styles.screenshotImage}
            priority
          />
          <div className={styles.screenshotGlow} aria-hidden="true" />
        </div>
        <div className={styles.screenshotCta}>
          <Link href={ctaHref} className={styles.launchButton}>{ctaText}</Link>
        </div>
      </motion.div>
    </section>
  );
}
