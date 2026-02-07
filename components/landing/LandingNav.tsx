'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Rocket, Menu, X } from 'lucide-react';
import styles from './LandingNav.module.css';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const targetId = href.slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileOpen(false);
    },
    []
  );

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return (
    <>
      <nav className={styles.nav} aria-label="Landing page navigation">
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Galactic Command Center home">
          <span className={styles.logoIcon}>
            <Rocket size={18} />
          </span>
          <span className={styles.logoText}>Galactic Command</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className={styles.navLinks} role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={styles.navLink}
                onClick={(e) => handleSmoothScroll(e, item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link
          href="/command"
          className={`${styles.ctaButton} ${styles.ctaDesktop}`}
          aria-label="Launch the Galactic Command Center application"
        >
          <Rocket size={14} />
          Launch
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.menuToggle}
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-nav-menu"
        className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            className={styles.mobileNavLink}
            onClick={(e) => handleSmoothScroll(e, item.href)}
          >
            {item.label}
          </button>
        ))}
        <Link
          href="/command"
          className={`${styles.ctaButton} ${styles.mobileCta}`}
          aria-label="Launch the Galactic Command Center application"
          onClick={() => setMobileOpen(false)}
        >
          <Rocket size={16} />
          Launch
        </Link>
      </div>
    </>
  );
}
