'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { Product, ProductColor, CartItem } from '@/types';

interface BagContextType {
  items: CartItem[];
  addToBag: (product: Product, color: ProductColor, size: string, quantity?: number) => void;
  removeFromBag: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearBag: () => void;
  bagCount: number;
  subtotal: number;
  isOpen: boolean;
  isHydrated: boolean;
  openBag: () => void;
  closeBag: () => void;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

const BAG_STORAGE_KEY = 'rifaa_bag';
const BAG_CHANGE_EVENT = 'rifaa-bag-change';
let bagMemorySnapshot = '[]';

function subscribeBag(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(BAG_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(BAG_CHANGE_EVENT, onStoreChange);
  };
}

function getBagSnapshot(): string {
  try {
    const saved = localStorage.getItem(BAG_STORAGE_KEY);
    if (saved !== null) {
      bagMemorySnapshot = saved;
      return saved;
    }
  } catch {
    // Fall back to in-memory state when storage is unavailable.
  }
  return bagMemorySnapshot;
}

function getBagServerSnapshot(): null {
  return null;
}

function parseBagSnapshot(raw: string | null): CartItem[] {
  if (raw === null) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function BagProvider({ children }: { children: React.ReactNode }) {
  const rawItems = useSyncExternalStore(subscribeBag, getBagSnapshot, getBagServerSnapshot);
  const items = React.useMemo(() => parseBagSnapshot(rawItems), [rawItems]);
  const [isOpen, setIsOpen] = useState(false);
  const isHydrated = rawItems !== null;

  const saveItems = (newItems: CartItem[]) => {
    const serialized = JSON.stringify(newItems);
    bagMemorySnapshot = serialized;
    try {
      localStorage.setItem(BAG_STORAGE_KEY, serialized);
    } catch {
      // In-memory snapshot still keeps the current session responsive.
    }
    window.dispatchEvent(new Event(BAG_CHANGE_EVENT));
  };

  const addToBag = (
    product: Product,
    color: ProductColor,
    size: string,
    quantity = 1
  ) => {
    const existingIndex = items.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor.nameEn === color.nameEn &&
        item.selectedSize === size
    );

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
      saveItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${color.nameEn}-${size}-${Date.now()}`,
        product,
        selectedColor: color,
        selectedSize: size,
        quantity,
      };
      saveItems([...items, newItem]);
    }
    setIsOpen(true);
  };

  const removeFromBag = (itemId: string) => {
    saveItems(items.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBag(itemId);
      return;
    }
    saveItems(
      items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearBag = () => {
    saveItems([]);
  };

  const bagCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <BagContext.Provider
      value={{
        items,
        addToBag,
        removeFromBag,
        updateQuantity,
        clearBag,
        bagCount,
        subtotal,
        isOpen,
        isHydrated,
        openBag: () => setIsOpen(true),
        closeBag: () => setIsOpen(false),
      }}
    >
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
}
