'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
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

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rifaa_bag');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Keep the deterministic empty fallback when storage is unavailable.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('rifaa_bag', JSON.stringify(newItems));
    } catch {
      // ignore
    }
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
      updated[existingIndex].quantity += quantity;
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
    const filtered = items.filter((item) => item.id !== itemId);
    saveItems(filtered);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBag(itemId);
      return;
    }
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    saveItems(updated);
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
