'use client';

import styles from './page.module.css';
import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { DemoSection } from '@/components/landing/DemoSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/* ============================================
   Section Fallback Components
   Galactic-themed graceful error messages displayed
   when a section fails to render.
   ============================================ */

const sectionFallbackStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  padding: '3rem 1.5rem',
  textAlign: 'center',
  background: 'rgba(10, 14, 23, 0.85)',
  border: '1px solid rgba(255, 0, 60, 0.3)',
  borderRadius: '12px',
  margin: '1rem',
};

const fallbackTitleStyle: React.CSSProperties = {
  color: 'var(--empire-red, #ff003c)',
  fontSize: '1.25rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '0.75rem',
};

const fallbackMessageStyle: React.CSSProperties = {
  color: 'var(--text-dim, #8899aa)',
  fontSize: '0.9rem',
  lineHeight: 1.6,
  maxWidth: '480px',
};

function HeroFallback() {
  return (
    <div style={{ ...sectionFallbackStyle, minHeight: '60vh' }} role="alert" aria-label="Hero section error">
      <p style={fallbackTitleStyle}>⚠ Holographic Display Offline</p>
      <p style={fallbackMessageStyle}>
        The space battle visualization could not be initialized. The starfield remains calm… for now.
      </p>
    </div>
  );
}

function FeaturesFallback() {
  return (
    <div style={sectionFallbackStyle} role="alert" aria-label="Features section error">
      <p style={fallbackTitleStyle}>⚠ Databank Unavailable</p>
      <p style={fallbackMessageStyle}>
        Feature intelligence could not be retrieved from the galactic archives. Please try again later.
      </p>
    </div>
  );
}

function DemoFallback() {
  return (
    <div style={sectionFallbackStyle} role="alert" aria-label="Demo section error">
      <p style={fallbackTitleStyle}>⚠ Transmission Interrupted</p>
      <p style={fallbackMessageStyle}>
        The streaming data demonstration encountered an anomaly. The signal has been lost.
      </p>
    </div>
  );
}

function CTAFallback() {
  return (
    <div style={sectionFallbackStyle} role="alert" aria-label="Call to action section error">
      <p style={fallbackTitleStyle}>⚠ Navigation Systems Offline</p>
      <p style={fallbackMessageStyle}>
        Unable to plot a course to the Command Center. Please navigate manually to the main application.
      </p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      {/* Skip navigation link — visually hidden, focusable for keyboard/screen reader users */}
      <a href="#main-content" className={styles.skipNav}>
        Skip to main content
      </a>

      {/* Fixed Navigation */}
      <LandingNav />

      {/* Main content area */}
      <main id="main-content">
        {/* Hero Section - Animated Space Battle */}
        <div id="hero" className={`${styles.section} ${styles.heroSection}`}>
          <ErrorBoundary fallback={<HeroFallback />}>
            <HeroSection
              title="Galactic Command Center"
              subtitle="Command your fleet, monitor galactic operations, and harness AI-powered intelligence — all from a single holographic interface."
              ctaText="Launch Command Center"
              ctaHref="/command"
            />
          </ErrorBoundary>
        </div>

        {/* Features Section */}
        <section
          id="features"
          className={`${styles.section} ${styles.featuresSection}`}
          aria-label="Features"
        >
          <ErrorBoundary fallback={<FeaturesFallback />}>
            <FeaturesSection />
          </ErrorBoundary>
        </section>

        {/* Demo Section - Streaming Data Visualization */}
        <section
          id="demo"
          className={`${styles.section} ${styles.demoSection}`}
          aria-label="Demo"
        >
          <ErrorBoundary fallback={<DemoFallback />}>
            <DemoSection
              title="See It In Action"
              description="Experience the power of real-time streaming data as the Galactic Command Center processes intelligence from across the galaxy."
            />
          </ErrorBoundary>
        </section>

        {/* Call to Action Section */}
        <section
          id="launch"
          className={`${styles.section} ${styles.ctaSection}`}
          aria-label="Call to action"
        >
          <ErrorBoundary fallback={<CTAFallback />}>
            <CTASection
              title="Ready to Command the Galaxy?"
              subtitle="Join the Galactic Command Center and take control of your fleet operations with cutting-edge AI technology."
              primaryCta={{
                text: 'Launch Command Center',
                href: '/command',
              }}
              secondaryCta={{
                text: 'Learn More',
                href: '#features',
              }}
            />
          </ErrorBoundary>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`${styles.section} ${styles.footerSection}`}
        aria-label="Footer"
      >
        <Footer />
      </footer>
    </div>
  );
}
