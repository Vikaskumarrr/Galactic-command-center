"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './GalacticMap.module.css';
import { componentAnimationVariants } from '@/lib/theme';

interface Planet {
  id: string;
  name: string;
  x: number;
  y: number;
  type: string;
  description: string;
}

interface Route {
  from: string;
  to: string;
}

interface GalacticMapProps {
  planets: Planet[];
  routes: Route[];
}

const getPlanetClass = (type: string) => {
  if (type.toLowerCase().includes('core')) return styles.coreWorld;
  if (type.toLowerCase().includes('outer')) return styles.outerRim;
  return '';
};

export const GalacticMap: React.FC<GalacticMapProps> = ({ planets, routes }) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (planet: Planet, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest(`.${styles.mapContainer}`)?.getBoundingClientRect();
    if (containerRect) {
      setTooltipPos({
        x: rect.left - containerRect.left + 20,
        y: rect.top - containerRect.top - 10,
      });
    }
    setHoveredPlanet(planet);
  };

  const handleMouseLeave = () => {
    setHoveredPlanet(null);
  };

  const getPlanetById = (id: string) => planets.find(p => p.id === id);

  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`galactic-card ${styles.galacticMap}`}
      role="img"
      aria-label="Galactic star map showing planets and hyperspace routes"
    >
      <div className="scanline" aria-hidden="true" />
      <h2 className={styles.title}>Galactic Map</h2>

      <div className={styles.mapContainer}>
        <svg className={styles.mapSvg} viewBox="0 0 100 56.25">
          {/* Grid lines */}
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <line
                x1={i * 10}
                y1={0}
                x2={i * 10}
                y2={56.25}
                className={styles.gridOverlay}
              />
              <line
                x1={0}
                y1={i * 5.625}
                x2={100}
                y2={i * 5.625}
                className={styles.gridOverlay}
              />
            </React.Fragment>
          ))}

          {/* Hyperspace Routes */}
          {routes.map((route, index) => {
            const fromPlanet = getPlanetById(route.from);
            const toPlanet = getPlanetById(route.to);
            if (!fromPlanet || !toPlanet) return null;
            
            return (
              <line
                key={`route-${index}`}
                x1={fromPlanet.x}
                y1={fromPlanet.y * 0.5625}
                x2={toPlanet.x}
                y2={toPlanet.y * 0.5625}
                className={styles.route}
              />
            );
          })}

          {/* Planet Nodes */}
          {planets.map((planet) => (
            <g
              key={planet.id}
              className={styles.planetNode}
              onMouseEnter={(e) => handleMouseEnter(planet, e)}
              onMouseLeave={handleMouseLeave}
              role="button"
              aria-label={`${planet.name}: ${planet.description}`}
              tabIndex={0}
            >
              <circle
                cx={planet.x}
                cy={planet.y * 0.5625}
                r={6}
                className={`${styles.planetCircle} ${getPlanetClass(planet.type)}`}
              />
              <text
                x={planet.x}
                y={planet.y * 0.5625 + 14}
                className={styles.planetLabel}
              >
                {planet.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredPlanet && (
          <div
            className={styles.tooltip}
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
            }}
          >
            <div className={styles.tooltipName}>{hoveredPlanet.name}</div>
            <div className={styles.tooltipType}>{hoveredPlanet.type}</div>
            <div className={styles.tooltipDesc}>{hoveredPlanet.description}</div>
          </div>
        )}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.core}`} />
          <span>Core Worlds</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.mid}`} />
          <span>Mid Rim</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.outer}`} />
          <span>Outer Rim</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GalacticMap;
