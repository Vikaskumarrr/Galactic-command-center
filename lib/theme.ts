// ============================================
// GALACTIC COMMAND CENTER - THEME TYPES
// ============================================

// Color types
export type ThemeColor = 'force-blue' | 'empire-red' | 'jedi-green';

// Spacing scale types
export type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Component variant types
export type ComponentVariant = 'card' | 'list' | 'grid' | 'chart';

// Status types
export type StatusType = 'active' | 'alert' | 'warning' | 'inactive';

// Threat level types
export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

// Ship status types
export type ShipStatus = 'active' | 'repair' | 'combat';

// Mission status types
export type MissionStatus = 'completed' | 'in-progress' | 'pending';

// Priority types
export type Priority = 'low' | 'medium' | 'high';

// ============================================
// FRAMER MOTION ANIMATION VARIANTS
// ============================================

import type { Variants } from 'framer-motion';

export const componentAnimationVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1] // easeOut cubic bezier
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { 
      duration: 0.2 
    } 
  },
};

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 0.3 } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.2 } 
  },
};

export const scaleInVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1]
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { 
      duration: 0.2 
    } 
  },
};

export const slideInFromLeftVariants: Variants = {
  initial: { 
    opacity: 0, 
    x: -20 
  },
  animate: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1]
    } 
  },
  exit: { 
    opacity: 0, 
    x: -10, 
    transition: { 
      duration: 0.2 
    } 
  },
};

export const staggerContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 10 
  },
  animate: { 
    opacity: 1, 
    y: 0 
  },
};

// ============================================
// THEME UTILITIES
// ============================================

export const getStatusColor = (status: StatusType): string => {
  const colors: Record<StatusType, string> = {
    active: 'var(--jedi-green)',
    alert: 'var(--empire-red)',
    warning: '#ffc800',
    inactive: 'var(--text-dim)',
  };
  return colors[status];
};

export const getThreatColor = (level: ThreatLevel): string => {
  const colors: Record<ThreatLevel, string> = {
    low: 'var(--jedi-green)',
    medium: '#ffc800',
    high: 'var(--empire-red)',
    critical: 'var(--empire-red)',
  };
  return colors[level];
};

export const getThemeColorValue = (color: ThemeColor): string => {
  const colors: Record<ThemeColor, string> = {
    'force-blue': 'var(--force-blue)',
    'empire-red': 'var(--empire-red)',
    'jedi-green': 'var(--jedi-green)',
  };
  return colors[color];
};

// ============================================
// LAYOUT CONSTANTS
// ============================================

export const SIDEBAR_WIDTH_EXPANDED = 280;
export const SIDEBAR_WIDTH_COLLAPSED = 64;
export const HEADER_HEIGHT = 56;
export const MOBILE_BREAKPOINT = 768;

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  SIDEBAR_STATE: 'galactic-sidebar-state',
} as const;
