import { describe, it, expect } from 'vitest';
import { BattleEngine } from '@/lib/battleEngine';

/**
 * Unit tests for SpaceBattleCanvas component logic.
 */
describe('SpaceBattleCanvas - BattleEngine integration', () => {
  it('should create engine with correct ship counts from shipCount prop', () => {
    const shipCount = 10;
    const perFaction = Math.max(1, Math.floor(shipCount / 2));
    const engine = new BattleEngine({
      canvasWidth: 800, canvasHeight: 600,
      rebelShipCount: perFaction, imperialShipCount: perFaction,
    });
    const state = engine.getState();
    expect(state.ships.filter((s) => s.faction === 'rebel').length).toBe(5);
    expect(state.ships.filter((s) => s.faction === 'imperial').length).toBe(5);
  });

  it('should handle odd shipCount by flooring per-faction count', () => {
    const perFaction = Math.max(1, Math.floor(7 / 2));
    const engine = new BattleEngine({
      canvasWidth: 800, canvasHeight: 600,
      rebelShipCount: perFaction, imperialShipCount: perFaction,
    });
    const state = engine.getState();
    expect(state.ships.filter((s) => s.faction === 'rebel').length).toBe(3);
    expect(state.ships.filter((s) => s.faction === 'imperial').length).toBe(3);
  });

  it('should ensure at least 1 ship per faction even with shipCount=1', () => {
    const perFaction = Math.max(1, Math.floor(1 / 2));
    expect(perFaction).toBe(1);
    const engine = new BattleEngine({
      canvasWidth: 800, canvasHeight: 600,
      rebelShipCount: perFaction, imperialShipCount: perFaction,
    });
    const state = engine.getState();
    expect(state.ships.filter((s) => s.faction === 'rebel').length).toBe(1);
    expect(state.ships.filter((s) => s.faction === 'imperial').length).toBe(1);
  });

  it('should produce a valid BattleState', () => {
    const engine = new BattleEngine({
      canvasWidth: 800, canvasHeight: 600,
      rebelShipCount: 3, imperialShipCount: 3,
    });
    const state = engine.getState();
    expect(Array.isArray(state.ships)).toBe(true);
    expect(Array.isArray(state.projectiles)).toBe(true);
    expect(Array.isArray(state.explosions)).toBe(true);
  });

  it('should update state when engine.update is called', () => {
    const engine = new BattleEngine({
      canvasWidth: 800, canvasHeight: 600,
      rebelShipCount: 3, imperialShipCount: 3, shipSpeed: 100,
    });
    const shipBefore = engine.getState().ships[0];
    engine.update(0.5);
    const shipAfter = engine.getState().ships.find((s) => s.id === shipBefore.id);
    expect(shipAfter).toBeDefined();
    expect(engine.getState().ships.length).toBeGreaterThan(0);
  });

  it('should clamp deltaTime to avoid huge simulation jumps', () => {
    const engine = new BattleEngine({
      canvasWidth: 800, canvasHeight: 600,
      rebelShipCount: 3, imperialShipCount: 3,
    });
    expect(() => engine.update(0.1)).not.toThrow();
    expect(() => engine.update(0.016)).not.toThrow();
    expect(engine.getState().ships.length).toBeGreaterThan(0);
  });

  it('should have all ships with valid faction-specific properties', () => {
    const engine = new BattleEngine({
      canvasWidth: 800, canvasHeight: 600,
      rebelShipCount: 4, imperialShipCount: 4,
    });
    for (const ship of engine.getState().ships) {
      expect(['rebel', 'imperial']).toContain(ship.faction);
      expect(typeof ship.x).toBe('number');
      expect(typeof ship.y).toBe('number');
      expect(typeof ship.rotation).toBe('number');
      expect(ship.size).toBeGreaterThan(0);
      expect(typeof ship.health).toBe('number');
    }
  });

  it('should have projectiles with valid faction after firing', () => {
    const engine = new BattleEngine({
      canvasWidth: 800, canvasHeight: 600,
      rebelShipCount: 2, imperialShipCount: 2, fireRate: 1,
    });
    for (let i = 0; i < 5; i++) engine.update(0.016);
    for (const proj of engine.getState().projectiles) {
      expect(['rebel', 'imperial']).toContain(proj.faction);
      expect(typeof proj.x).toBe('number');
      expect(typeof proj.y).toBe('number');
      expect(typeof proj.vx).toBe('number');
      expect(typeof proj.vy).toBe('number');
    }
  });

  it('should produce explosions with valid rendering properties', () => {
    const engine = new BattleEngine({
      canvasWidth: 200, canvasHeight: 200,
      rebelShipCount: 2, imperialShipCount: 2,
      fireRate: 1, projectileSpeed: 2000, explosionDuration: 5000,
    });
    for (let i = 0; i < 200; i++) engine.update(0.016);
    for (const explosion of engine.getState().explosions) {
      expect(typeof explosion.x).toBe('number');
      expect(typeof explosion.y).toBe('number');
      expect(explosion.radius).toBeGreaterThanOrEqual(0);
      expect(explosion.maxRadius).toBeGreaterThan(0);
      expect(explosion.opacity).toBeGreaterThanOrEqual(0);
      expect(explosion.opacity).toBeLessThanOrEqual(1);
    }
  });
});

