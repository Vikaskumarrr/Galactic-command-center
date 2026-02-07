'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Rocket, Menu, X } from 'lucide-react';
import styles from './LandingNav.module.css';

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    },
    []
  );

  return (
    <>
      <div className={styles.navOuter}>
        <nav
          className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
          aria-label="Landing page navigation"
        >
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Galactic Command Center home">
            <span className={styles.logoIcon}><Rocket size={18} /></span>
            <span className={styles.logoText}>Galactic Command</span>
          </Link>

          {/* Right side: links + CTA */}
          <div className={styles.navRight}>
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
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

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
          onClick={() => setMobileOpen(false)}
        >
          <Rocket size={16} />
          Launch Command Center
        </Link>
      </div>
    </>
  );
}
