'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { generateStars } from '@/lib/blackHoleHero';
import styles from './HeroSection.module.css';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 6.5C9 6.327 8.86 6.188 8.688 6.188C7.652 6.188 6.813 5.348 6.813 4.313C6.813 4.14 6.673 4 6.5 4C6.327 4 6.188 4.14 6.188 4.313C6.188 5.348 5.348 6.188 4.313 6.188C4.14 6.188 4 6.327 4 6.5C4 6.673 4.14 6.813 4.313 6.813C5.348 6.813 6.188 7.652 6.188 8.688C6.188 8.86 6.327 9 6.5 9C6.673 9 6.813 8.86 6.813 8.688C6.813 7.652 7.652 6.813 8.688 6.813C8.86 6.813 9 6.673 9 6.5Z" fill="url(#sparkleGrad1)" />
      <path d="M16.5 6C16.5 5.724 16.276 5.5 16 5.5C15.724 5.5 15.5 5.724 15.5 6C15.5 8.485 13.485 10.5 11 10.5C10.724 10.5 10.5 10.724 10.5 11C10.5 11.276 10.724 11.5 11 11.5C13.485 11.5 15.5 13.514 15.5 16C15.5 16.276 15.724 16.5 16 16.5C16.276 16.5 16.5 16.276 16.5 16C16.5 13.514 18.514 11.5 21 11.5C21.276 11.5 21.5 11.276 21.5 11C21.5 10.724 21.276 10.5 21 10.5C18.514 10.5 16.5 8.485 16.5 6Z" fill="url(#sparkleGrad2)" />
      <path d="M7.5 12.5C7.5 12.224 7.276 12 7 12C6.724 12 6.5 12.224 6.5 12.5C6.5 14.157 5.157 15.5 3.5 15.5C3.224 15.5 3 15.724 3 16C3 16.276 3.224 16.5 3.5 16.5C5.157 16.5 6.5 17.843 6.5 19.5C6.5 19.776 6.724 20 7 20C7.276 20 7.5 19.776 7.5 19.5C7.5 17.843 8.843 16.5 10.5 16.5C10.776 16.5 11 16.276 11 16C11 15.724 10.776 15.5 10.5 15.5C8.843 15.5 7.5 14.157 7.5 12.5Z" fill="url(#sparkleGrad3)" />
      <defs>
        <linearGradient id="sparkleGrad1" x1="3" y1="20" x2="21.5" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E59CFF" /><stop offset="0.5" stopColor="#BA9CFF" /><stop stopColor="#9CB2FF" offset="1" />
        </linearGradient>
        <linearGradient id="sparkleGrad2" x1="3" y1="20" x2="21.5" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E59CFF" /><stop offset="0.5" stopColor="#BA9CFF" /><stop stopColor="#9CB2FF" offset="1" />
        </linearGradient>
        <linearGradient id="sparkleGrad3" x1="3" y1="20" x2="21.5" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E59CFF" /><stop offset="0.5" stopColor="#BA9CFF" /><stop stopColor="#9CB2FF" offset="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroSection({ title, subtitle, ctaText, ctaHref }: HeroSectionProps) {
  const stars = useMemo(() => generateStars(100), []);

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Floating star particles */}
      <div className={styles.starsField} aria-hidden="true">
        {stars.map((star) => (
          <div
            key={star.id}
            className={styles.star}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Hero text content */}
      <div className={styles.heroContent}>
        <motion.a
          href="#features"
          className={styles.heroBadge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <SparkleIcon />
          <span className={styles.heroBadgeText}>Take notes using AI</span>
        </motion.a>

        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className={styles.heroDescription}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Pure CSS animated black hole */}
      <div className={styles.blackHoleWrap} aria-hidden="true">
        <div className={styles.blackHoleCenter}>
          <div className={styles.ringOuter} />
          <div className={styles.ringInner} />
          <div className={styles.accretionDisk} />
          <div className={styles.core} />
          <div className={styles.photonRing} />
        </div>
        <div className={styles.lightStreak} />
      </div>

      {/* Video preview card with Launch CTA */}
      <motion.div
        className={styles.heroVideo}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1], delay: 0.4 }}
      >
        <div className={styles.heroVideoContent}>
          <div className={styles.heroVideoPreview}>
            <div className={styles.appMockup}>
              <div className={styles.mockupSidebar}>
                <div className={styles.mockupSearch}>
                  <span className={styles.mockupSearchIcon}>⌕</span>
                  <span className={styles.mockupSearchText}>Search anything...</span>
                  <span className={styles.mockupSearchShortcut}>⌘K</span>
                </div>
                <div className={styles.mockupNavItems}>
                  <div className={`${styles.mockupNavItem} ${styles.mockupNavActive}`}>
                    <span>📝</span> Daily notes
                  </div>
                  <div className={styles.mockupNavItem}><span>📄</span> All notes</div>
                  <div className={styles.mockupNavItem}><span>✅</span> Tasks</div>
                  <div className={styles.mockupNavItem}><span>🗺️</span> Map</div>
                </div>
              </div>
              <div className={styles.mockupMain}>
                <div className={styles.mockupDate}>Sun, April 2nd, 2023</div>
                <div className={styles.mockupNotes}>
                  <div className={styles.mockupNote}>Today I started using Reflect</div>
                  <div className={styles.mockupNote}>What is Reflect?</div>
                  <div className={styles.mockupNoteSub}>A note-taking tool designed to mirror the way we think</div>
                </div>
              </div>
              <div className={styles.mockupCalendar}>
                <div className={styles.mockupCalendarHeader}>April 2023</div>
                <div className={styles.mockupCalendarGrid}>
                  {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
                    <span key={d} className={styles.mockupCalendarDay}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Overlay with Launch button + play */}
        <div className={styles.heroVideoOverlay}>
          <Link href={ctaHref} className={styles.launchButton}>
            {ctaText}
          </Link>
          <button className={styles.heroVideoPlay} aria-label="Play demo video">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17.9 10.257C19.26 11.022 19.26 12.979 17.9 13.743L7.98 19.324C6.647 20.073 5 19.11 5 17.58V6.42C5 4.89 6.647 3.927 7.98 4.677L17.9 10.257Z" fill="white" />
            </svg>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
