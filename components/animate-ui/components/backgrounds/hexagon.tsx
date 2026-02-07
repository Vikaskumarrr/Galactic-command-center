'use client';

import * as React from 'react';

type HexagonBackgroundProps = React.ComponentProps<'div'> & {
  hexagonSize?: number;
  hexagonMargin?: number;
  hexColor?: string;
  hexBorderColor?: string;
  hexHoverColor?: string;
};

const clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

// Shared sweep position — updated by a single rAF loop, read by all hexagons
const sweepState = { x: -0.3, containerWidth: 1 };

function HexagonBackground({
  className,
  children,
  hexagonSize = 75,
  hexagonMargin = 3,
  hexColor = 'rgba(5, 10, 20, 1)',
  hexBorderColor = 'rgba(0, 229, 255, 0.06)',
  hexHoverColor = 'rgba(0, 229, 255, 0.08)',
  style,
  ...props
}: HexagonBackgroundProps) {
  const hexW = hexagonSize;
  const hexH = hexagonSize * 1.1;
  const rowSpacing = hexagonSize * 0.8;
  const baseMarginTop = -36 - 0.275 * (hexagonSize - 100);
  const computedMarginTop = baseMarginTop + hexagonMargin;
  const oddRowMarginLeft = -(hexagonSize / 2);
  const evenRowMarginLeft = hexagonMargin / 2;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const animRef = React.useRef<number>(0);
  const [grid, setGrid] = React.useState({ rows: 0, columns: 0 });

  const updateGrid = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    sweepState.containerWidth = rect.width;
    setGrid({
      rows: Math.ceil(rect.height / rowSpacing) + 2,
      columns: Math.ceil(rect.width / hexW) + 3,
    });
  }, [rowSpacing, hexW]);

  React.useEffect(() => {
    updateGrid();
    window.addEventListener('resize', updateGrid);
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateGrid) : null;
    if (containerRef.current && ro) ro.observe(containerRef.current);
    return () => {
      window.removeEventListener('resize', updateGrid);
      ro?.disconnect();
    };
  }, [updateGrid]);

  // Single animation loop that updates all hexagons via DOM
  React.useEffect(() => {
    const SWEEP_DURATION = 5000; // ms for one full sweep
    const GLOW_RADIUS = 200; // px radius of the glow zone

    const animate = () => {
      const t = (Date.now() % SWEEP_DURATION) / SWEEP_DURATION;
      // Ease in-out sweep: -0.3 to 1.3 range
      const sweepX = -0.3 + t * 1.6;
      const sweepPx = sweepX * sweepState.containerWidth;

      const gridEl = gridRef.current;
      if (gridEl) {
        const hexEls = gridEl.querySelectorAll<HTMLElement>('[data-hex]');
        for (let i = 0; i < hexEls.length; i++) {
          const hex = hexEls[i];
          const hx = parseFloat(hex.dataset.hx || '0');
          const dist = Math.abs(hx - sweepPx);

          if (dist < GLOW_RADIUS) {
            const intensity = 1 - dist / GLOW_RADIUS;
            const borderAlpha = 0.06 + intensity * 0.2;
            const innerAlpha = intensity * 0.06;
            hex.style.background = `rgba(0, 229, 255, ${borderAlpha})`;
            const inner = hex.firstElementChild as HTMLElement;
            if (inner) inner.style.background = `rgba(0, 229, 255, ${innerAlpha})`;
          } else {
            hex.style.background = '';
            const inner = hex.firstElementChild as HTMLElement;
            if (inner) inner.style.background = '';
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      data-slot="hexagon-background"
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      <div
        ref={gridRef}
        style={{
          position: 'absolute',
          top: -hexH,
          left: -hexW,
          right: -hexW,
          bottom: -hexH,
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: grid.rows }).map((_, rowIndex) => {
          const isEvenRow = (rowIndex + 1) % 2 === 0;
          const rowML = (isEvenRow ? evenRowMarginLeft : oddRowMarginLeft) - 10;

          return (
            <div
              key={rowIndex}
              style={{
                display: 'flex',
                marginTop: computedMarginTop,
                marginLeft: rowML,
              }}
            >
              {Array.from({ length: grid.columns }).map((_, colIndex) => {
                // Approximate x position of this hexagon
                const hx = rowML + hexW + colIndex * (hexW + hexagonMargin) + hexW / 2;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    data-hex=""
                    data-hx={hx}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = hexHoverColor;
                      const inner = el.firstElementChild as HTMLElement;
                      if (inner) inner.style.background = 'rgba(0, 229, 255, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.background = '';
                      const inner = el.firstElementChild as HTMLElement;
                      if (inner) inner.style.background = '';
                    }}
                    style={{
                      position: 'relative',
                      width: hexW,
                      height: hexH,
                      marginLeft: hexagonMargin,
                      clipPath,
                      background: hexBorderColor,
                      transition: 'background 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: hexagonMargin,
                        clipPath,
                        background: hexColor,
                        transition: 'background 0.15s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}

export { HexagonBackground, type HexagonBackgroundProps };
