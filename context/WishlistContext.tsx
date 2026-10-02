'use client';

import React, { createContext, useContext, useState } from 'react';
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

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rifaa_wishlist');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem('rifaa_wishlist', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
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