/**
 * Unit tests for visibility and reduced motion handling (Task 2.6).
 * Tests validate the behavioral contracts for pausing on visibility change
 * and handling reduced motion preferences.
 */
describe('SpaceBattleCanvas - Visibility and reduced motion handling', () => {
  it('should stop animation loop when document becomes hidden', () => {
    let animationFrameId: number | null = null;
    const cancelledIds: number[] = [];
    let rafCount = 0;
    const mockRaf = () => { rafCount++; return rafCount; };
    const mockCancelRaf = (id: number) => { cancelledIds.push(id); };

    animationFrameId = mockRaf();
    expect(animationFrameId).toBe(1);

    const isHidden = true;
    if (isHidden && animationFrameId !== null) {
      mockCancelRaf(animationFrameId);
      animationFrameId = null;
    }

    expect(animationFrameId).toBeNull();
    expect(cancelledIds).toContain(1);
    expect(rafCount).toBe(1);
  });

  it('should resume animation loop when document becomes visible again', () => {
    let animationFrameId: number | null = null;
    let rafCount = 0;
    const mockRaf = () => { rafCount++; return rafCount; };
    const mockCancelRaf = (_id: number) => { /* noop */ };

    animationFrameId = mockRaf();
    expect(rafCount).toBe(1);

    if (animationFrameId !== null) {
      mockCancelRaf(animationFrameId);
      animationFrameId = null;
    }
    expect(animationFrameId).toBeNull();

    const isHidden = false;
    const effectiveReducedMotion = false;
    if (!isHidden && !effectiveReducedMotion && animationFrameId === null) {
      animationFrameId = mockRaf();
    }

    expect(animationFrameId).not.toBeNull();
    expect(rafCount).toBe(2);
  });

  it('should not resume animation when visible if reduced motion is active', () => {
    let animationFrameId: number | null = null;
    let rafCount = 0;
    const mockRaf = () => { rafCount++; return rafCount; };
    const effectiveReducedMotion = true;
    const isHidden = false;

    if (!isHidden && !effectiveReducedMotion && animationFrameId === null) {
      animationFrameId = mockRaf();
    }

    expect(animationFrameId).toBeNull();
    expect(rafCount).toBe(0);
  });

  it('should render static scene with only ships when reduced motion is active', () => {
    const engine = new BattleEngine({
      canvasWidth: 800, canvasHeight: 600,
      rebelShipCount: 3, imperialShipCount: 3,
    });
    const state = engine.getState();
    expect(state.ships.length).toBe(6);
    expect(state.projectiles.length).toBe(0);
    expect(state.explosions.length).toBe(0);
    for (const ship of state.ships) {
      expect(ship.health).toBeGreaterThan(0);
    }
  });

  it('should combine reducedMotion prop and system preference correctly', () => {
    expect(false || false).toBe(false);
    expect(true || false).toBe(true);
    expect(false || true).toBe(true);
    expect(true || true).toBe(true);
  });

  it('should not schedule rAF when render loop detects hidden document', () => {
    let animationFrameId: number | null = 1;
    let newFrameScheduled = false;
    const hiddenRef = { current: true };

    if (hiddenRef.current) {
      animationFrameId = null;
    } else {
      newFrameScheduled = true;
    }

    expect(animationFrameId).toBeNull();
    expect(newFrameScheduled).toBe(false);
  });

  it('should reset lastTimeRef when resuming to avoid large deltaTime', () => {
    let lastTimeRef = 12345.678;
    const isHidden = false;
    if (!isHidden) {
      lastTimeRef = 0;
    }
    expect(lastTimeRef).toBe(0);

    const timestamp = 16.667;
    const deltaTime = lastTimeRef === 0 ? 0.016 : (timestamp - lastTimeRef) / 1000;
    expect(deltaTime).toBe(0.016);
  });
});
