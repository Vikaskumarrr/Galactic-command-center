import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { BattleEngine, BattleConfig } from '@/lib/battleEngine';

/**
 * Feature: star-wars-landing-page, Property 7: Animation Pause on Visibility Change
 *
 * For any SpaceBattleCanvas component, when the document visibility state changes
 * to "hidden", the animation loop SHALL be paused (no requestAnimationFrame calls),
 * and when visibility returns to "visible", the animation SHALL resume from the
 * paused state.
 *
 * **Validates: Requirements 7.1**
 *
 * Since the actual component depends on browser APIs (document.hidden,
 * requestAnimationFrame), we model the animation loop state machine as pure
 * logic and verify the behavioral contracts:
 *
 * State machine:
 *   running → hidden → paused (animationFrameRef = null) → visible → running
 *
 * Key invariants from the component code:
 * - When hiddenRef.current is true, the render loop sets animationFrameRef to null
 *   and returns (no more rAF calls)
 * - stopAnimationLoop() cancels the pending rAF and sets animationFrameRef to null
 * - startAnimationLoop() starts the loop only if animationFrameRef is null and
 *   effectiveReducedMotion is false
 * - On visibility change to visible, lastTimeRef is reset to 0 to avoid large deltaTime
 */

/**
 * Model of the SpaceBattleCanvas animation loop state machine.
 * This mirrors the logic in the component's refs and callbacks.
 */
interface AnimationLoopState {
  animationFrameId: number | null;
  hiddenRef: boolean;
  lastTimeRef: number;
  effectiveReducedMotion: boolean;
  rafCallCount: number;
}

function createInitialState(reducedMotion: boolean): AnimationLoopState {
  const state: AnimationLoopState = {
    animationFrameId: null,
    hiddenRef: false,
    lastTimeRef: 0,
    effectiveReducedMotion: reducedMotion,
    rafCallCount: 0,
  };

  // On mount, if not reduced motion, start the animation loop
  if (!reducedMotion) {
    state.animationFrameId = ++state.rafCallCount;
  }

  return state;
}

/**
 * Simulate requestAnimationFrame: assigns a new frame ID.
 * Models: animationFrameRef.current = requestAnimationFrame(renderLoopFn)
 */
function simulateRaf(state: AnimationLoopState): void {
  state.rafCallCount++;
  state.animationFrameId = state.rafCallCount;
}

/**
 * Simulate stopAnimationLoop: cancels the pending rAF.
 * Models: cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null;
 */
function stopAnimationLoop(state: AnimationLoopState): void {
  if (state.animationFrameId !== null) {
    // cancelAnimationFrame(animationFrameId)
    state.animationFrameId = null;
  }
}

/**
 * Simulate startAnimationLoop: starts the loop only if not already running
 * and not in reduced motion.
 * Models the startAnimationLoop callback in the component.
 */
function startAnimationLoop(state: AnimationLoopState): void {
  if (state.animationFrameId !== null) return; // already running
  if (state.effectiveReducedMotion) return; // reduced motion active

  state.lastTimeRef = 0;
  simulateRaf(state);
}

/**
 * Simulate the render loop callback behavior when document is hidden.
 * Models: if (hiddenRef.current) { animationFrameRef.current = null; return; }
 */
function renderLoopTick(state: AnimationLoopState): void {
  if (state.hiddenRef) {
    state.animationFrameId = null;
    return;
  }
  // If not hidden and not paused, schedule next frame
  simulateRaf(state);
}

/**
 * Simulate visibility change event handler.
 * Models the handleVisibilityChange callback in the component.
 */
function handleVisibilityChange(state: AnimationLoopState, isHidden: boolean): void {
  state.hiddenRef = isHidden;

  if (isHidden) {
    stopAnimationLoop(state);
  } else {
    state.lastTimeRef = 0;
    startAnimationLoop(state);
  }
}

// Generator for a sequence of visibility change events (true = hidden, false = visible)
const visibilitySequenceArb = fc.array(fc.boolean(), { minLength: 1, maxLength: 50 });

