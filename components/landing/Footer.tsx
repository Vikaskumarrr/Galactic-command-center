import { Rocket } from 'lucide-react';
import styles from './Footer.module.css';

/**
 * Footer renders the landing page footer with branding, copyright,
 * and a back-to-top link. This is a server component — no client
 * interactivity is required.
 *
 * Requirements: 6.1 (existing color palette)
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.footer}>
      <div className={styles.content}>
        {/* Branding */}
        <div className={styles.branding}>
          <span className={styles.brandIcon} aria-hidden="true">
            <Rocket size={16} />
          </span>
          <span className={styles.brandText}>Galactic Command Center</span>
        </div>

        {/* Copyright */}
        <p className={styles.copyright}>
          © {currentYear} Galactic Command Center. All rights reserved.
        </p>

        {/* Back to top */}
        <a
          href="#hero"
          className={styles.backToTop}
          aria-label="Back to top of page"
        >
          ↑ Back to Top
        </a>
      </div>
    </div>
  );
}
