'use client';

import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/types';

interface QuickViewContextType {
  selectedProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <QuickViewContext.Provider
      value={{
        selectedProduct,
        openQuickView: (product) => setSelectedProduct(product),
        closeQuickView: () => setSelectedProduct(null),
      }}
    >
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return context;
}
