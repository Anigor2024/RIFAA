'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { Product } from '@/types';
import { DEMO_PRODUCTS } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';

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

function getWishlistSnapshot(): string | null {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (saved !== null) {
      wishlistMemorySnapshot = saved;
      return saved;
    }
  } catch {
    // Use memory when storage is unavailable.
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
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

function persistWishlist(ids: string[]) {
  const serialized = JSON.stringify(ids);
  wishlistMemorySnapshot = serialized;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, serialized);
  } catch {
    // In-memory state remains available.
  }
  window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const rawWishlist = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getWishlistServerSnapshot
  );
  const wishlistIds = useMemo(
    () => parseWishlistSnapshot(rawWishlist),
    [rawWishlist]
  );

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    void (async () => {
      const localIds = parseWishlistSnapshot(getWishlistSnapshot());
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', user.id);

      if (cancelled || error) return;

      const cloudIds = (data || []).map((row) => row.product_id);
      const merged = Array.from(new Set([...cloudIds, ...localIds]));

      persistWishlist(merged);

      if (merged.length > 0) {
        await supabase.from('wishlist_items').upsert(
          merged.map((productId) => ({
            user_id: user.id,
            product_id: productId,
          })),
          { onConflict: 'user_id,product_id' }
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggleWishlist = (productId: string) => {
    const removing = wishlistIds.includes(productId);
    const next = removing
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];

    persistWishlist(next);

    if (user) {
      if (removing) {
        void supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } else {
        void supabase.from('wishlist_items').upsert(
          {
            user_id: user.id,
            product_id: productId,
          },
          { onConflict: 'user_id,product_id' }
        );
      }
    }
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
