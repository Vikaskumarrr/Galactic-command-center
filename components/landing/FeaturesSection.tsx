'use client';

import { motion } from 'framer-motion';
import { Zap, Layers, Terminal, BarChart3 } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import styles from './FeaturesSection.module.css';

/**
 * Feature data matching the design spec's LANDING_FEATURES constant.
 * Each feature maps to a Lucide icon and a galactic color variant.
 */
const FEATURES = [
  {
    id: 'streaming',
    icon: <Zap size={24} />,
    title: 'Real-Time Streaming',
    description:
      'Watch data flow in real-time as AI generates responses, providing immediate feedback and transparency.',
    colorVariant: 'force-blue' as const,
  },
  {
    id: 'components',
    icon: <Layers size={24} />,
    title: 'Dynamic Components',
    description:
      'AI-powered UI components that adapt and render based on context and user needs.',
    colorVariant: 'jedi-green' as const,
  },
  {
    id: 'command',
    icon: <Terminal size={24} />,
    title: 'Command Interface',
    description:
      'Natural language interface to control and query your galactic operations.',
    colorVariant: 'force-blue' as const,
  },
  {
    id: 'visualization',
    icon: <BarChart3 size={24} />,
    title: 'Data Visualization',
    description:
      'Beautiful, interactive visualizations for fleet status, missions, and galactic data.',
    colorVariant: 'empire-red' as const,
  },
] as const;

/** Stagger delay (seconds) between each card's entrance animation. */
const STAGGER_DELAY = 0.15;

/**
 * FeaturesSection renders a responsive grid of FeatureCard components
 * showcasing the four key product capabilities. Cards animate into view
 * with staggered timing as the user scrolls to this section.
 *
 * Requirements: 3.1 (at least four features), 3.3 (staggered animation on scroll)
 */
export function FeaturesSection() {
  return (
    <div className={styles.featuresSection} role="region" aria-labelledby="features-heading">
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2 id="features-heading" className={styles.sectionTitle}>Galactic Capabilities</h2>
        <p className={styles.sectionSubtitle}>
          Harness the power of the Force with cutting-edge tools designed for
          commanding your galactic operations.
        </p>
      </motion.div>

      <div className={styles.featureGrid} role="list">
        {FEATURES.map((feature, index) => (
          <div key={feature.id} role="listitem">
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              colorVariant={feature.colorVariant}
              delay={index * STAGGER_DELAY}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
