'use client';

import React, { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import { DemoOrder } from '@/lib/commerce';

export interface AccountProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  city: string;
  district: string;
  street: string;
  building?: string;
  postalCode?: string;
}

export interface AccountPreferences {
  preferredDepartment: 'all' | 'women' | 'men' | 'kids';
  emailUpdates: boolean;
}

interface AccountData {
  profile: AccountProfile;
  addresses: SavedAddress[];
  orders: DemoOrder[];
  recentlyViewedIds: string[];
  preferences: AccountPreferences;
}

interface AccountContextType extends AccountData {
  isHydrated: boolean;
  saveProfile: (profile: AccountProfile) => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  recordOrder: (order: DemoOrder) => void;
  recordRecentlyViewed: (productId: string) => void;
  updatePreferences: (preferences: AccountPreferences) => void;
  clearDemoAccount: () => void;
}

const DEFAULT_ACCOUNT: AccountData = {
  profile: { firstName: '', lastName: '', email: '', phone: '' },
  addresses: [],
  orders: [],
  recentlyViewedIds: [],
  preferences: { preferredDepartment: 'all', emailUpdates: false },
};

const STORAGE_KEY = 'rifaa_demo_account';
const CHANGE_EVENT = 'rifaa-account-change';
let memorySnapshot = JSON.stringify(DEFAULT_ACCOUNT);

function subscribeAccount(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getAccountSnapshot(): string | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      memorySnapshot = saved;
      return saved;
    }
  } catch {
    // Fall back to the in-memory snapshot if storage is unavailable.
  }
  return memorySnapshot;
}

function getAccountServerSnapshot(): null {
  return null;
}

function parseAccount(raw: string | null): AccountData {
  if (!raw) return DEFAULT_ACCOUNT;
  try {
    const parsed = JSON.parse(raw) as Partial<AccountData>;
    return {
      profile: { ...DEFAULT_ACCOUNT.profile, ...(parsed.profile || {}) },
      addresses: Array.isArray(parsed.addresses) ? parsed.addresses : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      recentlyViewedIds: Array.isArray(parsed.recentlyViewedIds)
        ? parsed.recentlyViewedIds.filter((id): id is string => typeof id === 'string')
        : [],
      preferences: { ...DEFAULT_ACCOUNT.preferences, ...(parsed.preferences || {}) },
    };
  } catch {
    return DEFAULT_ACCOUNT;
  }
}

function persistAccount(next: AccountData) {
  const serialized = JSON.stringify(next);
  memorySnapshot = serialized;
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // In-memory persistence still keeps the current demo session responsive.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function readCurrentAccount(): AccountData {
  return parseAccount(getAccountSnapshot());
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const rawAccount = useSyncExternalStore(
    subscribeAccount,
    getAccountSnapshot,
    getAccountServerSnapshot
  );
  const account = useMemo(() => parseAccount(rawAccount), [rawAccount]);
  const isHydrated = rawAccount !== null;

  const saveProfile = useCallback((profile: AccountProfile) => {
    persistAccount({ ...readCurrentAccount(), profile });
  }, []);

  const addAddress = useCallback((address: Omit<SavedAddress, 'id'>) => {
    const current = readCurrentAccount();
    const id = `address-${Date.now()}`;
    persistAccount({
      ...current,
      addresses: [{ ...address, id }, ...current.addresses].slice(0, 6),
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    const current = readCurrentAccount();
    persistAccount({
      ...current,
      addresses: current.addresses.filter((address) => address.id !== id),
    });
  }, []);

  const recordOrder = useCallback((order: DemoOrder) => {
    const current = readCurrentAccount();
    const deduped = current.orders.filter(
      (existing) => existing.orderReference !== order.orderReference
    );
    const hasProfile = Object.values(current.profile).some(Boolean);

    persistAccount({
      ...current,
      profile: hasProfile
        ? current.profile
        : {
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            email: order.customer.email,
            phone: order.customer.phone,
          },
      orders: [order, ...deduped].slice(0, 12),
    });
  }, []);

  const recordRecentlyViewed = useCallback((productId: string) => {
    const current = readCurrentAccount();
    persistAccount({
      ...current,
      recentlyViewedIds: [
        productId,
        ...current.recentlyViewedIds.filter((id) => id !== productId),
      ].slice(0, 8),
    });
  }, []);

  const updatePreferences = useCallback((preferences: AccountPreferences) => {
    persistAccount({ ...readCurrentAccount(), preferences });
  }, []);

  const clearDemoAccount = useCallback(() => {
    persistAccount(DEFAULT_ACCOUNT);
  }, []);

  return (
    <AccountContext.Provider
      value={{
        ...account,
        isHydrated,
        saveProfile,
        addAddress,
        removeAddress,
        recordOrder,
        recordRecentlyViewed,
        updatePreferences,
        clearDemoAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}
