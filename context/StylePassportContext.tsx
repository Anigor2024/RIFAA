'use client';

import React, { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import type { CapsuleAudience, CapsuleMoment, CapsulePalette } from '@/lib/capsule';
import type { DiscoveryPriority } from '@/lib/discovery';

export interface StylePassport {
  audience: CapsuleAudience;
  moment: CapsuleMoment;
  palette: CapsulePalette;
  priority: DiscoveryPriority;
}

interface StylePassportContextType {
  passport: StylePassport | null;
  isConfigured: boolean;
  savePassport: (passport: StylePassport) => void;
  clearPassport: () => void;
  curatorHref: string;
  capsuleHref: string;
}

const StylePassportContext = createContext<StylePassportContextType | undefined>(undefined);

const STORAGE_KEY = 'rifaa_style_passport_v1';
const CHANGE_EVENT = 'rifaa-style-passport-change';
let memorySnapshot = '';

export const DEFAULT_STYLE_PASSPORT: StylePassport = {
  audience: 'women',
  moment: 'daily',
  palette: 'neutral',
  priority: 'balanced',
};

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      memorySnapshot = saved;
      return saved;
    }
  } catch {
    // Keep the passport available in memory if browser storage is unavailable.
  }

  return memorySnapshot;
}

function getServerSnapshot(): string {
  return '';
}

function isAudience(value: unknown): value is CapsuleAudience {
  return value === 'women' || value === 'men' || value === 'boys' || value === 'girls';
}

function isMoment(value: unknown): value is CapsuleMoment {
  return value === 'daily' || value === 'work' || value === 'evening' || value === 'eid' || value === 'travel';
}

function isPalette(value: unknown): value is CapsulePalette {
  return value === 'neutral' || value === 'warm' || value === 'deep';
}

function isPriority(value: unknown): value is DiscoveryPriority {
  return value === 'balanced' || value === 'breathable' || value === 'statement' || value === 'tailored';
}

function parsePassport(raw: string): StylePassport | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<StylePassport>;
    if (
      !isAudience(value.audience) ||
      !isMoment(value.moment) ||
      !isPalette(value.palette) ||
      !isPriority(value.priority)
    ) {
      return null;
    }

    return {
      audience: value.audience,
      moment: value.moment,
      palette: value.palette,
      priority: value.priority,
    };
  } catch {
    return null;
  }
}

function persist(passport: StylePassport | null) {
  const serialized = passport ? JSON.stringify(passport) : '';
  memorySnapshot = serialized;

  try {
    if (passport) {
      localStorage.setItem(STORAGE_KEY, serialized);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // In-memory fallback remains usable for the current session.
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function StylePassportProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const passport = useMemo(() => parsePassport(raw), [raw]);

  const curatorDepartment =
    passport?.audience === 'women' || passport?.audience === 'men'
      ? passport.audience
      : passport
        ? 'kids'
        : 'all';

  const curatorHref = passport
    ? '/discover?department=' +
      curatorDepartment +
      '&moment=' +
      passport.moment +
      '&priority=' +
      passport.priority
    : '/discover';

  const capsuleHref = passport
    ? '/capsule?audience=' +
      passport.audience +
      '&moment=' +
      passport.moment +
      '&palette=' +
      passport.palette
    : '/capsule';

  return (
    <StylePassportContext.Provider
      value={{
        passport,
        isConfigured: Boolean(passport),
        savePassport: (next) => persist(next),
        clearPassport: () => persist(null),
        curatorHref,
        capsuleHref,
      }}
    >
      {children}
    </StylePassportContext.Provider>
  );
}

export function useStylePassport() {
  const context = useContext(StylePassportContext);
  if (!context) {
    throw new Error('useStylePassport must be used within a StylePassportProvider');
  }
  return context;
}
