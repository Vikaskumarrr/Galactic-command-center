"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Monitor, Bell, Shield, Cpu, Wifi, Volume2 } from 'lucide-react';
import { useDiagnostics } from '@/lib/useDiagnostics';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  onClose: () => void;
}

interface ToggleSetting {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  defaultOn: boolean;
}

const toggleSettings: ToggleSetting[] = [
  { id: 'holo-display', icon: Monitor, label: 'Holographic Display', description: 'Enable holographic grid overlay', defaultOn: true },
  { id: 'notifications', icon: Bell, label: 'Alert Notifications', description: 'Receive real-time system alerts', defaultOn: true },
  { id: 'shields-auto', icon: Shield, label: 'Auto Shield Recharge', description: 'Automatically recharge shields when low', defaultOn: false },
  { id: 'sound', icon: Volume2, label: 'Sound Effects', description: 'Enable UI sound effects', defaultOn: true },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const diagnostics = useDiagnostics();
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(toggleSettings.map(s => [s.id, s.defaultOn]))
  );

  const handleToggle = (id: string) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.panel}
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close settings">
          <X size={20} />
        </button>

        <h2 className={styles.title}>System Settings</h2>

        {/* System Status (live from diagnostics) */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Cpu size={14} /> System Status
          </h3>
          <div className={styles.statusGrid}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Hyperdrive</span>
              <div className={styles.statusBar}>
                <motion.div
                  className={styles.statusFill}
                  style={{ background: diagnostics.hyperdrive.value > 85 ? 'var(--jedi-green)' : 'var(--empire-red)' }}
                  animate={{ width: `${diagnostics.hyperdrive.value}%` }}
                />
              </div>
              <span className={styles.statusValue}>{Math.round(diagnostics.hyperdrive.value)}%</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Shields</span>
              <div className={styles.statusBar}>
                <motion.div
                  className={styles.statusFill}
                  style={{ background: diagnostics.shields.value > 60 ? 'var(--jedi-green)' : 'var(--empire-red)' }}
                  animate={{ width: `${diagnostics.shields.value}%` }}
                />
              </div>
              <span className={styles.statusValue}>{Math.round(diagnostics.shields.value)}%</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Power Core</span>
              <div className={styles.statusBar}>
                <motion.div
                  className={styles.statusFill}
                  style={{ background: diagnostics.powerCore.value > 70 ? 'var(--force-blue)' : 'var(--warning-yellow)' }}
                  animate={{ width: `${diagnostics.powerCore.value}%` }}
                />
              </div>
              <span className={styles.statusValue}>{Math.round(diagnostics.powerCore.value)}%</span>
            </div>
          </div>
        </div>

        {/* Toggle Settings */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Wifi size={14} /> Preferences
          </h3>
          {toggleSettings.map((setting, i) => (
            <motion.div
              key={setting.id}
              className={styles.toggleRow}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={styles.toggleInfo}>
                <setting.icon size={16} className={styles.toggleIcon} />
                <div>
                  <span className={styles.toggleLabel}>{setting.label}</span>
                  <span className={styles.toggleDesc}>{setting.description}</span>
                </div>
              </div>
              <button
                className={`${styles.toggle} ${toggles[setting.id] ? styles.toggleOn : ''}`}
                onClick={() => handleToggle(setting.id)}
                role="switch"
                aria-checked={toggles[setting.id]}
                aria-label={setting.label}
              >
                <span className={styles.toggleKnob} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* System Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>System Info</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Firmware</span>
              <span className={styles.infoValue}>v4.7.2-rebel</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Sector</span>
              <span className={styles.infoValue}>7-G Outer Rim</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Comm Freq</span>
              <span className={styles.infoValue}>138.42 GHz</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Uptime</span>
              <span className={styles.infoValue}>47d 12h 33m</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPanel;
