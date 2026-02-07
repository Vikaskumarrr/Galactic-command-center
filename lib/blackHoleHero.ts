/**
 * Black Hole Hero — utility types, constants, and functions
 * for the CSS-driven black hole hero section animation.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrbitRingConfig {
  radius: number;
  duration: number;
  dotCount: number;
  direction: 'normal' | 'reverse';
}

export interface StarParticle {
  id: number;
  top: string;
  left: string;
  size: number;
  animationDuration: string;
  animationDelay: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const STAR_COUNT_DEFAULT = 80;

export const ORBIT_RINGS: OrbitRingConfig[] = [
  { radius: 120, duration: 20, dotCount: 8, direction: 'normal' },
  { radius: 200, duration: 30, dotCount: 8, direction: 'reverse' },
  { radius: 280, duration: 40, dotCount: 8, direction: 'normal' },
];

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Generate an array of star particles with deterministic, index-based
 * positioning so the output is identical on server and client (SSR-safe).
 */
export function generateStars(count: number): StarParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${(i * 37 + 13) % 100}%`,
    left: `${(i * 53 + 7) % 100}%`,
    size: (i % 3) + 1,
    animationDuration: `${10 + (i % 20)}s`,
    animationDelay: `${-(i % 10)}s`,
  }));
}

/**
 * Calculate the angle (in degrees) for a dot at the given index
 * when `total` dots are evenly distributed around a ring.
 */
export function calculateDotAngle(index: number, total: number): number {
  return index * (360 / total);
}
