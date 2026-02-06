"use client";

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      background: 'var(--galactic-bg)',
      textAlign: 'center',
    }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'var(--empire-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-xl)',
          boxShadow: '0 0 40px var(--empire-red-glow)',
        }}
      >
        <AlertTriangle size={48} color="white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: 'var(--text-2xl)',
          color: 'var(--empire-red)',
          textShadow: '0 0 15px var(--empire-red-glow)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-md)',
        }}
      >
        Lost in Hyperspace
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--text-dim)',
          marginBottom: 'var(--space-sm)',
        }}
      >
        Error 404 - Sector Not Found
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          maxWidth: '400px',
          marginBottom: 'var(--space-2xl)',
          lineHeight: 1.6,
        }}
      >
        The coordinates you entered do not match any known location in our galactic database. 
        Your navigation computer may have malfunctioned.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          display: 'flex',
          gap: 'var(--space-md)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link
          href="/"
          className="galactic-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            textDecoration: 'none',
          }}
        >
          <Home size={16} />
          Return to Command Center
        </Link>

        <button
          onClick={() => window.history.back()}
          className="galactic-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
          }}
        >
          <Navigation size={16} />
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
