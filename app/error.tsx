"use client";

import React, { useEffect } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

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
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        <AlertOctagon size={48} color="white" />
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
        System Malfunction
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
        Critical Error Detected
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          maxWidth: '400px',
          marginBottom: 'var(--space-lg)',
          lineHeight: 1.6,
        }}
      >
        The command center has encountered an unexpected error. 
        Our droids are analyzing the situation.
      </motion.p>

      {error.message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'rgba(255, 0, 60, 0.1)',
            border: '1px solid var(--empire-red)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm) var(--space-md)',
            marginBottom: 'var(--space-2xl)',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--empire-red)',
            maxWidth: '500px',
            wordBreak: 'break-word',
          }}
        >
          {error.message}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{
          display: 'flex',
          gap: 'var(--space-md)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={reset}
          className="galactic-btn galactic-btn-red"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
          }}
        >
          <RefreshCw size={16} />
          Attempt Recovery
        </button>

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
      </motion.div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
