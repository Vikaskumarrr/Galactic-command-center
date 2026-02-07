'use client';

import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { DemoSection } from '@/components/landing/DemoSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { NetworkBackground } from '@/components/landing/NetworkBackground';
import { ErrorBoundary } from '@/components/ErrorBoundary'; // Assuming this exists or I should create a simple one
import styles from './page.module.css';

// Simple Fallback Component
function SectionFallback({ name }: { name: string }) {
  return (
    <div style={{
      padding: '4rem',
      textAlign: 'center',
      color: 'var(--text-secondary)',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      margin: '2rem 0',
      border: '1px solid var(--glass-border)'
    }}>
      <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>{name} Unavailable</h3>
      <p>System diagnostics running...</p>
    </div>
  );
}

// Simple ErrorBoundary wrapper if the original one is complex or missing interactions
// But I will use the imported one.

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      <LandingNav />

      {/* Global Background Layer if we want it to persist across scroll but 
          HeroSection has its own. We can put another one here for lower sections
          or just rely on the body background. 
          Let's leave unique backgrounds for sections to distinguish them behaviorally.
      */}

      <main id="main-content">
        <section id="hero">
          <ErrorBoundary fallback={<SectionFallback name="Hero" />}>
            <HeroSection
              title="Command your fleet"
              subtitle="The next-generation command interface for your galactic operations. AI-powered, secure, and ready for hyperspace."
              ctaText="Start Free Trial"
              ctaHref="/command"
            />
          </ErrorBoundary>
        </section>

        <section id="features" aria-label="Features">
          <ErrorBoundary fallback={<SectionFallback name="Features" />}>
            <FeaturesSection />
          </ErrorBoundary>
        </section>

        <section id="security" aria-label="Security">
          <ErrorBoundary fallback={<SectionFallback name="Security" />}>
            <SecuritySection />
          </ErrorBoundary>
        </section>

        <section id="demo" aria-label="Demo">
          <ErrorBoundary fallback={<SectionFallback name="Demo" />}>
            <DemoSection
              title="See Intelligence in Action"
              description="Watch how the neural engine processes fleet data in real-time."
            />
          </ErrorBoundary>
        </section>

        <section id="launch" aria-label="Ready to Launch">
          <ErrorBoundary fallback={<SectionFallback name="CTA" />}>
            <CTASection
              title="Ready to Launch?"
              subtitle="Join thousands of commanders using Galactic Command to manage their fleets."
              primaryCta={{ text: 'Get Started', href: '/command' }}
              secondaryCta={{ text: 'Read the Docs', href: '#features' }}
            />
          </ErrorBoundary>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
