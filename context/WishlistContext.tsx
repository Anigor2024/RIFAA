'use client';

import React, { createContext, useContext, useSyncExternalStore } from 'react';
import { Product } from '@/types';
import { DEMO_PRODUCTS } from '@/data/products';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: Product[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'rifaa_wishlist';
const WISHLIST_CHANGE_EVENT = 'rifaa-wishlist-change';
let wishlistMemorySnapshot = '[]';

function subscribeWishlist(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(WISHLIST_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(WISHLIST_CHANGE_EVENT, onStoreChange);
  };
}

function getWishlistSnapshot(): string {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (saved !== null) {
      wishlistMemorySnapshot = saved;
      return saved;
    }
  } catch {
    // Fall back to in-memory state when storage is unavailable.
  }
  return wishlistMemorySnapshot;
}

function getWishlistServerSnapshot(): null {
  return null;
}

function parseWishlistSnapshot(raw: string | null): string[] {
  if (raw === null) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const rawWishlist = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getWishlistServerSnapshot
  );
  const wishlistIds = React.useMemo(
    () => parseWishlistSnapshot(rawWishlist),
    [rawWishlist]
  );

  const toggleWishlist = (productId: string) => {
    const next = wishlistIds.includes(productId)
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];

    const serialized = JSON.stringify(next);
    wishlistMemorySnapshot = serialized;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, serialized);
    } catch {
      // In-memory snapshot still keeps the current session responsive.
    }
    window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  const wishlistItems = DEMO_PRODUCTS.filter((product) =>
    wishlistIds.includes(product.id)
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
