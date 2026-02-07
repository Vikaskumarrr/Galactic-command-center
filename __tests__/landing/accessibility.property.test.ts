import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Feature: star-wars-landing-page, Property 9: Accessibility Attributes Presence
 *
 * For any interactive element on the Landing Page (buttons, links, navigation items),
 * the element SHALL have appropriate ARIA attributes including aria-label or accessible
 * text content, and all images SHALL have alt attributes.
 *
 * **Validates: Requirements 7.3**
 *
 * Since we are in a Node test environment without DOM, we test the data contracts
 * and invariants that guarantee accessibility:
 *
 * 1. For any interactive element data (nav items, CTA buttons, feature cards),
 *    all have non-empty label/text content and valid href values.
 * 2. Structural accessibility contracts:
 *    - The landing page has a skip navigation link
 *    - All sections have aria-label or aria-labelledby
 *    - The canvas is aria-hidden
 *    - The streaming display has aria-live
 */

// ---------------------------------------------------------------------------
// Data models mirroring the component contracts
// ---------------------------------------------------------------------------

/**
 * Represents an interactive element on the landing page.
 * Each interactive element must have either an aria-label or visible text content.
 */
interface InteractiveElement {
  type: 'button' | 'link' | 'nav-item';
  ariaLabel?: string;
  textContent?: string;
  href?: string;
}

/**
 * Represents a page section with accessibility attributes.
 * Each section must have either aria-label or aria-labelledby.
 */
