'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { DemoOrder } from '@/lib/commerce';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

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

export type CloudSyncState = 'guest' | 'syncing' | 'synced' | 'error';

interface AccountContextType extends AccountData {
  isHydrated: boolean;
  cloudSyncState: CloudSyncState;
  refreshCloudAccount: () => Promise<void>;
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
let profileSyncTimer: number | null = null;

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
    // The in-memory copy keeps the interface usable when browser storage is blocked.
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
    // The current browser session still works using memory.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function readCurrentAccount(): AccountData {
  return parseAccount(getAccountSnapshot());
}

function newAddressId() {
  return crypto.randomUUID();
}

function isDemoOrder(value: unknown): value is DemoOrder {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<DemoOrder>;
  return (
    typeof candidate.orderReference === 'string' &&
    typeof candidate.createdAt === 'string' &&
    Array.isArray(candidate.items)
  );
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const rawAccount = useSyncExternalStore(
    subscribeAccount,
    getAccountSnapshot,
    getAccountServerSnapshot
  );
  const account = useMemo(() => parseAccount(rawAccount), [rawAccount]);
  const isHydrated = rawAccount !== null;
  const [cloudSyncState, setCloudSyncState] = useState<CloudSyncState>('guest');

  const refreshCloudAccount = useCallback(async () => {
    if (!user) {
      setCloudSyncState('guest');
      return;
    }

    setCloudSyncState('syncing');
    const current = readCurrentAccount();

    try {
      const [profileResult, addressesResult, ordersResult, recentResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('first_name,last_name,phone,preferred_department,email_updates')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('addresses')
          .select('id,label,city,district,street,building,postal_code')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('orders')
          .select('snapshot,created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(12),
        supabase
          .from('recently_viewed')
          .select('product_id')
          .eq('user_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(8),
      ]);

      const firstError =
        profileResult.error ||
        addressesResult.error ||
        ordersResult.error ||
        recentResult.error;

      if (firstError) throw firstError;

      const profileRow = profileResult.data;
      const cloudProfile: AccountProfile = {
        firstName: profileRow?.first_name || current.profile.firstName,
        lastName: profileRow?.last_name || current.profile.lastName,
        email: user.email || current.profile.email,
        phone: profileRow?.phone || current.profile.phone,
      };

      const cloudPreferences: AccountPreferences = {
        preferredDepartment:
          profileRow?.preferred_department === 'women' ||
          profileRow?.preferred_department === 'men' ||
          profileRow?.preferred_department === 'kids'
            ? profileRow.preferred_department
            : current.preferences.preferredDepartment,
        emailUpdates:
          typeof profileRow?.email_updates === 'boolean'
            ? profileRow.email_updates
            : current.preferences.emailUpdates,
      };

      let cloudAddresses: SavedAddress[] = (addressesResult.data || []).map((row) => ({
        id: row.id,
        label: row.label,
        city: row.city,
        district: row.district || '',
        street: row.street,
        building: row.building || undefined,
        postalCode: row.postal_code || undefined,
      }));

      if (cloudAddresses.length === 0 && current.addresses.length > 0) {
        cloudAddresses = current.addresses.slice(0, 6).map((address) => ({
          ...address,
          id: newAddressId(),
        }));

        const { error } = await supabase.from('addresses').insert(
          cloudAddresses.map((address) => ({
            id: address.id,
            user_id: user.id,
            label: address.label,
            city: address.city,
            district: address.district,
            street: address.street,
            building: address.building || null,
            postal_code: address.postalCode || null,
          }))
        );
        if (error) throw error;
      }

      const cloudOrders = (ordersResult.data || [])
        .map((row) => row.snapshot)
        .filter(isDemoOrder);

      const knownRefs = new Set(cloudOrders.map((order) => order.orderReference));
      const mergedOrders = [
        ...cloudOrders,
        ...current.orders.filter((order) => !knownRefs.has(order.orderReference)),
      ].slice(0, 12);

      const cloudRecent = (recentResult.data || []).map((row) => row.product_id);
      const mergedRecent = Array.from(
        new Set([...cloudRecent, ...current.recentlyViewedIds])
      ).slice(0, 8);

      persistAccount({
        profile: cloudProfile,
        addresses: cloudAddresses,
        orders: mergedOrders,
        recentlyViewedIds: mergedRecent,
        preferences: cloudPreferences,
      });

      await supabase.from('profiles').upsert(
        {
          user_id: user.id,
          first_name: cloudProfile.firstName,
          last_name: cloudProfile.lastName,
          phone: cloudProfile.phone,
          preferred_department: cloudPreferences.preferredDepartment,
          email_updates: cloudPreferences.emailUpdates,
        },
        { onConflict: 'user_id' }
      );

      if (mergedRecent.length > 0) {
        await supabase.from('recently_viewed').upsert(
          mergedRecent.map((productId) => ({
            user_id: user.id,
            product_id: productId,
            viewed_at: new Date().toISOString(),
          })),
          { onConflict: 'user_id,product_id' }
        );
      }

      for (const order of current.orders) {
        if (knownRefs.has(order.orderReference)) continue;
        await supabase.rpc('create_demo_order', {
          p_order: order,
          p_items: order.items,
        });
      }

      setCloudSyncState('synced');
    } catch {
      setCloudSyncState('error');
    }
  }, [user]);

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      void refreshCloudAccount();
    }, 0);

    return () => window.clearTimeout(syncTimer);
  }, [refreshCloudAccount]);

  const saveProfile = useCallback(
    (profile: AccountProfile) => {
      persistAccount({ ...readCurrentAccount(), profile });

      if (!user) return;
      if (profileSyncTimer !== null) {
        window.clearTimeout(profileSyncTimer);
      }

      profileSyncTimer = window.setTimeout(() => {
        void supabase.from('profiles').upsert(
          {
            user_id: user.id,
            first_name: profile.firstName.trim(),
            last_name: profile.lastName.trim(),
            phone: profile.phone.trim(),
          },
          { onConflict: 'user_id' }
        );
      }, 650);
    },
    [user]
  );

  const addAddress = useCallback(
    (address: Omit<SavedAddress, 'id'>) => {
      const current = readCurrentAccount();
      const savedAddress = { ...address, id: newAddressId() };

      persistAccount({
        ...current,
        addresses: [savedAddress, ...current.addresses].slice(0, 6),
      });

      if (user) {
        void supabase.from('addresses').insert({
          id: savedAddress.id,
          user_id: user.id,
          label: savedAddress.label,
          city: savedAddress.city,
          district: savedAddress.district,
          street: savedAddress.street,
          building: savedAddress.building || null,
          postal_code: savedAddress.postalCode || null,
        });
      }
    },
    [user]
  );

  const removeAddress = useCallback(
    (id: string) => {
      const current = readCurrentAccount();
      persistAccount({
        ...current,
        addresses: current.addresses.filter((address) => address.id !== id),
      });

      if (user) {
        void supabase.from('addresses').delete().eq('id', id).eq('user_id', user.id);
      }
    },
    [user]
  );

  const recordOrder = useCallback(
    (order: DemoOrder) => {
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

      if (user) {
        void supabase.rpc('create_demo_order', {
          p_order: order,
          p_items: order.items,
        });
      }
    },
    [user]
  );

  const recordRecentlyViewed = useCallback(
    (productId: string) => {
      const current = readCurrentAccount();
      persistAccount({
        ...current,
        recentlyViewedIds: [
          productId,
          ...current.recentlyViewedIds.filter((id) => id !== productId),
        ].slice(0, 8),
      });

      if (user) {
        void supabase.from('recently_viewed').upsert(
          {
            user_id: user.id,
            product_id: productId,
            viewed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,product_id' }
        );
      }
    },
    [user]
  );

  const updatePreferences = useCallback(
    (preferences: AccountPreferences) => {
      persistAccount({ ...readCurrentAccount(), preferences });

      if (user) {
        void supabase.from('profiles').upsert(
          {
            user_id: user.id,
            preferred_department: preferences.preferredDepartment,
            email_updates: preferences.emailUpdates,
          },
          { onConflict: 'user_id' }
        );
      }
    },
    [user]
  );

  const clearDemoAccount = useCallback(() => {
    if (!user) {
      persistAccount(DEFAULT_ACCOUNT);
    }
  }, [user]);

  return (
    <AccountContext.Provider
      value={{
        ...account,
        isHydrated,
        cloudSyncState,
        refreshCloudAccount,
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
