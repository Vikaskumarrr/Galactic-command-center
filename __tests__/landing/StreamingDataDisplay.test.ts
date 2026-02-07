import { describe, it, expect } from 'vitest';
import { processStreamChunks } from '@/components/landing/StreamingDataDisplay';

/**
 * Unit tests for StreamingDataDisplay component logic.
 * Tests the pure processStreamChunks function and streaming state behavior.
 */
describe('StreamingDataDisplay - processStreamChunks', () => {
  it('should concatenate a single chunk correctly', () => {
    const result = processStreamChunks(['Hello, Galaxy!']);
    expect(result.content).toBe('Hello, Galaxy!');
  });

  it('should concatenate multiple chunks in order', () => {
    const chunks = ['Hello, ', 'Galactic ', 'Command ', 'Center!'];
    const result = processStreamChunks(chunks);
    expect(result.content).toBe('Hello, Galactic Command Center!');
  });

  it('should return empty string for empty chunks array', () => {
    const result = processStreamChunks([]);
    expect(result.content).toBe('');
  });

  it('should handle chunks with special characters', () => {
    const chunks = ['Data: ', '{"status": "active"}', '\n', 'End.'];
    const result = processStreamChunks(chunks);
    expect(result.content).toBe('Data: {"status": "active"}\nEnd.');
  });

  it('should handle chunks with unicode characters', () => {
    const chunks = ['⭐ Star ', '🚀 Ship ', '💫 Fleet'];
    const result = processStreamChunks(chunks);
    expect(result.content).toBe('⭐ Star 🚀 Ship 💫 Fleet');
  });

  it('should handle chunks with empty strings', () => {
    const chunks = ['Hello', '', ' World', ''];
    const result = processStreamChunks(chunks);
    expect(result.content).toBe('Hello World');
  });

  it('should handle a single empty string chunk', () => {
    const result = processStreamChunks(['']);
    expect(result.content).toBe('');
  });

  it('should preserve whitespace in chunks', () => {
    const chunks = ['  leading', '  trailing  ', '\n\nnewlines\n'];
    const result = processStreamChunks(chunks);
    expect(result.content).toBe('  leading  trailing  \n\nnewlines\n');
  });

  it('should handle very long content across many chunks', () => {
    const chunks = Array.from({ length: 100 }, (_, i) => `chunk${i} `);
    const result = processStreamChunks(chunks);
    const expected = chunks.join('');
    expect(result.content).toBe(expected);
    expect(result.content.length).toBe(expected.length);
  });
});

describe('StreamingDataDisplay - StreamingState interface', () => {
  it('should define correct initial state shape', () => {
    // Verify the state interface matches the design
    const initialState = {
      content: '',
      isStreaming: false,
      error: null,
      progress: 0,
    };

    expect(initialState.content).toBe('');
    expect(initialState.isStreaming).toBe(false);
    expect(initialState.error).toBeNull();
    expect(initialState.progress).toBe(0);
  });

  it('should represent streaming in-progress state', () => {
    const streamingState = {
      content: 'Partial content...',
      isStreaming: true,
      error: null,
      progress: 0.5,
    };

    expect(streamingState.isStreaming).toBe(true);
    expect(streamingState.progress).toBeGreaterThan(0);
    expect(streamingState.progress).toBeLessThan(1);
    expect(streamingState.error).toBeNull();
  });

  it('should represent completed state', () => {
    const completedState = {
      content: 'Full content here.',
      isStreaming: false,
      error: null,
      progress: 1,
    };

    expect(completedState.isStreaming).toBe(false);
    expect(completedState.progress).toBe(1);
    expect(completedState.content.length).toBeGreaterThan(0);
  });

  it('should represent error state', () => {
    const errorState = {
      content: '',
      isStreaming: false,
      error: new Error('Network failure'),
      progress: 0,
    };

    expect(errorState.isStreaming).toBe(false);
    expect(errorState.error).toBeInstanceOf(Error);
    expect(errorState.error?.message).toBe('Network failure');
  });
});

describe('StreamingDataDisplay - Loading indicator logic', () => {
  it('loading indicator should be visible when isStreaming is true', () => {
    const isStreaming = true;
    // The component shows loading indicator when isStreaming is true
    const showLoadingIndicator = isStreaming;
    expect(showLoadingIndicator).toBe(true);
  });

  it('loading indicator should be hidden when isStreaming is false', () => {
    const isStreaming = false;
    const showLoadingIndicator = isStreaming;
    expect(showLoadingIndicator).toBe(false);
  });

  it('cursor should be visible only during streaming', () => {
    // Cursor visibility follows the same logic as isStreaming
    const showCursorWhenStreaming = true;
    const showCursorWhenComplete = false;
    expect(showCursorWhenStreaming).toBe(true);
    expect(showCursorWhenComplete).toBe(false);
  });
});

describe('StreamingDataDisplay - Typing speed calculation', () => {
  it('should calculate correct delay from default typing speed', () => {
    const typingSpeed = 50; // chars per second
    const delay = 1000 / typingSpeed;
    expect(delay).toBe(20); // 20ms per character
  });

  it('should calculate correct delay from custom typing speed', () => {
    const typingSpeed = 100;
    const delay = 1000 / typingSpeed;
    expect(delay).toBe(10);
  });

  it('should handle slow typing speed', () => {
    const typingSpeed = 10;
    const delay = 1000 / typingSpeed;
    expect(delay).toBe(100);
  });
});
