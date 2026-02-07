'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Layers, Terminal, BarChart3 } from 'lucide-react';
import styles from './FeaturesSection.module.css';

const FEATURES = [
  {
    id: 'streaming',
    icon: <Zap size={28} />,
    title: 'Real-Time Streaming',
    description:
      'Watch data flow in real-time as AI generates responses, providing immediate feedback and transparency across your galactic network.',
    color: '#4a8eff',
    glow: 'rgba(74, 142, 255, 0.4)',
    dim: 'rgba(74, 142, 255, 0.12)',
    gradient: 'linear-gradient(135deg, rgba(74, 142, 255, 0.15), rgba(74, 142, 255, 0.03))',
  },
  {
    id: 'components',
    icon: <Layers size={28} />,
    title: 'Dynamic Components',
    description:
      'AI-powered UI components that adapt and render based on context and user needs, evolving with every interaction.',
    color: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.4)',
    dim: 'rgba(0, 255, 136, 0.12)',
    gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 255, 136, 0.03))',
  },
  {
    id: 'command',
    icon: <Terminal size={28} />,
    title: 'Command Interface',
    description:
      'Natural language interface to control and query your galactic operations — speak your commands and watch them execute.',
    color: '#4a8eff',
    glow: 'rgba(74, 142, 255, 0.4)',
    dim: 'rgba(74, 142, 255, 0.12)',
    gradient: 'linear-gradient(135deg, rgba(74, 142, 255, 0.15), rgba(74, 142, 255, 0.03))',
  },
  {
    id: 'visualization',
    icon: <BarChart3 size={28} />,
    title: 'Data Visualization',
    description:
      'Beautiful, interactive visualizations for fleet status, missions, and galactic data — see the universe in stunning clarity.',
    color: '#ff003c',
    glow: 'rgba(255, 0, 60, 0.4)',
    dim: 'rgba(255, 0, 60, 0.12)',
    gradient: 'linear-gradient(135deg, rgba(255, 0, 60, 0.15), rgba(255, 0, 60, 0.03))',
  },
] as const;

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? feature.color : undefined,
      }}
    >
      {/* Glow effect on hover */}
      <div
        className={styles.cardGlow}
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.glow}, transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Top accent line */}
      <div
        className={styles.accentLine}
        style={{
          background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Number badge */}
      <span className={styles.numberBadge} style={{ color: feature.dim }}>
        0{index + 1}
      </span>

      {/* Icon */}
      <div
        className={styles.iconWrap}
        style={{
          background: feature.dim,
          color: feature.color,
          boxShadow: isHovered ? `0 0 24px ${feature.glow}` : 'none',
        }}
      >
        {feature.icon}
      </div>

      {/* Text */}
      <h3 className={styles.cardTitle} style={{ color: feature.color }}>
        {feature.title}
      </h3>
      <p className={styles.cardDescription}>{feature.description}</p>

      {/* Bottom gradient bar */}
      <div
        className={styles.bottomBar}
        style={{ background: feature.gradient }}
      />
    </motion.div>
  );
}

export function FeaturesSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  // Track mouse position for glow effect
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = grid.querySelectorAll(`.${styles.card}`) as NodeListOf<HTMLElement>;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    grid.addEventListener('mousemove', handleMouseMove);
    return () => grid.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.featuresSection} role="region" aria-labelledby="features-heading">
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2 id="features-heading" className={styles.sectionTitle}>
          Galactic Capabilities
        </h2>
        <p className={styles.sectionSubtitle}>
          Harness the power of the Force with cutting-edge tools designed for
          commanding your galactic operations.
        </p>
      </motion.div>

      <div className={styles.featureGrid} ref={gridRef} role="list">
        {FEATURES.map((feature, index) => (
          <div key={feature.id} role="listitem">
            <FeatureCard feature={feature} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
