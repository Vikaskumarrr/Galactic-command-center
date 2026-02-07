'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Fingerprint, Scan, Database } from 'lucide-react';
import styles from './SecuritySection.module.css';

/**
 * SecuritySection
 * Visualizes the "Hardened Security" aspect of the application.
 * Uses a central shield/lock metaphor with orbiting security protocols.
 */
export function SecuritySection() {
    return (
        <section className={styles.section} aria-label="Security Features">
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className={styles.badge}>End-to-End Encryption</div>
                    <h2 className={styles.title}>
                        Planetary-Grade <span className="text-gradient">Security</span>
                    </h2>
                    <p className={styles.description}>
                        Your fleet data is protected by quantum-resistant encryption protocols.
                        Not even the Empire can breach these shields.
                    </p>
                </motion.div>

                <div className={styles.visualization}>
                    {/* Central Shield/Lock */}
                    <motion.div
                        className={styles.shieldContainer}
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.shieldGlow} />
                        <div className={styles.shieldIcon}>
                            <Shield size={64} strokeWidth={1} />
                        </div>

                        {/* Orbiting Elements */}
                        <div className={styles.orbitTrack}>
                            <motion.div
                                className={styles.orbiter}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                <div className={styles.satelite}><Lock size={16} /></div>
                            </motion.div>
                        </div>
                        <div className={`${styles.orbitTrack} ${styles.orbitTrack2}`}>
                            <motion.div
                                className={styles.orbiter}
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            >
                                <div className={styles.satelite}><Fingerprint size={16} /></div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Feature Grid */}
                    <div className={styles.grid}>
                        <SecurityFeature
                            icon={<Lock />}
                            title="Quantum Encryption"
                            delay={0.1}
                        />
                        <SecurityFeature
                            icon={<Scan />}
                            title="Biometric Access"
                            delay={0.2}
                        />
                        <SecurityFeature
                            icon={<Database />}
                            title="Zero-Knowledge Storage"
                            delay={0.3}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function SecurityFeature({ icon, title, delay }: { icon: React.ReactNode, title: string, delay: number }) {
    return (
        <motion.div
            className={styles.featureCard}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay }}
        >
            <div className={styles.featureIcon}>{icon}</div>
            <span className={styles.featureTitle}>{title}</span>
        </motion.div>
    )
}
