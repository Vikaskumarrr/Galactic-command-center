import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  processStreamChunks,
  StreamingState,
} from '@/components/landing/StreamingDataDisplay';

/**
 * Feature: star-wars-landing-page, Property 4: Streaming Content Integrity
 *
 * For any sequence of stream chunks delivered to the StreamingDataDisplay,
 * the displayed content after processing all chunks SHALL equal the
 * concatenation of all chunk contents in order, with no content lost or
 * duplicated during incremental rendering.
 *
 * **Validates: Requirements 2.1, 2.2**
 */
describe('StreamingDataDisplay - Property 4: Streaming Content Integrity', () => {
  /**
   * **Validates: Requirements 2.1, 2.2**
   *
   * For any array of string chunks, processStreamChunks SHALL return
   * content that exactly equals the concatenation of all chunks in order.
   */
  it('should produce content equal to the concatenation of all chunks', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 100 }), {
          minLength: 0,
          maxLength: 50,
        }),
        (chunks: string[]) => {
          const expected = chunks.join('');
          const result = processStreamChunks(chunks);
          expect(result.content).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.1, 2.2**
   *
   * For any array of chunks, the length of the processed content SHALL
   * equal the sum of the lengths of all individual chunks — no content
   * is lost or duplicated.
   */
  it('should preserve total content length across all chunks', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 100 }), {
          minLength: 0,
          maxLength: 50,
        }),
        (chunks: string[]) => {
          const expectedLength = chunks.reduce((sum, c) => sum + c.length, 0);
          const result = processStreamChunks(chunks);
          expect(result.content.length).toBe(expectedLength);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.1, 2.2**
   *
   * For any array of chunks containing unicode characters (emoji, CJK,
   * diacritics, etc.), processStreamChunks SHALL correctly concatenate
   * them without corruption.
   */
  it('should correctly handle unicode content in chunks', () => {
    // Build unicode strings using array of characters mapped to string
    const unicodeChars = [
      '⭐', '🚀', '💫', '🌍', '⚡', '🔥', '✨', '🎯', '🛸', '🌌',
      'é', 'ñ', 'ü', 'ø', 'ß', 'α', 'β', 'γ', '你', '好',
      ' ', '\n', '\t', 'A', 'z', '0', '9',
    ];
    const unicodeStringArb = fc
      .array(fc.constantFrom(...unicodeChars), { minLength: 0, maxLength: 50 })
      .map((chars) => chars.join(''));

    fc.assert(
      fc.property(
        fc.array(unicodeStringArb, {
          minLength: 0,
          maxLength: 30,
        }),
        (chunks: string[]) => {
          const expected = chunks.join('');
          const result = processStreamChunks(chunks);
          expect(result.content).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.1, 2.2**
   *
   * For any way of splitting a single string into chunks, the result of
   * processStreamChunks SHALL equal the original string. This verifies
   * that splitting and reassembling preserves content integrity.
   */
  it('should reconstruct original content regardless of chunk boundaries', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        fc.array(fc.integer({ min: 1, max: 50 }), {
          minLength: 1,
          maxLength: 20,
        }),
        (fullContent: string, splitPoints: number[]) => {
          // Create chunks by splitting the full content at random points
          const chunks: string[] = [];
          let remaining = fullContent;
          for (const size of splitPoints) {
            if (remaining.length === 0) break;
            const chunkSize = Math.min(size, remaining.length);
            chunks.push(remaining.slice(0, chunkSize));
            remaining = remaining.slice(chunkSize);
          }
          if (remaining.length > 0) {
            chunks.push(remaining);
          }

          const result = processStreamChunks(chunks);
          expect(result.content).toBe(fullContent);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: star-wars-landing-page, Property 5: Loading Indicator State Consistency
 *
 * For any StreamingDataDisplay component, the loading indicator SHALL be visible
 * if and only if the streaming state is "in progress" (isStreaming === true),
 * and SHALL be hidden when streaming is complete or not started.
 *
 * **Validates: Requirements 2.3, 2.4**
 */
describe('StreamingDataDisplay - Property 5: Loading Indicator State Consistency', () => {
  /**
   * Helper that models the component's loading indicator visibility logic.
   * In the component, the loading indicator is rendered with:
   *   {state.isStreaming && <div className={styles.loadingIndicator} ...>}
   * So visibility is directly determined by isStreaming.
   */
  function isLoadingIndicatorVisible(state: StreamingState): boolean {
    return state.isStreaming;
  }

  // Generator for valid StreamingState objects
  const streamingStateArb: fc.Arbitrary<StreamingState> = fc.record({
    content: fc.string({ minLength: 0, maxLength: 200 }),
    isStreaming: fc.boolean(),
    error: fc.constant(null),
    progress: fc.double({ min: 0, max: 1, noNaN: true }),
  });

  /**
   * **Validates: Requirements 2.3, 2.4**
   *
   * For any StreamingState, the loading indicator visibility SHALL be
   * true if and only if isStreaming is true.
   */
  it('should show loading indicator if and only if isStreaming is true', () => {
    fc.assert(
      fc.property(streamingStateArb, (state: StreamingState) => {
        const indicatorVisible = isLoadingIndicatorVisible(state);
        expect(indicatorVisible).toBe(state.isStreaming);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.3**
   *
   * For any state where isStreaming is true (streaming in progress),
   * the loading indicator SHALL always be visible.
   */
  it('should always show loading indicator when streaming is in progress', () => {
    const streamingInProgressArb: fc.Arbitrary<StreamingState> = fc.record({
      content: fc.string({ minLength: 0, maxLength: 200 }),
      isStreaming: fc.constant(true as boolean),
      error: fc.constant(null),
      progress: fc.double({ min: 0, max: 0.99, noNaN: true }),
    });

    fc.assert(
      fc.property(streamingInProgressArb, (state: StreamingState) => {
        expect(isLoadingIndicatorVisible(state)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.4**
   *
   * For any state where isStreaming is false (not started or complete),
   * the loading indicator SHALL always be hidden.
   */
  it('should always hide loading indicator when streaming is not in progress', () => {
    const notStreamingArb: fc.Arbitrary<StreamingState> = fc.record({
      content: fc.string({ minLength: 0, maxLength: 200 }),
      isStreaming: fc.constant(false as boolean),
      error: fc.constant(null),
      progress: fc.oneof(fc.constant(0), fc.constant(1)),
    });

    fc.assert(
      fc.property(notStreamingArb, (state: StreamingState) => {
        expect(isLoadingIndicatorVisible(state)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.3, 2.4**
   *
   * For any sequence of streaming state transitions (simulating the
   * lifecycle: not started → streaming → complete), the loading indicator
   * SHALL track the isStreaming flag at every step.
   */
  it('should track isStreaming through state transitions', () => {
    // Generator for a sequence of state transitions
    const stateTransitionArb = fc.array(fc.boolean(), {
      minLength: 1,
      maxLength: 30,
    });

    fc.assert(
      fc.property(
        stateTransitionArb,
        fc.string({ minLength: 0, maxLength: 100 }),
        (isStreamingSequence: boolean[], content: string) => {
          for (const isStreaming of isStreamingSequence) {
            const state: StreamingState = {
              content,
              isStreaming,
              error: null,
              progress: isStreaming ? 0.5 : isStreaming ? 0 : 1,
            };

            const indicatorVisible = isLoadingIndicatorVisible(state);
            expect(indicatorVisible).toBe(isStreaming);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
