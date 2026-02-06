"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="galactic-card"
          style={{
            border: '1px solid var(--empire-red)',
            boxShadow: '0 0 15px var(--empire-red-glow)',
          }}
          role="alert"
          aria-live="assertive"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <AlertTriangle size={24} color="var(--empire-red)" />
            <h3 style={{ 
              color: 'var(--empire-red)', 
              fontSize: 'var(--text-lg)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            }}>
              System Malfunction
            </h3>
          </div>
          
          <p style={{ 
            color: 'var(--text-dim)', 
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-md)',
            lineHeight: 1.5,
          }}>
            A critical error has occurred in this sector. The technical readout indicates:
          </p>
          
          <div style={{
            background: 'rgba(255, 0, 60, 0.1)',
            border: '1px solid var(--empire-red)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm) var(--space-md)',
            marginBottom: 'var(--space-lg)',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--empire-red)',
            wordBreak: 'break-word',
          }}>
            {this.state.error?.message || 'Unknown error'}
          </div>
          
          <button
            onClick={this.handleRetry}
            className="galactic-btn galactic-btn-red"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}
          >
            <RefreshCw size={16} />
            Attempt Recovery
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
