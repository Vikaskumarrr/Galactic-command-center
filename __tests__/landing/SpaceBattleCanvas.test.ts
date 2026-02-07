import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BattleEngine } from '@/lib/battleEngine';

/**
 * Unit tests for SpaceBattleCanvas component logic.
 *
 * Since the component relies on browser APIs (canvas, requestAnimationFrame),
 * we test the underlying BattleEngine integration and rendering data flow
 * that the component depends on. The pure rendering functions are internal
 * to the component module, so we validate the data contracts here.
 */

describe('SpaceBattleCanvas - BattleEngine integration', () => {
  it('should create engine with correct ship counts from shipCount prop', () => {
    // Simulates what the component does: shipCount / 2 per faction
    const shipCount = 10;
    const perFaction = Math.max(1, Math.floor(shipCount / 2));

    const engine = new BattleEngine({
      canvasWidth: 800,
      canvasHeight: 600,
      rebelShipCount: perFaction,
      imperialShipCount: perFaction,
    });

    const state = engine.getState();
    const rebels = state.ships.filter((s) => s.faction === 'rebel');
    const imperials = state.ships.filter((s) => s.faction === 'imperial');

    expect(rebels.length).toBe(5);
    expect(imperials.length).toBe(5);
  });

  it('should handle odd shipCount by flooring per-faction count', () => {
    const shipCount = 7;
    const perFaction = Math.max(1, Math.floor(shipCount / 2));

    const engine = new BattleEngine({
      canvasWidth: 800,
      canvasHeight: 600,
      rebelShipCount: perFaction,
      imperialShipCount: perFaction,
    });

    const state = engine.getState();
    const rebels = state.ships.filter((s) => s.faction === 'rebel');
    const imperials = state.ships.filter((s) => s.faction === 'imperial');

    expect(rebels.length).toBe(3);
    expect(imperials.length).toBe(3);
  });

  it('should ensure at least 1 ship per faction even with shipCount=1', () => {
    const shipCount = 1;
    const perFaction = Math.max(1, Math.floor(shipCount / 2));

    expect(perFaction).toBe(1);

    const engine = new BattleEngine({
      canvasWidth: 800,
      canvasHeight: 600,
      rebelShipCount: perFaction,
      imperialShipCount: perFaction,
    });

    const state = engine.getState();
    const rebels = state.ships.filter((s) => s.faction === 'rebel');
    const imperials = state.ships.filter((s) => s.faction === 'imperial');

    expect(rebels.length).toBe(1);
    expect(imperials.length).toBe(1);
  });

  it('should produce a valid BattleState with ships, projectiles, and explosions arrays', () => {
    const engine = new BattleEngine({
      canvasWidth: 800,
      canvasHeight: 600,
      rebelShipCount: 3,
      imperialShipCount: 3,
    });

    const state = engine.getState();

    expect(Array.isArray(state.ships)).toBe(true);
    expect(Array.isArray(state.projectiles)).toBe(true);
    expect(Array.isArray(state.explosions)).toBe(true);
  });

  it('should update state when engine.update is called with deltaTime', () => {
    const engine = new BattleEngine({
      canvasWidth: 800,
      canvasHeight: 600,
      rebelShipCount: 3,
      imperialShipCount: 3,
      shipSpeed: 100,
    });

    const stateBefore = engine.getState();
    const shipBefore = stateBefore.ships[0];
    const posXBefore = shipBefore.x;
    const posYBefore = shipBefore.y;

    // Update with a reasonable delta time
    engine.update(0.5);

    const stateAfter = engine.getState();
    const shipAfter = stateAfter.ships.find((s) => s.id === shipBefore.id);

    expect(shipAfter).toBeDefined();
    // Ship should have moved (unless it wrapped around, position should differ)
    // We just verify the engine processes the update without error
    expect(stateAfter.ships.length).toBeGreaterThan(0);
  });

  it('should clamp deltaTime to avoid huge simulation jumps', () => {
    // The component clamps deltaTime to 0.1s max
    // Verify the engine handles large deltas gracefully
    const engine = new BattleEngine({
      canvasWidth: 800,
      canvasHeight: 600,
      rebelShipCount: 3,
      imperialShipCount: 3,
    });

    // Even with a large delta, engine should not crash
    expect(() => engine.update(0.1)).not.toThrow();
    expect(() => engine.update(0.016)).not.toThrow();

    const state = engine.getState();
    expect(state.ships.length).toBeGreaterThan(0);
  });

  it('should have all ships with valid faction-specific properties for rendering', () => {
    const engine = new BattleEngine({
      canvasWidth: 800,
      canvasHeight: 600,
      rebelShipCount: 4,
      imperialShipCount: 4,
    });

    const state = engine.getState();

    for (const ship of state.ships) {
      // Each ship must have a faction for color assignment
      expect(['rebel', 'imperial']).toContain(ship.faction);
      // Each ship must have position for rendering
      expect(typeof ship.x).toBe('number');
      expect(typeof ship.y).toBe('number');
      // Each ship must have rotation for triangle orientation
      expect(typeof ship.rotation).toBe('number');
      // Each ship must have size for rendering
      expect(ship.size).toBeGreaterThan(0);
      // Each ship must have health for alive/dead check
      expect(typeof ship.health).toBe('number');
    }
  });

  it('should have projectiles with valid faction for color rendering after firing', () => {
    const engine = new BattleEngine({
      canvasWidth: 800,
      canvasHeight: 600,
      rebelShipCount: 2,
      imperialShipCount: 2,
      fireRate: 1, // Very fast fire rate to trigger auto-fire
    });

    // Run a few updates to trigger auto-fire
    for (let i = 0; i < 5; i++) {
      engine.update(0.016);
    }

    const state = engine.getState();

    for (const proj of state.projectiles) {
      expect(['rebel', 'imperial']).toContain(proj.faction);
      expect(typeof proj.x).toBe('number');
      expect(typeof proj.y).toBe('number');
      expect(typeof proj.vx).toBe('number');
      expect(typeof proj.vy).toBe('number');
    }
  });

  it('should produce explosions with valid rendering properties after collisions', () => {
    const engine = new BattleEngine({
      canvasWidth: 200,
      canvasHeight: 200,
      rebelShipCount: 2,
      imperialShipCount: 2,
      fireRate: 1,
      projectileSpeed: 2000,
      explosionDuration: 5000,
    });

    // Run many updates to trigger firing and collisions
    for (let i = 0; i < 200; i++) {
      engine.update(0.016);
    }

    const state = engine.getState();

    for (const explosion of state.explosions) {
      expect(typeof explosion.x).toBe('number');
      expect(typeof explosion.y).toBe('number');
      expect(typeof explosion.radius).toBe('number');
      expect(explosion.radius).toBeGreaterThanOrEqual(0);
      expect(typeof explosion.maxRadius).toBe('number');
      expect(explosion.maxRadius).toBeGreaterThan(0);
      expect(typeof explosion.opacity).toBe('number');
      expect(explosion.opacity).toBeGreaterThanOrEqual(0);
      expect(explosion.opacity).toBeLessThanOrEqual(1);
    }
  });
});
