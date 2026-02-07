'use client';

import { Zap, Layers, Terminal, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import styles from './FeaturesSection.module.css';

/**
 * Feature data for the landing page showcase.
 * Each feature maps to a Lucide icon and a galactic color theme.
 */
const LANDING_FEATURES = [
  {
    id: 'streaming',
    icon: <Zap size={24} />,
    title: 'Real-Time Streaming',
    description:
      'Watch data flow in real-time as AI generates responses, providing immediate feedback and transparency.',
  },
  {
    id: 'components',
    icon: <Layers size={24} />,
    title: 'Dynamic Components',
    description:
      'AI-powered UI components that adapt and render based on context and user needs.',
  },
  {
    id: 'command',
    icon: <Terminal size={24} />,
    title: 'Command Interface',
    description:
      'Natural language interface to control and query your galactic operations.',
  },
  {
    id: 'visualization',
    icon: <BarChart3 size={24} />,
    title: 'Data Visualization',
    description:
      'Beautiful, interactive visualizations for fleet status, missions, and galactic data.',
  },
] as const;

/** Stagger delay between each card animation (seconds). */
const STAGGER_DELAY = 0.15;

/**
 * FeaturesSection renders a responsive grid of FeatureCard components
 * showcasing the four key product capabilities.
 *
 * Cards animate into view with staggered timing as the user scrolls
 * to this section.
 *
 * Requirements: 3.1 (at least four features), 3.3 (staggered scroll animation)
 */
export function FeaturesSection() {
  return (
    <section className={styles.section} aria-label="Features">
      {/* Section heading */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className={styles.title}>Features</h2>
        <p className={styles.subtitle}>
          Everything you need to command the galaxy
        </p>
      </motion.div>

      {/* Feature cards grid */}
      <div className={styles.grid}>
        {LANDING_FEATURES.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * STAGGER_DELAY}
          />
        ))}
      </div>
    </section>
  );
}
