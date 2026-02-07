'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './StreamingDataDisplay.module.css';

export interface StreamingDataDisplayProps {
  endpoint?: string;
  mockData?: string[];
  typingSpeed?: number; // characters per second, default 50
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface StreamingState {
  content: string;
  isStreaming: boolean;
  error: Error | null;
  progress: number;
}

/**
 * Pure function that concatenates all stream chunks into a single content string.
 * Used by property tests to verify content integrity.
 */
export function processStreamChunks(chunks: string[]): { content: string } {
  return { content: chunks.join('') };
}

/**
 * StreamingDataDisplay renders data progressively as it arrives,
 * simulating a real-time streaming experience with a typing effect.
 *
 * When `mockData` is provided, it simulates streaming by processing
 * chunks one at a time, then typing out each chunk character by character.
 */
export function StreamingDataDisplay({
  endpoint,
  mockData,
  typingSpeed = 50,
  onComplete,
  onError,
}: StreamingDataDisplayProps) {
  const [state, setState] = useState<StreamingState>({
    content: '',
    isStreaming: false,
    error: null,
    progress: 0,
  });

  // Refs for managing the typing animation
  const targetContentRef = useRef<string>('');
  const displayedLengthRef = useRef<number>(0);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chunkIndexRef = useRef<number>(0);
  const chunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  // Keep callback refs in sync
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  /**
   * Type out characters one at a time from targetContentRef
   * until displayedLengthRef catches up.
   */
  const typeNextCharacter = useCallback(() => {
    const target = targetContentRef.current;
    const currentLen = displayedLengthRef.current;

    if (currentLen < target.length) {
      displayedLengthRef.current = currentLen + 1;
      const newContent = target.slice(0, displayedLengthRef.current);

      setState((prev) => ({
        ...prev,
        content: newContent,
      }));

      // Schedule next character
      const delay = 1000 / typingSpeed;
      typingTimerRef.current = setTimeout(typeNextCharacter, delay);
    }
  }, [typingSpeed]);

  /**
   * Process the next chunk from mockData.
   * Appends the chunk to targetContentRef and starts typing it out.
   */
  const processNextChunk = useCallback(() => {
    if (!mockData) return;

    const idx = chunkIndexRef.current;

    if (idx >= mockData.length) {
      // All chunks processed — wait for typing to finish, then complete
      const waitForTyping = () => {
        if (displayedLengthRef.current >= targetContentRef.current.length) {
          setState((prev) => ({
            ...prev,
            isStreaming: false,
            progress: 1,
          }));
          onCompleteRef.current?.();
        } else {
          setTimeout(waitForTyping, 50);
        }
      };
      waitForTyping();
      return;
    }

    // Append the next chunk to the target content
    targetContentRef.current += mockData[idx];
    chunkIndexRef.current = idx + 1;

    // Update progress
    const progress = chunkIndexRef.current / mockData.length;
    setState((prev) => ({
      ...prev,
      progress,
    }));

    // Start typing if not already typing
    if (typingTimerRef.current === null) {
      typeNextCharacter();
    }

    // Schedule next chunk with a small delay
    const chunkDelay = 100;
    chunkTimerRef.current = setTimeout(processNextChunk, chunkDelay);
  }, [mockData, typeNextCharacter]);

  /**
   * Start the streaming simulation with mockData.
   */
  const startMockStreaming = useCallback(() => {
    // Reset state
    targetContentRef.current = '';
    displayedLengthRef.current = 0;
    chunkIndexRef.current = 0;

    setState({
      content: '',
      isStreaming: true,
      error: null,
      progress: 0,
    });

    // Start processing chunks
    processNextChunk();
  }, [processNextChunk]);

  /**
   * Clean up all timers on unmount.
   */
  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      if (chunkTimerRef.current !== null) {
        clearTimeout(chunkTimerRef.current);
        chunkTimerRef.current = null;
      }
    };
  }, []);

  /**
   * Start streaming when mockData is provided.
   */
  useEffect(() => {
    if (mockData && mockData.length > 0) {
      startMockStreaming();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockData]);

  /**
   * Auto-scroll to bottom when new content is added.
   */
  useEffect(() => {
    if (contentContainerRef.current) {
      const container = contentContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [state.content]);

  // Error state
  if (state.error) {
    return (
      <div className={styles.container} role="alert">
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠</span>
          <p className={styles.errorMessage}>{state.error.message}</p>
          <button
            className={styles.retryButton}
            onClick={startMockStreaming}
            aria-label="Retry streaming"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} aria-label="Streaming data display">
      <div
        ref={contentContainerRef}
        className={styles.contentArea}
        aria-live="polite"
        aria-atomic="false"
      >
        {state.content && (
          <span className={styles.streamedText}>{state.content}</span>
        )}
        {state.isStreaming && (
          <span className={styles.cursor} aria-hidden="true">
            ▌
          </span>
        )}
      </div>

      {state.isStreaming && (
        <div className={styles.loadingIndicator} aria-label="Loading more data">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      )}
    </div>
  );
}
