import { Rocket } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.footer}>
      {/* Top accent line */}
      <div className={styles.accentLine} aria-hidden="true" />

      <div className={styles.content}>
        {/* Branding */}
        <div className={styles.branding}>
          <span className={styles.brandIcon} aria-hidden="true">
            <Rocket size={18} />
          </span>
          <span className={styles.brandText}>Galactic Command</span>
        </div>

        {/* Center links */}
        <nav className={styles.footerLinks} aria-label="Footer navigation">
          <a href="#features" className={styles.footerLink}>Features</a>
          <a href="#demo" className={styles.footerLink}>Demo</a>
          <a href="/command" className={styles.footerLink}>Command Center</a>
        </nav>

        {/* Back to top */}
        <a href="#hero" className={styles.backToTop} aria-label="Back to top of page">
          ↑ Top
        </a>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Bottom row */}
      <div className={styles.bottomRow}>
        <p className={styles.copyright}>
          © {currentYear} Galactic Command Center. All rights reserved.
        </p>
      </div>
    </div>
  );
}
