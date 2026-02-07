"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crosshair, Menu, X, Bell, User, Settings, LogOut, Shield, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiagnosticNotifications } from '@/lib/useDiagnostics';
import { ProfilePanel } from '@/components/ProfilePanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import styles from './Header.module.css';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Live notifications derived from shared diagnostics
  const liveNotifications = useDiagnosticNotifications();
  const notifications = liveNotifications.filter(n => !dismissedIds.has(n.id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDismissNotification = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  const handleClearAll = () => {
    setDismissedIds(new Set(liveNotifications.map(n => n.id)));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return <Shield size={14} className={styles.notifIconAlert} />;
      case 'warning': return <AlertTriangle size={14} className={styles.notifIconWarning} />;
      default: return <Info size={14} className={styles.notifIconInfo} />;
    }
  };

  const handleSignOut = () => {
    setShowProfile(false);
    router.push('/landing');
  };

  return (
    <>
      <header className={styles.header} role="banner">
        <div className={styles.leftSection}>
          <button
            className={styles.toggleButton}
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className={styles.branding}>
            <div className={styles.logoIcon}>
              <Crosshair color="white" size={18} />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Galactic Command</span>
              <span className={styles.brandSubtitle}>Sector 7-G • System Active</span>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          {/* Notifications */}
          <div className={styles.dropdownContainer} ref={notifRef}>
            <button
              className={styles.notificationButton}
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className={styles.notificationBadge} aria-label={`${notifications.length} notifications`}>
                  {notifications.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className={styles.dropdownHeader}>
                    <span>Transmissions</span>
                    {notifications.length > 0 && (
                      <button className={styles.clearAllBtn} onClick={handleClearAll}>
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className={styles.dropdownContent}>
                    {notifications.length === 0 ? (
                      <div className={styles.emptyState}>No new transmissions</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={styles.notificationItem}>
                          <div className={styles.notifIcon}>{getNotificationIcon(notif.type)}</div>
                          <div className={styles.notifContent}>
                            <span className={styles.notifTitle}>{notif.title}</span>
                            <span className={styles.notifMessage}>{notif.message}</span>
                            <span className={styles.notifTime}>{notif.time}</span>
                          </div>
                          <button
                            className={styles.dismissBtn}
                            onClick={() => handleDismissNotification(notif.id)}
                            aria-label="Dismiss notification"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className={styles.dropdownContainer} ref={profileRef}>
            <button
              className={styles.userAvatar}
              aria-label="User profile"
              aria-expanded={showProfile}
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
            >
              <img
                src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=commander&backgroundColor=0a0b1e"
                alt=""
                className={styles.avatarImg}
              />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className={styles.profileHeader}>
                    <div className={styles.profileAvatar}>
                      <img
                        src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=commander&backgroundColor=0a0b1e"
                        alt="Commander avatar"
                        className={styles.profileAvatarImg}
                      />
                    </div>
                    <div className={styles.profileInfo}>
                      <span className={styles.profileName}>Commander</span>
                      <span className={styles.profileRole}>Rebel Alliance</span>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <div className={styles.dropdownContent}>
                    <button
                      className={styles.menuItem}
                      onClick={() => { setShowProfile(false); setShowProfilePanel(true); }}
                    >
                      <User size={16} />
                      <span>View Profile</span>
                    </button>
                    <button
                      className={styles.menuItem}
                      onClick={() => { setShowProfile(false); setShowSettingsPanel(true); }}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <div className={styles.dropdownDivider} />
                    <button
                      className={`${styles.menuItem} ${styles.menuItemDanger}`}
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Panels */}
      <AnimatePresence>
        {showProfilePanel && <ProfilePanel onClose={() => setShowProfilePanel(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showSettingsPanel && <SettingsPanel onClose={() => setShowSettingsPanel(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Header;
