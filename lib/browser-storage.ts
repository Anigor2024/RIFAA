/** Shared browser lists. Blocked storage falls back to this visit's memory. */
export const STORAGE_KEYS = {
  favorites: 'atheeldar-favorites',
  compare: 'atheeldar-compare',
  viewingPlan: 'atheeldar-viewing-plan',
  recent: 'atheeldar-recent',
} as const;

const legacyEvents: Record<string, string> = {
  [STORAGE_KEYS.favorites]: 'atheeldar:favorites',
  [STORAGE_KEYS.compare]: 'atheeldar:compare',
  [STORAGE_KEYS.viewingPlan]: 'atheeldar:viewing-plan',
  [STORAGE_KEYS.recent]: 'atheeldar:recent',
};
const limits: Record<string, number> = { [STORAGE_KEYS.compare]: 3, [STORAGE_KEYS.viewingPlan]: 6 };
const sessionValues = new Map<string, unknown>();
const eventSource = 'atheeldar-browser-storage';

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  if (sessionValues.has(key)) return sessionValues.get(key) as T;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): { value: T; persisted: boolean } {
  if (typeof window === 'undefined') return { value, persisted: false };
  let persisted = true;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    sessionValues.delete(key);
  } catch {
    persisted = false;
    sessionValues.set(key, value);
  }
  const detail = { key, persisted, source: eventSource };
  window.dispatchEvent(new CustomEvent('atheeldar:storage', { detail }));
  const legacyEvent = legacyEvents[key];
  if (legacyEvent) window.dispatchEvent(new CustomEvent(legacyEvent, { detail }));
  return { value, persisted };
}

function cleanIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && id.length > 0))];
}

export function readStoredIds(key: string): string[] {
  return cleanIds(readJSON<unknown>(key, []));
}

export type StorageWriteResult = { items: string[]; persisted: boolean };
export type StorageToggleResult = StorageWriteResult & { changed: boolean; added: boolean; atCapacity: boolean };

export function writeStoredIds(key: string, value: string[]): StorageWriteResult {
  const items = cleanIds(value);
  return { items, persisted: writeJSON(key, items).persisted };
}

export function toggleStoredId(key: string, id: string, limit = limits[key] ?? Infinity): StorageToggleResult {
  const items = readStoredIds(key);
  const added = !items.includes(id);
  if (added && items.length >= limit) {
    return { items, persisted: !sessionValues.has(key), changed: false, added: false, atCapacity: true };
  }
  const result = writeStoredIds(key, added ? [...items, id] : items.filter(item => item !== id));
  return { ...result, changed: true, added, atCapacity: false };
}

/** Observe cross-tab changes and both current and legacy same-window events. */
export function subscribeStoredIds(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key) sessionValues.delete(event.key);
    else sessionValues.clear();
    listener();
  };
  const onChange = (event: Event) => {
    const detail = (event as CustomEvent<{ source?: string }>).detail;
    if (detail?.source !== eventSource) {
      const key = Object.keys(legacyEvents).find(item => legacyEvents[item] === event.type);
      if (key) sessionValues.delete(key);
    }
    listener();
  };
  const events = ['atheeldar:storage', ...Object.values(legacyEvents)];
  window.addEventListener('storage', onStorage);
  events.forEach(event => window.addEventListener(event, onChange));
  return () => {
    window.removeEventListener('storage', onStorage);
    events.forEach(event => window.removeEventListener(event, onChange));
  };
}
