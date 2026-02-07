'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { BattleEngine } from '@/lib/battleEngine';
import type { BattleState, Starship, LaserProjectile, Explosion } from '@/lib/battleEngine';
import styles from './SpaceBattleCanvas.module.css';

export interface SpaceBattleCanvasProps {
  shipCount?: number;
  paused?: boolean;
  reducedMotion?: boolean;
}

// Faction colors from the design system
const REBEL_COLOR = '#4fc3f7'; // force-blue variant
const IMPERIAL_COLOR = '#ff003c'; // empire-red

// Explosion colors
const EXPLOSION_ORANGE = '#ff8c00';
const EXPLOSION_YELLOW = '#ffd700';

// Star configuration
const STAR_COUNT = 200;

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

/**
 * Generate a static starfield. Stars are placed randomly across the canvas
 * and stored so they remain consistent across frames.
 */
function generateStars(width: number, height: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
    });
  }
  return stars;
}

/**
 * Render the starfield background onto the canvas.
 */
function renderStarfield(ctx: CanvasRenderingContext2D, stars: Star[]): void {
  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fill();
  }
}

/**
 * Render a single ship as a triangular shape pointing in its direction of travel.
 * Rebel ships are blue, Imperial ships are red.
 */
function renderShip(ctx: CanvasRenderingContext2D, ship: Starship): void {
  if (ship.health <= 0) return;

  const color = ship.faction === 'rebel' ? REBEL_COLOR : IMPERIAL_COLOR;
  const glowColor =
    ship.faction === 'rebel'
      ? 'rgba(79, 195, 247, 0.4)'
      : 'rgba(255, 0, 60, 0.4)';

  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.rotation);

  // Glow effect
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 12;

  // Draw triangular ship shape
  const size = ship.size;
  ctx.beginPath();
  ctx.moveTo(size, 0); // Nose
  ctx.lineTo(-size * 0.6, -size * 0.5); // Top-left wing
  ctx.lineTo(-size * 0.3, 0); // Indent
  ctx.lineTo(-size * 0.6, size * 0.5); // Bottom-left wing
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  // Ship outline
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Reset shadow
  ctx.shadowBlur = 0;

  ctx.restore();
}

/**
 * Render all ships in the battle state.
 */
function renderShips(ctx: CanvasRenderingContext2D, ships: Starship[]): void {
  for (const ship of ships) {
    renderShip(ctx, ship);
  }
}

/**
 * Render a laser projectile as a glowing line segment.
 */
