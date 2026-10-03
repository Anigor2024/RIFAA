'use client';

import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { BagProvider } from '@/context/BagContext';
import { SearchProvider } from '@/context/SearchContext';
import { QuickViewProvider } from '@/context/QuickViewContext';
import { AccountProvider } from '@/context/AccountContext';
import { AuthProvider } from '@/context/AuthContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AccountProvider>
        <WishlistProvider>
          <BagProvider>
            <SearchProvider>
              <QuickViewProvider>
                {children}
              </QuickViewProvider>
            </SearchProvider>
          </BagProvider>
        </WishlistProvider>
        </AccountProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
