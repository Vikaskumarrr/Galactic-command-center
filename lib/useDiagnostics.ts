"use client";

import { useState, useEffect, useSyncExternalStore } from 'react';

export type DiagnosticStatus = 'Stable' | 'Warning' | 'Optimal' | 'Low' | 'Critical';

export interface DiagnosticData {
  value: number;
  status: DiagnosticStatus;
}

export interface Diagnostics {
  hyperdrive: DiagnosticData;
  shields: DiagnosticData;
  powerCore: DiagnosticData;
}

export interface DiagnosticNotification {
  id: string;
  type: 'alert' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  systemKey: keyof Diagnostics;
}

// Shared singleton store so Header + Sidebar read the same data
let diagnostics: Diagnostics = {
  hyperdrive: { value: 92, status: 'Stable' },
  shields: { value: 45, status: 'Warning' },
  powerCore: { value: 78, status: 'Optimal' },
};

let listeners: Set<() => void> = new Set();
let intervalId: ReturnType<typeof setInterval> | null = null;
let subscriberCount = 0;

function emitChange() {
  listeners.forEach(l => l());
}

function startTicking() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    const prev = diagnostics;
    const newHyperdrive = Math.min(100, Math.max(80, prev.hyperdrive.value + (Math.random() - 0.5) * 4));
    const newShields = Math.min(100, Math.max(20, prev.shields.value + (Math.random() - 0.3) * 6));
    const newPowerCore = Math.min(100, Math.max(60, prev.powerCore.value + (Math.random() - 0.5) * 3));

    diagnostics = {
      hyperdrive: {
        value: newHyperdrive,
        status: newHyperdrive > 85 ? 'Stable' : newHyperdrive > 70 ? 'Warning' : 'Critical',
      },
      shields: {
        value: newShields,
        status: newShields > 60 ? 'Stable' : newShields > 35 ? 'Warning' : 'Critical',
      },
      powerCore: {
        value: newPowerCore,
        status: newPowerCore > 70 ? 'Optimal' : newPowerCore > 55 ? 'Low' : 'Critical',
      },
    };
    emitChange();
  }, 3000);
}

function stopTicking() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  subscriberCount++;
  startTicking();
  return () => {
    listeners.delete(listener);
    subscriberCount--;
    if (subscriberCount <= 0) {
      subscriberCount = 0;
      stopTicking();
    }
  };
}

function getSnapshot() {
  return diagnostics;
}

function getServerSnapshot() {
  return diagnostics;
}

export function useDiagnostics() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Derive notifications from current diagnostics state */
export function useDiagnosticNotifications(): DiagnosticNotification[] {
  const diag = useDiagnostics();
  const [notifications, setNotifications] = useState<DiagnosticNotification[]>([]);

  useEffect(() => {
    const notifs: DiagnosticNotification[] = [];

    if (diag.shields.status === 'Warning' || diag.shields.status === 'Critical') {
      notifs.push({
        id: 'shield-warn',
        type: 'alert',
        title: 'Shield Warning',
        message: `Shields at ${Math.round(diag.shields.value)}% capacity`,
        time: 'Live',
        systemKey: 'shields',
      });
    }

    if (diag.hyperdrive.status === 'Warning' || diag.hyperdrive.status === 'Critical') {
      notifs.push({
        id: 'hyper-warn',
        type: 'warning',
        title: 'Hyperdrive Fluctuation',
        message: `Hyperdrive efficiency at ${Math.round(diag.hyperdrive.value)}%`,
        time: 'Live',
        systemKey: 'hyperdrive',
      });
    }

    if (diag.powerCore.status === 'Low' || diag.powerCore.status === 'Critical') {
      notifs.push({
        id: 'power-warn',
        type: 'warning',
        title: 'Power Core Alert',
        message: `Power core output at ${Math.round(diag.powerCore.value)}%`,
        time: 'Live',
        systemKey: 'powerCore',
      });
    }

    // Always show a stable info notification
    if (diag.hyperdrive.status === 'Stable') {
      notifs.push({
        id: 'hyper-ok',
        type: 'info',
        title: 'Hyperdrive Online',
        message: `Systems nominal at ${Math.round(diag.hyperdrive.value)}%`,
        time: 'Live',
        systemKey: 'hyperdrive',
      });
    }

    if (diag.powerCore.status === 'Optimal') {
      notifs.push({
        id: 'power-ok',
        type: 'info',
        title: 'Power Core Optimal',
        message: `Output at ${Math.round(diag.powerCore.value)}%`,
        time: 'Live',
        systemKey: 'powerCore',
      });
    }

    setNotifications(notifs);
  }, [diag]);

  return notifications;
}
