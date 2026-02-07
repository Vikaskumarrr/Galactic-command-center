'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
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

/**
 * CTASection renders the final call-to-action block before the footer.
 * It features a holographic title, subtitle, and one or two CTA buttons
 * with Framer Motion entrance animations.
 *
 * Requirements: 5.3 (multiple CTA buttons throughout the page),
 * 5.4 (CTA navigates user to main application)
 */
export function CTASection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: CTASectionProps) {
  return (
    <div className={styles.ctaSection} role="region" aria-labelledby="cta-heading">
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 id="cta-heading" className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.buttonGroup}>
          <Link
            href={primaryCta.href}
            className={styles.primaryButton}
            aria-label={primaryCta.text}
          >
            <Rocket size={16} aria-hidden="true" />
            {primaryCta.text}
          </Link>

          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={styles.secondaryButton}
              aria-label={secondaryCta.text}
            >
              {secondaryCta.text}
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
