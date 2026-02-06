"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Rocket, 
  Globe, 
  Users, 
  Swords, 
  Navigation,
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (section: string) => void;
  activeSection?: string;
}

const navItems = [
  { icon: Rocket, label: 'Fleet Status', id: 'fleet', prompt: 'Show me the current fleet status with all active starships' },
  { icon: Globe, label: 'Planets', id: 'planets', prompt: 'Display information about key planets in the galaxy' },
  { icon: Users, label: 'Crew Roster', id: 'crew', prompt: 'Show me the crew roster with all team members' },
  { icon: Swords, label: 'Battle Status', id: 'battle', prompt: 'What is the current battle status and threat level?' },
  { icon: Navigation, label: 'Hyperdrive', id: 'hyperdrive', prompt: 'Calculate hyperspace routes between planets' },
];

// Simulated real-time diagnostics data
type DiagnosticStatus = 'Stable' | 'Warning' | 'Optimal' | 'Low';

interface DiagnosticData {
  value: number;
  status: DiagnosticStatus;
}

interface Diagnostics {
  hyperdrive: DiagnosticData;
  shields: DiagnosticData;
  powerCore: DiagnosticData;
}

const useDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<Diagnostics>({
    hyperdrive: { value: 92, status: 'Stable' },
    shields: { value: 45, status: 'Warning' },
    powerCore: { value: 78, status: 'Optimal' },
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDiagnostics(prev => {
        const newHyperdriveValue = Math.min(100, Math.max(80, prev.hyperdrive.value + (Math.random() - 0.5) * 4));
        const newShieldsValue = Math.min(100, Math.max(20, prev.shields.value + (Math.random() - 0.3) * 6));
        const newPowerCoreValue = Math.min(100, Math.max(60, prev.powerCore.value + (Math.random() - 0.5) * 3));
        
        return {
          hyperdrive: {
            value: newHyperdriveValue,
            status: newHyperdriveValue > 85 ? 'Stable' : 'Warning',
          },
          shields: {
            value: newShieldsValue,
            status: newShieldsValue > 60 ? 'Stable' : 'Warning',
          },
          powerCore: {
            value: newPowerCoreValue,
            status: newPowerCoreValue > 70 ? 'Optimal' : 'Low',
          },
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return diagnostics;
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose,
  onNavigate,
  activeSection = 'fleet'
}) => {
  const navRef = useRef<HTMLElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(activeSection);
  const diagnostics = useDiagnostics();

  // Announce sidebar state changes to screen readers
  useEffect(() => {
    if (announceRef.current) {
      announceRef.current.textContent = isOpen 
        ? 'Sidebar expanded' 
        : 'Sidebar collapsed';
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const items = navRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items) return;

    let nextIndex = index;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (index + 1) % items.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleNavClick(navItems[index].id, navItems[index].prompt);
        return;
      default:
        return;
    }

    (items[nextIndex] as HTMLElement).focus();
  };

  const handleNavClick = (id: string, prompt: string) => {
    setCurrentSection(id);
    onNavigate?.(id);
    
    // Dispatch custom event to trigger chat with the prompt
    const event = new CustomEvent('galactic-nav', { 
      detail: { section: id, prompt } 
    });
    window.dispatchEvent(event);
    
    // Close sidebar on mobile after navigation
    onClose();
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Stable':
      case 'Optimal':
        return styles.statusGreen;
      case 'Warning':
      case 'Low':
        return styles.statusRed;
      default:
        return styles.statusGreen;
    }
  };

  const getProgressClass = (status: string) => {
    switch (status) {
      case 'Stable':
        return styles.progressGreen;
      case 'Optimal':
        return styles.progressBlue;
      case 'Warning':
      case 'Low':
        return styles.progressRed;
      default:
        return styles.progressGreen;
    }
  };

  return (
    <motion.aside
      className={`${styles.sidebar} ${isOpen ? styles.sidebarExpanded : styles.sidebarCollapsed}`}
      initial={false}
      animate={{ width: isOpen ? 280 : 64 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Screen reader announcement region */}
      <div 
        ref={announceRef}
        className={styles.srOnly}
        aria-live="polite"
        aria-atomic="true"
      />

      <div className={styles.sidebarContent}>
        {/* Navigation Section */}
        <nav ref={navRef} className={styles.navSection} role="menu">
          <span className={styles.navLabel} id="nav-label">Navigation</span>
          {navItems.map((item, index) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${currentSection === item.id ? styles.navItemActive : ''}`}
              role="menuitem"
              aria-labelledby="nav-label"
              aria-current={currentSection === item.id ? 'page' : undefined}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => handleNavClick(item.id, item.prompt)}
            >
              <span className={styles.navIcon}>
                <item.icon size={18} />
              </span>
              <span className={styles.navText}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Diagnostics Section - Now with live data */}
        <div className={styles.diagnosticsSection}>
          <span className={styles.navLabel}>Diagnostics</span>
          
          <div className={styles.diagnosticCard}>
            <div className={styles.diagnosticHeader}>
              <span className={styles.diagnosticTitle}>Hyperdrive</span>
              <span className={`${styles.diagnosticStatus} ${getStatusClass(diagnostics.hyperdrive.status)}`}>
                {diagnostics.hyperdrive.status}
              </span>
            </div>
            <div className={styles.progressBar}>
              <motion.div 
                className={`${styles.progressFill} ${getProgressClass(diagnostics.hyperdrive.status)}`}
                initial={false}
                animate={{ width: `${diagnostics.hyperdrive.value}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className={styles.diagnosticValue}>{Math.round(diagnostics.hyperdrive.value)}%</span>
          </div>

          <div className={styles.diagnosticCard}>
            <div className={styles.diagnosticHeader}>
              <span className={styles.diagnosticTitle}>Shields</span>
              <span className={`${styles.diagnosticStatus} ${getStatusClass(diagnostics.shields.status)}`}>
                {diagnostics.shields.status}
              </span>
            </div>
            <div className={styles.progressBar}>
              <motion.div 
                className={`${styles.progressFill} ${getProgressClass(diagnostics.shields.status)}`}
                initial={false}
                animate={{ width: `${diagnostics.shields.value}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className={styles.diagnosticValue}>{Math.round(diagnostics.shields.value)}%</span>
          </div>

          <div className={styles.diagnosticCard}>
            <div className={styles.diagnosticHeader}>
              <span className={styles.diagnosticTitle}>Power Core</span>
              <span className={`${styles.diagnosticStatus} ${getStatusClass(diagnostics.powerCore.status)}`}>
                {diagnostics.powerCore.status}
              </span>
            </div>
            <div className={styles.progressBar}>
              <motion.div 
                className={`${styles.progressFill} ${getProgressClass(diagnostics.powerCore.status)}`}
                initial={false}
                animate={{ width: `${diagnostics.powerCore.value}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className={styles.diagnosticValue}>{Math.round(diagnostics.powerCore.value)}%</span>
          </div>
        </div>

        {/* Comms Link Section */}
        <div className={styles.commsSection}>
          <div className={styles.commsHeader}>
            <Terminal size={14} className={styles.commsIcon} />
            <span className={styles.commsTitle}>Comms Link</span>
          </div>
          <p className={styles.commsText}>
            Natural language processing active. Components will manifest based on intent.
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