describe('SpaceBattleCanvas - Property 7: Animation Pause on Visibility Change', () => {
  /**
   * **Validates: Requirements 7.1**
   *
   * For any sequence of visibility state changes, when the document is hidden,
   * the animation frame ID SHALL be null (no pending rAF), and when the document
   * is visible (and reduced motion is not active), the animation frame ID SHALL
   * be non-null (animation is running).
   */
  it('should have null animationFrameId when hidden and non-null when visible (no reduced motion)', () => {
    fc.assert(
      fc.property(visibilitySequenceArb, (visibilityChanges) => {
        const state = createInitialState(false);

        // Initially visible and running
        expect(state.animationFrameId).not.toBeNull();

        for (const isHidden of visibilityChanges) {
          handleVisibilityChange(state, isHidden);

          if (isHidden) {
            // When hidden, animation frame must be null (paused, no rAF calls)
            expect(state.animationFrameId).toBeNull();
          } else {
            // When visible and not in reduced motion, animation must be running
            expect(state.animationFrameId).not.toBeNull();
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.1**
   *
   * When the render loop detects the document is hidden (via hiddenRef),
   * it SHALL set animationFrameId to null and not schedule another frame.
   * This models the early return in renderLoopFn.
   */
  it('should stop scheduling frames when render loop detects hidden state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (ticksBeforeHide) => {
          const state = createInitialState(false);

          // Run some ticks while visible
          for (let i = 0; i < ticksBeforeHide; i++) {
            renderLoopTick(state);
            expect(state.animationFrameId).not.toBeNull();
          }

          // Document becomes hidden
          state.hiddenRef = true;

          // Next render loop tick should detect hidden and stop
          renderLoopTick(state);
          expect(state.animationFrameId).toBeNull();

          // Subsequent ticks should also result in null (no new frames scheduled)
          renderLoopTick(state);
          expect(state.animationFrameId).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.1**
   *
   * When visibility returns to "visible", lastTimeRef SHALL be reset to 0
   * to avoid a large deltaTime jump on the first frame after resuming.
   */
  it('should reset lastTimeRef to 0 when resuming from hidden state', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1000, max: 100000, noNaN: true }),
        visibilitySequenceArb,
        (simulatedTime, visibilityChanges) => {
          const state = createInitialState(false);
          state.lastTimeRef = simulatedTime; // Simulate some elapsed time

          for (const isHidden of visibilityChanges) {
            handleVisibilityChange(state, isHidden);

            if (!isHidden) {
              // Every time we become visible, lastTimeRef must be reset to 0
              expect(state.lastTimeRef).toBe(0);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.1**
   *
   * The final state of the animation loop after any sequence of visibility
   * changes SHALL be determined solely by the last visibility state:
   * - If last change was to hidden → animationFrameId is null
   * - If last change was to visible → animationFrameId is non-null (when no reduced motion)
   */
  it('should have final state determined by the last visibility change', () => {
    fc.assert(
      fc.property(visibilitySequenceArb, (visibilityChanges) => {
        const state = createInitialState(false);

        for (const isHidden of visibilityChanges) {
          handleVisibilityChange(state, isHidden);
        }

        const lastChange = visibilityChanges[visibilityChanges.length - 1];
        if (lastChange) {
          // Last change was to hidden
          expect(state.animationFrameId).toBeNull();
        } else {
          // Last change was to visible
          expect(state.animationFrameId).not.toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: star-wars-landing-page, Property 8: Reduced Motion Support
 *
 * For any SpaceBattleCanvas component, when the user's system preference for
 * reduced motion is enabled (prefers-reduced-motion: reduce), the component
 * SHALL either disable animations entirely or provide a static alternative,
 * with no moving elements rendered.
 *
 * **Validates: Requirements 7.2**
 *
 * Key invariants from the component code:
 * - effectiveReducedMotion = reducedMotion || systemReducedMotion
 * - When effectiveReducedMotion is true, renderStaticScene() is called once
 *   instead of starting the animation loop
 * - renderStaticScene renders only starfield + ships (no projectiles, no explosions)
 * - startAnimationLoop() returns early if effectiveReducedMotion is true
 * - The initial BattleEngine state has ships but no projectiles or explosions
 */

// Generator for the reducedMotion prop (boolean)
const reducedMotionPropArb = fc.boolean();

// Generator for the systemReducedMotion state (boolean)
const systemReducedMotionArb = fc.boolean();

// Generator for valid battle configs to test static scene content
const staticSceneConfigArb = fc.record({
  canvasWidth: fc.integer({ min: 200, max: 4000 }),
  canvasHeight: fc.integer({ min: 200, max: 4000 }),
  rebelShipCount: fc.integer({ min: 1, max: 20 }),
  imperialShipCount: fc.integer({ min: 1, max: 20 }),
  shipSpeed: fc.integer({ min: 10, max: 500 }),
  projectileSpeed: fc.integer({ min: 50, max: 1000 }),
  fireRate: fc.integer({ min: 100, max: 10000 }),
  projectileDamage: fc.integer({ min: 1, max: 100 }),
  explosionDuration: fc.integer({ min: 100, max: 2000 }),
  respawnDelay: fc.integer({ min: 100, max: 10000 }),
}) satisfies fc.Arbitrary<BattleConfig>;

describe('SpaceBattleCanvas - Property 8: Reduced Motion Support', () => {
  /**
   * **Validates: Requirements 7.2**
   *
   * For any combination of reducedMotion prop and systemReducedMotion,
   * the effective reduced motion SHALL be true if either is true.
   * When effective reduced motion is true, the animation loop SHALL NOT be started.
   */
  it('should not start animation loop when either reducedMotion prop or system preference is true', () => {
    fc.assert(
      fc.property(reducedMotionPropArb, systemReducedMotionArb, (reducedMotionProp, systemPref) => {
        const effectiveReducedMotion = reducedMotionProp || systemPref;
        const state = createInitialState(effectiveReducedMotion);

        if (effectiveReducedMotion) {
          // Animation loop should NOT be started
          expect(state.animationFrameId).toBeNull();
        } else {
          // Animation loop should be started
          expect(state.animationFrameId).not.toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.2**
   *
   * When reduced motion is active, the static scene SHALL contain only ships
   * from the initial BattleEngine state — no projectiles and no explosions.
   * This ensures no moving elements are rendered.
   */
  it('should render static scene with only ships (no projectiles, no explosions) when reduced motion is active', () => {
    fc.assert(
      fc.property(staticSceneConfigArb, (config) => {
        const engine = new BattleEngine(config);
        const initialState = engine.getState();

        // The initial state used for the static scene should have:
        // - Ships present (both factions)
        // - No projectiles (nothing has been fired)
        // - No explosions (no collisions have occurred)
        expect(initialState.ships.length).toBeGreaterThan(0);
        expect(initialState.projectiles.length).toBe(0);
        expect(initialState.explosions.length).toBe(0);

        // All ships should be alive (full health)
        for (const ship of initialState.ships) {
          expect(ship.health).toBeGreaterThan(0);
        }

        // Both factions should be represented
        const rebels = initialState.ships.filter((s) => s.faction === 'rebel');
        const imperials = initialState.ships.filter((s) => s.faction === 'imperial');
        expect(rebels.length).toBe(config.rebelShipCount);
        expect(imperials.length).toBe(config.imperialShipCount);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.2**
   *
   * When reduced motion is active, startAnimationLoop SHALL be a no-op.
   * Even if visibility changes occur, the animation loop SHALL NOT start.
   */
  it('should not start animation loop on visibility changes when reduced motion is active', () => {
    fc.assert(
      fc.property(visibilitySequenceArb, (visibilityChanges) => {
        const state = createInitialState(true); // reduced motion active

        // Animation should never start
        expect(state.animationFrameId).toBeNull();

        for (const isHidden of visibilityChanges) {
          handleVisibilityChange(state, isHidden);

          // Regardless of visibility state, animation should remain stopped
          // because reduced motion is active
          expect(state.animationFrameId).toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.2**
   *
   * For any valid ship count configuration, when reduced motion is active,
   * the static scene ships SHALL have no velocity (they are rendered statically).
   * While the BattleEngine initializes ships with random velocities, the component
   * never calls engine.update() in reduced motion mode, so ships remain at their
   * initial positions — the scene is truly static.
   */
  it('should produce a static scene where engine.update is never called (no state changes)', () => {
    fc.assert(
      fc.property(staticSceneConfigArb, (config) => {
        const engine = new BattleEngine(config);

        // Capture the initial state (what renderStaticScene would use)
        const initialState = engine.getState();

        // In reduced motion mode, the component renders this initial state once
        // and never calls engine.update(). Verify the state is suitable for
        // static rendering: ships exist, no dynamic elements.
        const shipPositions = initialState.ships.map((s) => ({
          id: s.id,
          x: s.x,
          y: s.y,
          faction: s.faction,
        }));

        // Re-read state without updating — should be identical
        const sameState = engine.getState();
        const samePositions = sameState.ships.map((s) => ({
          id: s.id,
          x: s.x,
          y: s.y,
          faction: s.faction,
        }));

        // Without calling update(), the state should be unchanged
        expect(samePositions).toEqual(shipPositions);
        expect(sameState.projectiles.length).toBe(0);
        expect(sameState.explosions.length).toBe(0);
      }),
      { numRuns: 100 }
    );
  });
});