function renderProjectile(ctx: CanvasRenderingContext2D, proj: LaserProjectile): void {
  const color = proj.faction === 'rebel' ? REBEL_COLOR : IMPERIAL_COLOR;
  const glowColor =
    proj.faction === 'rebel'
      ? 'rgba(79, 195, 247, 0.6)'
      : 'rgba(255, 0, 60, 0.6)';

  // Calculate the tail position (opposite direction of velocity)
  const speed = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
  const tailLength = 15;
  const tailX = speed > 0 ? proj.x - (proj.vx / speed) * tailLength : proj.x;
  const tailY = speed > 0 ? proj.y - (proj.vy / speed) * tailLength : proj.y;

  ctx.save();

  // Outer glow
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(proj.x, proj.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner bright core
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(proj.x, proj.y);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Render all laser projectiles.
 */
function renderProjectiles(ctx: CanvasRenderingContext2D, projectiles: LaserProjectile[]): void {
  for (const proj of projectiles) {
    renderProjectile(ctx, proj);
  }
}

/**
 * Render an explosion as an expanding circle with fading opacity.
 */
function renderExplosion(ctx: CanvasRenderingContext2D, explosion: Explosion): void {
  if (explosion.opacity <= 0) return;

  ctx.save();

  // Outer ring - orange
  const gradient = ctx.createRadialGradient(
    explosion.x,
    explosion.y,
    0,
    explosion.x,
    explosion.y,
    explosion.radius
  );
  gradient.addColorStop(0, `rgba(255, 215, 0, ${explosion.opacity})`); // yellow center
  gradient.addColorStop(0.4, `rgba(255, 140, 0, ${explosion.opacity * 0.8})`); // orange mid
  gradient.addColorStop(1, `rgba(255, 0, 60, 0)`); // transparent edge

  ctx.beginPath();
  ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Bright core
  if (explosion.opacity > 0.5) {
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${explosion.opacity * 0.8})`;
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render all explosions.
 */
function renderExplosions(ctx: CanvasRenderingContext2D, explosions: Explosion[]): void {
  for (const explosion of explosions) {
    renderExplosion(ctx, explosion);
  }
}

/**
 * Render a static scene: starfield + ships in initial positions.
 * No projectiles, no explosions, no movement.
 */
function renderStaticScene(
  ctx: CanvasRenderingContext2D,
  displayWidth: number,
  displayHeight: number,
  stars: Star[],
  ships: Starship[]
): void {
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, displayWidth, displayHeight);
  renderStarfield(ctx, stars);
  renderShips(ctx, ships);
}

export function SpaceBattleCanvas({
  shipCount = 10,
  paused = false,
  reducedMotion = false,
}: SpaceBattleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BattleEngine | null>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const pausedRef = useRef(paused);
  const hiddenRef = useRef(false);

  // Track whether the system prefers reduced motion via media query
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  // Effective reduced motion: either from prop or system preference
  const effectiveReducedMotion = reducedMotion || systemReducedMotion;
  const effectiveReducedMotionRef = useRef(effectiveReducedMotion);

  // Keep refs in sync with latest values
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    effectiveReducedMotionRef.current = effectiveReducedMotion;
  }, [effectiveReducedMotion]);

  /**
   * Resize the canvas to match its container's dimensions,
   * accounting for device pixel ratio for sharp rendering.
   */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Regenerate stars for the new canvas size
    starsRef.current = generateStars(rect.width, rect.height);

    // Update engine config if it exists
    if (engineRef.current) {
      // Re-create engine with new dimensions
      const perFaction = Math.max(1, Math.floor(shipCount / 2));
      engineRef.current = new BattleEngine({
        canvasWidth: rect.width,
        canvasHeight: rect.height,
        rebelShipCount: perFaction,
        imperialShipCount: perFaction,
      });
    }

    // If in reduced motion mode, re-render the static scene after resize
    if (effectiveReducedMotionRef.current && ctx) {
      const state = engineRef.current?.getState();
      if (state) {
        renderStaticScene(ctx, rect.width, rect.height, starsRef.current, state.ships);
      }
    }
  }, [shipCount]);

  /**
   * Stop the animation loop by cancelling the pending requestAnimationFrame.
   */
  const stopAnimationLoop = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  /**
   * Start (or restart) the animation loop.
   */
  const startAnimationLoop = useCallback(() => {
    // Don't start if already running, or if reduced motion is active
    if (animationFrameRef.current !== null) return;
    if (effectiveReducedMotionRef.current) return;

    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(renderLoopFn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * The main render loop. Calculates deltaTime, updates the engine,
   * and renders all entities to the canvas.
   */
  const renderLoopFn = useCallback((timestamp: number) => {
    // If the document is hidden, stop the loop entirely (no more rAF calls)
    if (hiddenRef.current) {
      animationFrameRef.current = null;
      return;
    }

    if (pausedRef.current) {
      // If paused, keep requesting frames but don't update
      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(renderLoopFn);
      return;
    }

    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate delta time in seconds
    const deltaTime = lastTimeRef.current === 0 ? 0.016 : (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    // Clamp deltaTime to avoid huge jumps (e.g., after tab switch)
    const clampedDelta = Math.min(deltaTime, 0.1);

    // Update engine state
    engine.update(clampedDelta);

    // Get current state
    const state: BattleState = engine.getState();

    // Get display dimensions (before DPR scaling)
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.width / dpr;
    const displayHeight = canvas.height / dpr;

    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Draw dark background
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Render layers
    renderStarfield(ctx, starsRef.current);
    renderShips(ctx, state.ships);
    renderProjectiles(ctx, state.projectiles);
    renderExplosions(ctx, state.explosions);

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(renderLoopFn);
  }, []);

  /**
   * Detect system prefers-reduced-motion media query and listen for changes.
   */
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReducedMotion(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemReducedMotion(e.matches);
    };

    mql.addEventListener('change', handleChange);
    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  /**
   * Handle document visibility changes.
   * When the tab is hidden, stop the animation loop entirely.
   * When the tab becomes visible again, resume the loop.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      hiddenRef.current = isHidden;

      if (isHidden) {
        // Stop the animation loop — no more requestAnimationFrame calls
        stopAnimationLoop();
      } else {
        // Resume the animation loop when tab becomes visible again
        // Reset lastTimeRef to avoid a large deltaTime jump
        lastTimeRef.current = 0;
        startAnimationLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopAnimationLoop, startAnimationLoop]);

  /**
   * Initialize the BattleEngine and start the animation loop on mount.
   * If reduced motion is active, render a single static frame instead.
   * Clean up on unmount.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    // Set up canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Generate starfield
    starsRef.current = generateStars(rect.width, rect.height);

    // Initialize BattleEngine
    const perFaction = Math.max(1, Math.floor(shipCount / 2));
    engineRef.current = new BattleEngine({
      canvasWidth: rect.width,
      canvasHeight: rect.height,
      rebelShipCount: perFaction,
      imperialShipCount: perFaction,
    });

    if (effectiveReducedMotion) {
      // Reduced motion: render a single static frame and don't start the loop
      if (ctx) {
        const state = engineRef.current.getState();
        renderStaticScene(ctx, rect.width, rect.height, starsRef.current, state.ships);
      }
    } else {
      // Start animation loop
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(renderLoopFn);
    }

    // Handle window resize
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      stopAnimationLoop();
      window.removeEventListener('resize', handleResize);
      engineRef.current = null;
    };
  }, [shipCount, effectiveReducedMotion, renderLoopFn, resizeCanvas, stopAnimationLoop]);

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-hidden="true"
      />
    </div>
  );
}
