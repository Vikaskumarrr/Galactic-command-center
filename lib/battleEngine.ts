// BattleEngine - Standalone space battle simulation engine
// No DOM/Canvas dependencies for testability

export type Faction = 'rebel' | 'imperial';

export interface Starship {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  faction: Faction;
  health: number;
  lastFireTime: number;
  size: number;
}

export interface LaserProjectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  faction: Faction;
  targetId: string;
  createdAt: number;
}

export interface Explosion {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  createdAt: number;
}

export interface BattleState {
  ships: Starship[];
  projectiles: LaserProjectile[];
  explosions: Explosion[];
}

export interface BattleConfig {
  canvasWidth: number;
  canvasHeight: number;
  rebelShipCount: number;
  imperialShipCount: number;
  shipSpeed: number;
  projectileSpeed: number;
  fireRate: number;
  projectileDamage: number;
  explosionDuration: number;
  respawnDelay: number;
}

export const DEFAULT_BATTLE_CONFIG: BattleConfig = {
  canvasWidth: 1920,
  canvasHeight: 1080,
  rebelShipCount: 5,
  imperialShipCount: 5,
  shipSpeed: 100,
  projectileSpeed: 400,
  fireRate: 2000,
  projectileDamage: 25,
  explosionDuration: 500,
  respawnDelay: 3000,
};

let nextId = 0;
function generateId(prefix: string): string {
  return `${prefix}-${nextId++}`;
}

export class BattleEngine {
  private config: BattleConfig;
  private state: BattleState;
  private currentTime: number;
  private respawnQueue: { faction: Faction; respawnAt: number }[];

  constructor(config: Partial<BattleConfig> = {}) {
    this.config = { ...DEFAULT_BATTLE_CONFIG, ...config };
    this.currentTime = 0;
    this.respawnQueue = [];
    this.state = {
      ships: [],
      projectiles: [],
      explosions: [],
    };
    this.spawnInitialShips();
  }

  /** Return a snapshot of the current battle state */
  getState(): BattleState {
    return {
      ships: [...this.state.ships],
      projectiles: [...this.state.projectiles],
      explosions: [...this.state.explosions],
    };
  }

  /** Advance the simulation by deltaTime (in seconds) */
  update(deltaTime: number): void {
    this.currentTime += deltaTime * 1000; // track time in ms internally

    this.updateShips(deltaTime);
    this.updateProjectiles(deltaTime);
    this.checkCollisions();
    this.updateExplosions();
    this.processRespawnQueue();
    this.autoFire();
  }

  /** Fire a projectile from one ship at another */
  fireAtTarget(shipId: string, targetId: string): void {
    const ship = this.state.ships.find((s) => s.id === shipId);
    const target = this.state.ships.find((s) => s.id === targetId);

    if (!ship || !target) return;
    if (ship.health <= 0 || target.health <= 0) return;

    const dx = target.x - ship.x;
    const dy = target.y - ship.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) return;

    const dirX = dx / dist;
    const dirY = dy / dist;

    const projectile: LaserProjectile = {
      id: generateId('proj'),
      x: ship.x,
      y: ship.y,
      vx: dirX * this.config.projectileSpeed,
      vy: dirY * this.config.projectileSpeed,
      faction: ship.faction,
      targetId: target.id,
      createdAt: this.currentTime,
    };

