"use client";

import React from 'react';
import styles from './SkeletonScreen.module.css';
import type { ComponentVariant } from '@/lib/theme';

interface SkeletonScreenProps {
  variant: ComponentVariant;
  count?: number;
}

const CardSkeleton: React.FC = () => (
  <div className={styles.cardSkeleton}>
    <div className={styles.cardHeader}>
      <div className={`${styles.skeleton} ${styles.cardAvatar}`} />
      <div className={`${styles.skeleton} ${styles.cardTitle}`} />
    </div>
    <div className={styles.cardBody}>
      <div className={`${styles.skeleton} ${styles.cardLine} ${styles.cardLineFull}`} />
      <div className={`${styles.skeleton} ${styles.cardLine} ${styles.cardLineMedium}`} />
      <div className={`${styles.skeleton} ${styles.cardLine} ${styles.cardLineShort}`} />
    </div>
  </div>
);

const ListSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div className={styles.listSkeleton}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={styles.listItem}>
        <div className={`${styles.skeleton} ${styles.listIcon}`} />
        <div className={styles.listContent}>
          <div className={`${styles.skeleton} ${styles.listTitle}`} />
          <div className={`${styles.skeleton} ${styles.listSubtitle}`} />
        </div>
      </div>
    ))}
  </div>
);

const GridSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div className={styles.gridSkeleton}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={styles.gridItem}>
        <div className={`${styles.skeleton} ${styles.gridIcon}`} />
        <div className={`${styles.skeleton} ${styles.gridLabel}`} />
      </div>
    ))}
  </div>
);

const ChartSkeleton: React.FC = () => {
  const barHeights = [60, 80, 45, 90, 70, 55, 85];
  
  return (
    <div className={styles.chartSkeleton}>
      <div className={styles.chartHeader}>
        <div className={`${styles.skeleton} ${styles.chartTitle}`} />
        <div className={styles.chartLegend}>
          <div className={`${styles.skeleton} ${styles.chartLegendItem}`} />
          <div className={`${styles.skeleton} ${styles.chartLegendItem}`} />
        </div>
      </div>
      <div className={styles.chartBars}>
        {barHeights.map((height, i) => (
          <div
            key={i}
            className={`${styles.skeleton} ${styles.chartBar}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export const SkeletonScreen: React.FC<SkeletonScreenProps> = ({ variant, count = 3 }) => {
  switch (variant) {
    case 'card':
      return <CardSkeleton />;
    case 'list':
      return <ListSkeleton count={count} />;
    case 'grid':
      return <GridSkeleton count={count} />;
    case 'chart':
      return <ChartSkeleton />;
    default:
      return <CardSkeleton />;
  }
};

export default SkeletonScreen;
