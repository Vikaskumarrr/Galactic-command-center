"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from 'lucide-react';
import styles from './HyperdriveCalculator.module.css';
import { componentAnimationVariants } from '@/lib/theme';

interface KnownRoute {
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: string;
}

interface HyperdriveCalculatorProps {
  knownRoutes: KnownRoute[];
}

interface CalculationResult {
  origin: string;
  destination: string;
  distance: number;
  time: string;
}

export const HyperdriveCalculator: React.FC<Partial<HyperdriveCalculatorProps>> = ({ knownRoutes = [] }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const route = knownRoutes.find(
      r => 
        r.origin.toLowerCase() === origin.toLowerCase() &&
        r.destination.toLowerCase() === destination.toLowerCase()
    );

    if (route) {
      setShowAnimation(true);
      setTimeout(() => {
        setResult({
          origin: route.origin,
          destination: route.destination,
          distance: route.distance,
          time: route.estimatedTime,
        });
        setShowAnimation(false);
      }, 800);
    } else {
      setResult({
        origin,
        destination,
        distance: Math.floor(Math.random() * 1000) + 100,
        time: `${Math.floor(Math.random() * 48) + 1} hours`,
      });
    }
  };

  const handleQuickSelect = (route: KnownRoute) => {
    setOrigin(route.origin);
    setDestination(route.destination);
  };

  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.hyperdriveCalculator}`}
      role="region"
      aria-label="Hyperdrive route calculator"
    >
      <div className="scanline" aria-hidden="true" />
      <h2 className={styles.title}>
        <Navigation size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Hyperdrive Calculator
      </h2>

      <form className={styles.form} onSubmit={handleCalculate}>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="origin" className={styles.label}>Origin</label>
            <input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter origin planet"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="destination" className={styles.label}>Destination</label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className={styles.input}
              required
            />
          </div>
        </div>

        <button type="submit" className={`galactic-btn ${styles.calculateButton}`}>
          Calculate Route
        </button>
      </form>

      {/* Result Display */}
      <AnimatePresence>
        {(result || showAnimation) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.result}
          >
            {showAnimation && (
              <div className={styles.hyperspaceEffect} aria-hidden="true">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={styles.streak}
                    style={{
                      top: `${10 + i * 12}%`,
                      left: `${Math.random() * 20}%`,
                      width: `${60 + Math.random() * 40}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {result && !showAnimation && (
              <>
                <div className={styles.resultHeader}>
                  <span className={styles.resultLabel}>Route Calculated</span>
                  <span className={styles.resultRoute}>
                    {result.origin} → {result.destination}
                  </span>
                </div>
                <div className={styles.resultTime}>{result.time}</div>
                <div className={styles.resultDistance}>
                  Distance: {result.distance} parsecs
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Known Routes */}
      <div className={styles.routesList}>
        <div className={styles.routesTitle}>Known Hyperspace Routes</div>
        {knownRoutes.map((route, index) => (
          <div
            key={index}
            className={styles.routeItem}
            onClick={() => handleQuickSelect(route)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleQuickSelect(route);
              }
            }}
          >
            <span className={styles.routePath}>
              {route.origin} → {route.destination}
            </span>
            <span className={styles.routeTime}>{route.estimatedTime}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HyperdriveCalculator;
