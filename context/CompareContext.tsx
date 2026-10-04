'use client';

import React, { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { DEMO_PRODUCTS } from '@/data/products';
import { Product } from '@/types';

interface CompareContextType {
  compareIds: string[];
  compareItems: Product[];
  compareCount: number;
  isFull: boolean;
  addToCompare: (productId: string) => boolean;
  addManyToCompare: (productIds: string[]) => void;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (productId: string) => boolean;
  isCompared: (productId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = 'rifaa_compare';
const CHANGE_EVENT = 'rifaa-compare-change';
const MAX_COMPARE = 3;
let memorySnapshot = '[]';

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot(): string | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      memorySnapshot = saved;
      return saved;
    }
  } catch {
    // Keep comparison available in memory when browser storage is unavailable.
  }
  return memorySnapshot;
}

function getServerSnapshot(): null {
  return null;
}

function parseSnapshot(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];

    const validIds = new Set(DEMO_PRODUCTS.map((product) => product.id));
    return Array.from(
      new Set(
        value.filter(
          (id): id is string => typeof id === 'string' && validIds.has(id)
        )
      )
    ).slice(0, MAX_COMPARE);
  } catch {
    return [];
  }
}

function persist(ids: string[]) {
  const normalized = Array.from(new Set(ids)).slice(0, MAX_COMPARE);
  const serialized = JSON.stringify(normalized);
  memorySnapshot = serialized;

  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // In-memory state remains usable for the current session.
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const compareIds = useMemo(() => parseSnapshot(raw), [raw]);
  const compareItems = useMemo(
    () =>
      compareIds
        .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product)),
    [compareIds]
  );

  const addToCompare = (productId: string) => {
    if (compareIds.includes(productId)) return true;
    if (compareIds.length >= MAX_COMPARE) return false;
    persist([...compareIds, productId]);
    return true;
  };

  const addManyToCompare = (productIds: string[]) => {
    persist([...compareIds, ...productIds]);
  };

  const removeFromCompare = (productId: string) => {
    persist(compareIds.filter((id) => id !== productId));
  };

  const toggleCompare = (productId: string) => {
    if (compareIds.includes(productId)) {
      removeFromCompare(productId);
      return true;
    }
    return addToCompare(productId);
  };

  const clearCompare = () => persist([]);

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        compareItems,
        compareCount: compareIds.length,
        isFull: compareIds.length >= MAX_COMPARE,
        addToCompare,
        addManyToCompare,
        removeFromCompare,
        toggleCompare,
        isCompared: (productId: string) => compareIds.includes(productId),
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
