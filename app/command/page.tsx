"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { GalacticChat } from '@/components/GalacticChat';
import { SplashScreen } from '@/components/SplashScreen';
import { Starfield } from '@/components/Starfield';
import { STORAGE_KEYS, MOBILE_BREAKPOINT } from '@/lib/theme';
import styles from './page.module.css';

export default function CommandPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const savedState = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
    if (savedState !== null) {
      setIsSidebarOpen(JSON.parse(savedState));
    } else if (window.innerWidth < MOBILE_BREAKPOINT) {
      setIsSidebarOpen(false);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, isHydrated]);

  const handleToggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const handleCloseSidebar = () => { if (isMobile) setIsSidebarOpen(false); };

  if (!isHydrated) {
    return (
      <div className={styles.appShell}>
        <div className={styles.header} />
        <div className={styles.sidebar} />
        <main className={styles.mainContent} />
      </div>
    );
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className={`${styles.appShell} ${!isSidebarOpen ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.header}>
        <Header onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>
      <div className={`${styles.sidebar} ${isMobile && isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      </div>
      {isMobile && (
        <div
          className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.visible : ''}`}
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}
      <main className={styles.mainContent} role="main" aria-label="Main content">
        <Starfield className={styles.starfield} />
        <div className={styles.holoOverlay} aria-hidden="true" />
        <div className={styles.mainContentInner}>
          <div className={styles.chatContainer}>
            <GalacticChat welcomeMessage="Welcome, Commander. The Force is strong with this UI. What tactical data do you require?" />
          </div>
        </div>
      </main>
    </div>
  );
}
