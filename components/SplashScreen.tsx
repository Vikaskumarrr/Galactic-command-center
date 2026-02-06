"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`${styles.splashScreen} ${isFadingOut ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <motion.div
          className={styles.logo}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Crosshair size={40} className={styles.logoIcon} />
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Galactic Command
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Initializing Command Center
        </motion.p>

        <motion.div
          className={styles.loadingContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          <div className={styles.loadingBar}>
            <div className={styles.loadingFill} />
          </div>
          <span className={styles.loadingText}>Establishing secure connection...</span>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
