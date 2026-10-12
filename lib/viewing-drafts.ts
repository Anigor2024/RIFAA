import { properties, type Property } from './atheeldar-data';
import { readJSON, writeJSON } from './browser-storage';

export const VIEWING_DRAFTS_KEY = 'atheeldar-bookings';
export const VIEWING_TIMES = ['10:00 ص', '1:00 م', '4:00 م', '7:00 م'] as const;
export type ViewingTime = typeof VIEWING_TIMES[number];
const slotHours: Record<ViewingTime, number> = { '10:00 ص': 10, '1:00 م': 13, '4:00 م': 16, '7:00 م': 19 };

export type ViewingDraft = {
  id: number; property: string; slug: string; date: string; time: ViewingTime;
  name: string; phone: string; status: 'draft'; delivery: 'local-only'; message: string; createdAt: string;
};

export function saudiToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)?.value).join('-');
}

export function validCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isFutureViewingSlot(date: string, time: string, now = new Date()): boolean {
  if (!validCalendarDate(date) || !VIEWING_TIMES.includes(time as ViewingTime)) return false;
  const timestamp = Date.parse(`${date}T${String(slotHours[time as ViewingTime]).padStart(2, '0')}:00:00+03:00`);
  return timestamp > now.getTime();
}

export function readViewingDrafts(): ViewingDraft[] {
  const value = readJSON<unknown>(VIEWING_DRAFTS_KEY, []);
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): ViewingDraft[] => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return [];
    const item = entry as Record<string, unknown>;
    const property = properties.find(property => property.slug === item.slug);
    if (!property || item.delivery !== 'local-only' || typeof item.id !== 'number' || !Number.isFinite(item.id) || !Number.isFinite(new Date(item.id).getTime())
      || !validCalendarDate(item.date) || !VIEWING_TIMES.includes(item.time as ViewingTime)) return [];
    return [{
      id: item.id, property: property.title, slug: property.slug, date: item.date, time: item.time as ViewingTime,
      name: typeof item.name === 'string' ? item.name.slice(0, 120) : '',
      phone: typeof item.phone === 'string' ? item.phone.slice(0, 40) : '',
      status: 'draft', delivery: 'local-only',
      message: typeof item.message === 'string' ? item.message.slice(0, 1000) : '',
      createdAt: typeof item.createdAt === 'string' && Number.isFinite(Date.parse(item.createdAt)) ? item.createdAt : new Date(item.id).toISOString(),
    }];
  }).slice(0, 20);
}

/** Update one property's latest local proposal and preserve unrelated advisor drafts. */
export function saveViewingDraft(property: Property, date: string, time: ViewingTime, message: string, now = new Date()): { draft: ViewingDraft; persisted: boolean } | null {
  if (!isFutureViewingSlot(date, time, now)) return null;
  const existing = readViewingDrafts().find(item => item.slug === property.slug);
  const draft: ViewingDraft = {
    id: existing?.id ?? now.getTime(), property: property.title, slug: property.slug, date, time,
    name: existing?.name ?? '', phone: existing?.phone ?? '', status: 'draft', delivery: 'local-only',
    message: message.slice(0, 1000), createdAt: existing?.createdAt ?? now.toISOString(),
  };
  const raw = readJSON<unknown>(VIEWING_DRAFTS_KEY, []);
  const others = Array.isArray(raw) ? raw.filter(item => item && typeof item === 'object'
    && !(item.slug === property.slug && item.delivery === 'local-only')) : [];
  return { draft, persisted: writeJSON(VIEWING_DRAFTS_KEY, [draft, ...others].slice(0, 20)).persisted };
}
