'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './RadarSection.module.css';

const RADAR_ITEMS = [
  { index: 1, active: true, dots: [6, 5, 4, 3, 2, 1] },
  { index: 2, active: false, dots: [7, 6, 5, 4, 3, 2] },
  { index: 3, active: false, dots: [8, 7, 6, 5, 4, 3] },
  { index: 4, active: true, dots: [9, 8, 7, 6, 5, 4] },
  { index: 5, active: true, dots: [10, 9, 8, 7, 6, 5] },
  { index: 6, active: true, dots: [11, 10, 9, 8, 7, 6] },
  { index: 7, active: true, dots: [12, 11, 10, 9, 8, 7] },
];

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

function useStarfield(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  const init = useCallback((canvas: HTMLCanvasElement) => {
    const count = 120;
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }
    starsRef.current = stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(canvas);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      for (const star of starsRef.current) {
        star.y -= star.speed;
        if (star.y < -2) {
          star.y = h + 2;
          star.x = Math.random() * w;
        }
        // Twinkle
        const flicker = Math.sin(Date.now() * 0.002 + star.x) * 0.2;
        ctx.globalAlpha = Math.max(0.05, star.opacity + flicker);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, init]);
}

export function RadarSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useStarfield(canvasRef);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className={styles.radarSection} role="region" aria-label="Research Radar">
      {/* Moving starfield background */}
      <canvas ref={canvasRef} className={styles.starfieldCanvas} aria-hidden="true" />

      {/* Gradient overlays */}
      <div className={styles.gradientOverlay} aria-hidden="true" />
      <div className={styles.gradientOrb1} aria-hidden="true" />
      <div className={styles.gradientOrb2} aria-hidden="true" />

      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className={styles.sectionTitle}>Galactic Radar</h2>
        <p className={styles.sectionSubtitle}>
          Scanning the galaxy for threats, allies, and opportunities in real time.
        </p>
      </motion.div>

      <div className={styles.radarContainer}>
        {/* Background rings */}
        <div className={styles.radarBackground} aria-hidden="true">
          <div className={styles.radarRing1} />
          <div className={styles.radarRing2} />
          <div className={styles.radarRing3} />
          <div className={styles.radarCrosshairH} />
          <div className={styles.radarCrosshairV} />
        </div>

        {/* Center logo / pulse */}
        <div className={styles.radarLogo} aria-hidden="true">
          <div className={styles.radarPulse} />
          <div className={styles.radarDot} />
        </div>

        {/* Scanner sweep */}
        <div className={`${styles.scannerWrapper} ${visible ? styles.scannerVisible : ''}`}>
          <div className={styles.scanner} />

          {/* Radar items (blips) */}
          <div className={styles.radarItems}>
            {RADAR_ITEMS.map((item) => (
              <div
                key={item.index}
                style={{ '--index': item.index } as React.CSSProperties}
                className={`${styles.radarItem} ${item.active ? styles.radarItemActive : ''}`}
              >
                {item.dots.map((dotIndex, i) => (
                  <div
                    key={i}
                    style={{ '--index': dotIndex } as React.CSSProperties}
                    className={styles.radarDotItem}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Edge fade */}
        <div className={styles.radarFader} aria-hidden="true" />
      </div>
    </div>
  );
}