    this.state.projectiles.push(projectile);
    ship.lastFireTime = this.currentTime;
  }

  /** Check and resolve collisions between projectiles and ships */
  checkCollisions(): void {
    const projectilesToRemove: Set<string> = new Set();

    for (const projectile of this.state.projectiles) {
      if (projectilesToRemove.has(projectile.id)) continue;

      for (const ship of this.state.ships) {
        // Projectiles don't hit ships of the same faction
        if (projectile.faction === ship.faction) continue;
        // Don't hit already-destroyed ships
        if (ship.health <= 0) continue;

        const dx = projectile.x - ship.x;
        const dy = projectile.y - ship.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= ship.size) {
          // Collision detected
          ship.health -= this.config.projectileDamage;
          projectilesToRemove.add(projectile.id);

          // Create explosion at collision point
          this.createExplosion(projectile.x, projectile.y);

          // If ship is destroyed, queue respawn
          if (ship.health <= 0) {
            ship.health = 0;
            this.createExplosion(ship.x, ship.y);
            this.respawnQueue.push({
              faction: ship.faction,
              respawnAt: this.currentTime + this.config.respawnDelay,
            });
          }

          break; // Each projectile can only hit one ship
        }
      }
    }

    // Remove collided projectiles
    this.state.projectiles = this.state.projectiles.filter(
      (p) => !projectilesToRemove.has(p.id)
    );
  }

  /** Reset the engine to its initial state */
  reset(): void {
    this.currentTime = 0;
    this.respawnQueue = [];
    this.state = {
      ships: [],
      projectiles: [],
      explosions: [],
    };
    this.spawnInitialShips();
  }

  // ─── Private Methods ──────────────────────────────────────────

  private spawnInitialShips(): void {
    for (let i = 0; i < this.config.rebelShipCount; i++) {
      this.state.ships.push(this.createShip('rebel'));
    }
    for (let i = 0; i < this.config.imperialShipCount; i++) {
      this.state.ships.push(this.createShip('imperial'));
    }
  }

  private createShip(faction: Faction): Starship {
    const { canvasWidth, canvasHeight, shipSpeed } = this.config;
    const margin = 50;

    // Rebels spawn on the left side, imperials on the right
    const x =
      faction === 'rebel'
        ? margin + Math.random() * (canvasWidth / 2 - margin * 2)
        : canvasWidth / 2 + margin + Math.random() * (canvasWidth / 2 - margin * 2);
    const y = margin + Math.random() * (canvasHeight - margin * 2);

    // Random initial velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = shipSpeed * (0.5 + Math.random() * 0.5);

    return {
      id: generateId('ship'),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: angle,
      faction,
      health: 100,
      lastFireTime: 0,
      size: 20,
    };
  }

  private updateShips(deltaTime: number): void {
    const { canvasWidth, canvasHeight, shipSpeed } = this.config;

    for (const ship of this.state.ships) {
      if (ship.health <= 0) continue;

      // AI: steer toward nearest enemy
      const target = this.findNearestEnemy(ship);
      if (target) {
        const dx = target.x - ship.x;
        const dy = target.y - ship.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
          const desiredAngle = Math.atan2(dy, dx);
          // Smoothly rotate toward target
          let angleDiff = desiredAngle - ship.rotation;
          // Normalize angle difference to [-PI, PI]
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          const turnRate = 2.0; // radians per second
          const maxTurn = turnRate * deltaTime;
          ship.rotation += Math.max(-maxTurn, Math.min(maxTurn, angleDiff));

          // Update velocity based on rotation
          const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy) || shipSpeed;
          ship.vx = Math.cos(ship.rotation) * speed;
          ship.vy = Math.sin(ship.rotation) * speed;
        }
      }

      // Move ship
      ship.x += ship.vx * deltaTime;
      ship.y += ship.vy * deltaTime;

      // Wrap around canvas edges
      if (ship.x < 0) ship.x += canvasWidth;
      if (ship.x > canvasWidth) ship.x -= canvasWidth;
      if (ship.y < 0) ship.y += canvasHeight;
      if (ship.y > canvasHeight) ship.y -= canvasHeight;
    }
  }

  private updateProjectiles(deltaTime: number): void {
    const { canvasWidth, canvasHeight } = this.config;
    const maxLifetime = 5000; // 5 seconds max lifetime

    this.state.projectiles = this.state.projectiles.filter((proj) => {
      // Move projectile
      proj.x += proj.vx * deltaTime;
      proj.y += proj.vy * deltaTime;

      // Remove if out of bounds
      if (proj.x < -50 || proj.x > canvasWidth + 50 || proj.y < -50 || proj.y > canvasHeight + 50) {
        return false;
      }

      // Remove if too old
      if (this.currentTime - proj.createdAt > maxLifetime) {
        return false;
      }

      return true;
    });
  }

  private updateExplosions(): void {
    const { explosionDuration } = this.config;

    this.state.explosions = this.state.explosions.filter((explosion) => {
      const age = this.currentTime - explosion.createdAt;
      const progress = Math.min(age / explosionDuration, 1);

      explosion.radius = explosion.maxRadius * progress;
      explosion.opacity = 1 - progress;

      return progress < 1;
    });
  }

  private createExplosion(x: number, y: number): void {
    const explosion: Explosion = {
      id: generateId('exp'),
      x,
      y,
      radius: 0,
      maxRadius: 30 + Math.random() * 20,
      opacity: 1,
      createdAt: this.currentTime,
    };
    this.state.explosions.push(explosion);
  }

  private findNearestEnemy(ship: Starship): Starship | null {
    let nearest: Starship | null = null;
    let nearestDist = Infinity;

    for (const other of this.state.ships) {
      if (other.faction === ship.faction) continue;
      if (other.health <= 0) continue;

      const dx = other.x - ship.x;
      const dy = other.y - ship.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = other;
      }
    }

    return nearest;
  }

  private autoFire(): void {
    for (const ship of this.state.ships) {
      if (ship.health <= 0) continue;

      const timeSinceLastFire = this.currentTime - ship.lastFireTime;
      if (timeSinceLastFire < this.config.fireRate) continue;

      const target = this.findNearestEnemy(ship);
      if (target) {
        this.fireAtTarget(ship.id, target.id);
      }
    }
  }

  private processRespawnQueue(): void {
    const toRespawn = this.respawnQueue.filter((r) => this.currentTime >= r.respawnAt);
    this.respawnQueue = this.respawnQueue.filter((r) => this.currentTime < r.respawnAt);

    for (const entry of toRespawn) {
      // Remove the dead ship of this faction
      const deadShipIndex = this.state.ships.findIndex(
        (s) => s.faction === entry.faction && s.health <= 0
      );
      if (deadShipIndex !== -1) {
        this.state.ships.splice(deadShipIndex, 1);
      }
      // Spawn a fresh ship
      this.state.ships.push(this.createShip(entry.faction));
    }
  }
}