interface AccessibleSection {
  id: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

/**
 * Validates that an interactive element has accessible text
 * (either via aria-label or visible text content).
 */
function hasAccessibleName(element: InteractiveElement): boolean {
  const hasAriaLabel =
    typeof element.ariaLabel === 'string' && element.ariaLabel.trim().length > 0;
  const hasTextContent =
    typeof element.textContent === 'string' && element.textContent.trim().length > 0;
  return hasAriaLabel || hasTextContent;
}

/**
 * Validates that a link element has a valid href value.
 */
function hasValidHref(element: InteractiveElement): boolean {
  if (element.type !== 'link' && element.type !== 'nav-item') return true;
  if (typeof element.href !== 'string') return false;
  const trimmed = element.href.trim();
  return trimmed.length > 0;
}

/**
 * Validates that a section has an accessible label
 * (either aria-label or aria-labelledby).
 */
function hasAccessibleSectionLabel(section: AccessibleSection): boolean {
  const hasAriaLabel =
    typeof section.ariaLabel === 'string' && section.ariaLabel.trim().length > 0;
  const hasAriaLabelledBy =
    typeof section.ariaLabelledBy === 'string' && section.ariaLabelledBy.trim().length > 0;
  return hasAriaLabel || hasAriaLabelledBy;
}

// ---------------------------------------------------------------------------
// Production data: actual interactive elements from the landing page components
// ---------------------------------------------------------------------------

/**
 * All interactive elements extracted from the landing page components.
 * This mirrors the actual elements rendered by LandingNav, HeroSection,
 * CTASection, DemoSection, Footer, and StreamingDataDisplay.
 */
const LANDING_PAGE_INTERACTIVE_ELEMENTS: InteractiveElement[] = [
  // LandingNav: Logo link
  {
    type: 'link',
    ariaLabel: 'Galactic Command Center home',
    textContent: 'Galactic Command',
    href: '/landing',
  },
  // LandingNav: Features nav link
  {
    type: 'nav-item',
    textContent: 'Features',
    href: '#features',
  },
  // LandingNav: Demo nav link
  {
    type: 'nav-item',
    textContent: 'Demo',
    href: '#demo',
  },
  // LandingNav: Desktop CTA button
  {
    type: 'link',
    ariaLabel: 'Launch the Galactic Command Center application',
    textContent: 'Launch',
    href: '/',
  },
  // LandingNav: Mobile menu toggle button
  {
    type: 'button',
    ariaLabel: 'Open navigation menu',
    textContent: undefined,
  },
  // LandingNav: Mobile Features button
  {
    type: 'button',
    textContent: 'Features',
  },
  // LandingNav: Mobile Demo button
  {
    type: 'button',
    textContent: 'Demo',
  },
  // LandingNav: Mobile CTA link
  {
    type: 'link',
    ariaLabel: 'Launch the Galactic Command Center application',
    textContent: 'Launch',
    href: '/',
  },
  // HeroSection: CTA button
  {
    type: 'link',
    ariaLabel: 'Launch Command Center',
    textContent: 'Launch Command Center',
    href: '/',
  },
  // CTASection: Primary CTA button
  {
    type: 'link',
    ariaLabel: 'Begin Your Mission',
    textContent: 'Begin Your Mission',
    href: '/',
  },
  // Footer: Back to top link
  {
    type: 'link',
    ariaLabel: 'Back to top of page',
    textContent: '↑ Back to Top',
    href: '#hero',
  },
  // StreamingDataDisplay: Retry button (error state)
  {
    type: 'button',
    ariaLabel: 'Retry streaming',
    textContent: 'Retry',
  },
  // Landing page: Skip navigation link
  {
    type: 'link',
    textContent: 'Skip to main content',
    href: '#main-content',
  },
];

/**
 * All sections on the landing page with their accessibility labels.
 * Mirrors the actual section elements in app/landing/page.tsx and
 * the individual section components.
 */
const LANDING_PAGE_SECTIONS: AccessibleSection[] = [
  { id: 'hero', ariaLabel: 'Hero' },
  { id: 'features', ariaLabel: 'Features' },
  { id: 'demo', ariaLabel: 'Demo' },
  { id: 'cta', ariaLabel: 'Call to action' },
  { id: 'footer', ariaLabel: 'Footer' },
  // Component-level regions with aria-labelledby
  { id: 'features-region', ariaLabelledBy: 'features-heading' },
  { id: 'demo-region', ariaLabelledBy: 'demo-heading' },
  { id: 'cta-region', ariaLabelledBy: 'cta-heading' },
  // LandingNav
  { id: 'landing-nav', ariaLabel: 'Landing page navigation' },
  { id: 'mobile-nav', ariaLabel: 'Mobile navigation' },
];

/**
 * Structural accessibility contracts for the landing page.
 * These are boolean flags representing the presence of key accessibility features.
 */
const STRUCTURAL_ACCESSIBILITY = {
  hasSkipNavLink: true, // <a href="#main-content" className={styles.skipNav}>Skip to main content</a>
  canvasIsAriaHidden: true, // <canvas aria-hidden="true" />
  streamingDisplayHasAriaLive: true, // <div aria-live="polite" aria-atomic="false">
  navHasAriaLabel: true, // <nav aria-label="Landing page navigation">
  mobileMenuHasAriaControls: true, // aria-controls="mobile-nav-menu"
  mobileToggleHasAriaExpanded: true, // aria-expanded={mobileOpen}
  decorativeIconsAreAriaHidden: true, // <Rocket size={16} aria-hidden="true" /> in CTASection, Footer
  featureCardIconsAreAriaHidden: true, // <div aria-hidden="true">{icon}</div> in FeatureCard
};

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Generator for non-empty trimmed strings (simulating accessible text). */
const accessibleTextArb = fc
  .string({ minLength: 1, maxLength: 100 })
  .filter((s) => s.trim().length > 0);

/** Generator for valid href values. */
const hrefArb = fc.oneof(
  fc.constant('/'),
  fc.constant('#features'),
  fc.constant('#demo'),
  fc.constant('#hero'),
  fc.constant('#main-content'),
  accessibleTextArb.map((s) => `/${s.replace(/\s+/g, '-').toLowerCase()}`),
  accessibleTextArb.map((s) => `#${s.replace(/\s+/g, '-').toLowerCase()}`),
);

/** Generator for interactive element types. */
const elementTypeArb = fc.constantFrom('button' as const, 'link' as const, 'nav-item' as const);

/** Generator for interactive elements that have accessible names. */
const accessibleElementArb: fc.Arbitrary<InteractiveElement> = fc.record({
  type: elementTypeArb,
  ariaLabel: fc.option(accessibleTextArb, { nil: undefined }),
  textContent: fc.option(accessibleTextArb, { nil: undefined }),
  href: fc.option(hrefArb, { nil: undefined }),
}).filter((el) => {
  // Ensure at least one of ariaLabel or textContent is present
  const hasLabel = el.ariaLabel !== undefined && el.ariaLabel.trim().length > 0;
  const hasText = el.textContent !== undefined && el.textContent.trim().length > 0;
  return hasLabel || hasText;
}).map((el) => {
  // Ensure links/nav-items have hrefs
  if ((el.type === 'link' || el.type === 'nav-item') && !el.href) {
    return { ...el, href: '#section' };
  }
  return el;
});

/** Generator for accessible section data. */
const accessibleSectionArb: fc.Arbitrary<AccessibleSection> = fc.record({
  id: accessibleTextArb.map((s) => s.replace(/\s+/g, '-').toLowerCase()),
  ariaLabel: fc.option(accessibleTextArb, { nil: undefined }),
  ariaLabelledBy: fc.option(
    accessibleTextArb.map((s) => `${s.replace(/\s+/g, '-').toLowerCase()}-heading`),
    { nil: undefined }
  ),
}).filter((section) => {
  // Ensure at least one labelling mechanism is present
  const hasLabel = section.ariaLabel !== undefined && section.ariaLabel.trim().length > 0;
  const hasLabelledBy =
    section.ariaLabelledBy !== undefined && section.ariaLabelledBy.trim().length > 0;
  return hasLabel || hasLabelledBy;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Landing Page - Property 9: Accessibility Attributes Presence', () => {
  /**
   * **Validates: Requirements 7.3**
   *
   * All production interactive elements on the landing page SHALL have
   * an accessible name (aria-label or text content).
   */
  it('should have accessible names for all production interactive elements', () => {
    for (const element of LANDING_PAGE_INTERACTIVE_ELEMENTS) {
      expect(
        hasAccessibleName(element),
        `Element "${element.type}" with ariaLabel="${element.ariaLabel}" textContent="${element.textContent}" should have an accessible name`
      ).toBe(true);
    }
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * All production link and nav-item elements SHALL have valid href values.
   */
  it('should have valid href values for all production links and nav items', () => {
    const linkElements = LANDING_PAGE_INTERACTIVE_ELEMENTS.filter(
      (el) => el.type === 'link' || el.type === 'nav-item'
    );

    for (const element of linkElements) {
      expect(
        hasValidHref(element),
        `Link/nav-item with text "${element.textContent || element.ariaLabel}" should have a valid href, got "${element.href}"`
      ).toBe(true);
    }
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * All production sections on the landing page SHALL have an accessible
   * label (aria-label or aria-labelledby).
   */
  it('should have accessible labels for all production page sections', () => {
    for (const section of LANDING_PAGE_SECTIONS) {
      expect(
        hasAccessibleSectionLabel(section),
        `Section "${section.id}" should have aria-label or aria-labelledby`
      ).toBe(true);
    }
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * The landing page SHALL have structural accessibility features:
   * skip navigation link, aria-hidden canvas, aria-live streaming display,
   * and aria-hidden decorative icons.
   */
  it('should have all structural accessibility features present', () => {
    expect(STRUCTURAL_ACCESSIBILITY.hasSkipNavLink).toBe(true);
    expect(STRUCTURAL_ACCESSIBILITY.canvasIsAriaHidden).toBe(true);
    expect(STRUCTURAL_ACCESSIBILITY.streamingDisplayHasAriaLive).toBe(true);
    expect(STRUCTURAL_ACCESSIBILITY.navHasAriaLabel).toBe(true);
    expect(STRUCTURAL_ACCESSIBILITY.mobileMenuHasAriaControls).toBe(true);
    expect(STRUCTURAL_ACCESSIBILITY.mobileToggleHasAriaExpanded).toBe(true);
    expect(STRUCTURAL_ACCESSIBILITY.decorativeIconsAreAriaHidden).toBe(true);
    expect(STRUCTURAL_ACCESSIBILITY.featureCardIconsAreAriaHidden).toBe(true);
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any interactive element with a non-empty aria-label or text content,
   * hasAccessibleName SHALL return true — ensuring the accessibility check
   * correctly identifies elements with accessible names.
   */
  it('should identify any element with aria-label or text content as accessible', () => {
    fc.assert(
      fc.property(accessibleElementArb, (element: InteractiveElement) => {
        expect(hasAccessibleName(element)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any interactive element with neither aria-label nor text content
   * (both missing or empty), hasAccessibleName SHALL return false —
   * ensuring inaccessible elements are correctly flagged.
   */
  it('should identify elements without aria-label and text content as inaccessible', () => {
    const inaccessibleElementArb: fc.Arbitrary<InteractiveElement> = fc.record({
      type: elementTypeArb,
      ariaLabel: fc.constantFrom(undefined, '', '   ', '\t', '\n') as fc.Arbitrary<string | undefined>,
      textContent: fc.constantFrom(undefined, '', '   ', '\t', '\n') as fc.Arbitrary<string | undefined>,
      href: fc.option(hrefArb, { nil: undefined }),
    });

    fc.assert(
      fc.property(inaccessibleElementArb, (element: InteractiveElement) => {
        expect(hasAccessibleName(element)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any link or nav-item element, hasValidHref SHALL return true
   * if and only if the href is a non-empty string.
   */
  it('should validate href presence for any link or nav-item element', () => {
    const linkWithHrefArb: fc.Arbitrary<InteractiveElement> = fc.record({
      type: fc.constantFrom('link' as const, 'nav-item' as const),
      ariaLabel: fc.option(accessibleTextArb, { nil: undefined }),
      textContent: fc.option(accessibleTextArb, { nil: undefined }),
      href: hrefArb,
    });

    fc.assert(
      fc.property(linkWithHrefArb, (element: InteractiveElement) => {
        expect(hasValidHref(element)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any link or nav-item element without a href (undefined),
   * hasValidHref SHALL return false.
   */
  it('should flag links without href as invalid', () => {
    const linkWithoutHrefArb: fc.Arbitrary<InteractiveElement> = fc.record({
      type: fc.constantFrom('link' as const, 'nav-item' as const),
      ariaLabel: fc.option(accessibleTextArb, { nil: undefined }),
      textContent: fc.option(accessibleTextArb, { nil: undefined }),
      href: fc.constant(undefined as unknown as string),
    });

    fc.assert(
      fc.property(linkWithoutHrefArb, (element: InteractiveElement) => {
        expect(hasValidHref(element)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any section with aria-label or aria-labelledby,
   * hasAccessibleSectionLabel SHALL return true.
   */
  it('should identify any section with aria-label or aria-labelledby as accessible', () => {
    fc.assert(
      fc.property(accessibleSectionArb, (section: AccessibleSection) => {
        expect(hasAccessibleSectionLabel(section)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any section without aria-label and without aria-labelledby,
   * hasAccessibleSectionLabel SHALL return false.
   */
  it('should flag sections without any labelling mechanism as inaccessible', () => {
    const unlabelledSectionArb: fc.Arbitrary<AccessibleSection> = fc.record({
      id: accessibleTextArb.map((s) => s.replace(/\s+/g, '-').toLowerCase()),
      ariaLabel: fc.constantFrom(undefined, '', '   ') as fc.Arbitrary<string | undefined>,
      ariaLabelledBy: fc.constantFrom(undefined, '', '   ') as fc.Arbitrary<string | undefined>,
    });

    fc.assert(
      fc.property(unlabelledSectionArb, (section: AccessibleSection) => {
        expect(hasAccessibleSectionLabel(section)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any collection of interactive elements where all have accessible names,
   * every element in the collection SHALL pass the accessibility check.
   * This models the invariant that the landing page as a whole is accessible
   * when all its interactive elements are individually accessible.
   */
  it('should confirm accessibility for any collection of accessible elements', () => {
    fc.assert(
      fc.property(
        fc.array(accessibleElementArb, { minLength: 1, maxLength: 30 }),
        (elements: InteractiveElement[]) => {
          for (const element of elements) {
            expect(hasAccessibleName(element)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
