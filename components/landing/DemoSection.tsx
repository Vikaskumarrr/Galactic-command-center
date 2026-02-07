'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { StreamingDataDisplay } from './StreamingDataDisplay';
import styles from './DemoSection.module.css';

export interface DemoSectionProps {
  title: string;
  description: string;
}

/**
 * Star Wars-themed mock data chunks that simulate a streaming AI response.
 * Each chunk is delivered sequentially to the StreamingDataDisplay.
 */
const DEMO_MOCK_DATA: string[] = [
  '> Initiating Galactic Command Center...\n\n',
  '⚡ Scanning sector 7-G for rebel activity...\n',
  'Fleet Status: 12 Star Destroyers online.\n',
  '3 X-Wing squadrons detected near Endor.\n\n',
  '📡 Hyperspace routes calculated:\n',
  '  • Coruscant → Tatooine: 4.2 parsecs\n',
  '  • Hoth → Dagobah: 6.8 parsecs\n',
  '  • Naboo → Mustafar: 3.1 parsecs\n\n',
  '🛡️ Shield generators at 98% capacity.\n',
  'All systems operational. Awaiting orders, Commander.',
];

/**
 * DemoSection showcases the StreamingDataDisplay component in action.
 * It uses an Intersection Observer to detect when the section scrolls
 * into view and triggers the streaming demo automatically.
 *
 * Requirements: 4.1 (demo section with streaming visualization),
 * 4.2 (demonstrate real-time data rendering when visible),
 * 4.3 (explanatory text describing what the user is seeing)
 */
export function DemoSection({ title, description }: DemoSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [mockData, setMockData] = useState<string[] | undefined>(undefined);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer: detect when section enters the viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Start the demo once the section becomes visible (only once)
  useEffect(() => {
    if (isVisible && !demoStarted) {
      setDemoStarted(true);
      setMockData(DEMO_MOCK_DATA);
    }
  }, [isVisible, demoStarted]);

  return (
    <div ref={sectionRef} className={styles.demoSection} role="region" aria-labelledby="demo-heading">
      {/* Section header */}
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2 id="demo-heading" className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{description}</p>
      </motion.div>

      {/* Two-column layout: explanatory text + streaming display */}
      <div className={styles.demoContainer}>
        {/* Explanatory text panel */}
        <motion.div
          className={styles.explanatoryPanel}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <h3 className={styles.explanatoryTitle}>
            Real-Time Intelligence Streaming
          </h3>
          <p className={styles.explanatoryText}>
            Watch as the Galactic Command Center processes and streams data in
            real time. Each piece of intelligence arrives as it becomes
            available — no waiting for the full transmission.
          </p>
          <ul className={styles.featureList} aria-label="Demo features">
            <li className={styles.featureItem}>
              <span className={styles.featureBullet} aria-hidden="true">◆</span>
              Incremental data rendering as chunks arrive
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureBullet} aria-hidden="true">◆</span>
              Visual typing effect for immersive experience
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureBullet} aria-hidden="true">◆</span>
              Live progress indicators during transmission
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureBullet} aria-hidden="true">◆</span>
              Automatic error recovery and retry capability
            </li>
          </ul>
        </motion.div>

        {/* Streaming display with terminal chrome */}
        <motion.div
          className={styles.streamingWrapper}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
        >
          <div className={styles.terminalHeader} aria-hidden="true">
            <span className={styles.terminalDot} />
            <span className={styles.terminalDot} />
            <span className={styles.terminalDot} />
            <span className={styles.terminalTitle}>Galactic Data Stream</span>
          </div>
          <StreamingDataDisplay
            mockData={mockData}
            typingSpeed={40}
          />
        </motion.div>
      </div>
    </div>
  );
}
