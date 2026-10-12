import { properties } from './atheeldar-data';
import {
  DEFAULT_PROPERTY_SEARCH, PROPERTY_CITIES, PROPERTY_TYPES, PROPERTY_PURPOSES, PROPERTY_QUICK_FILTERS, PROPERTY_SORTS,
  readPropertySearchParams, writePropertySearchParams,
  type PropertySearchState,
} from './property-search';
import { PROPERTY_CHECKLIST, MAX_PROPERTY_NOTE_LENGTH, normalizePropertyNotes, type PropertyNote, type PropertyNotes } from './property-notes';

/** Deliberately limited to personal browsing choices. No arbitrary storage keys are imported. */
export const JOURNEY_BACKUP_FORMAT = 'atheeldar-journey';
export const JOURNEY_BACKUP_VERSION = 1;
export const MAX_JOURNEY_BACKUP_BYTES = 1_048_576;
export const SAVED_SEARCHES_KEY = 'atheeldar-saved-searches';
export const PROPERTY_NOTES_KEY = 'atheeldar-property-notes-v1';
export const VIEWING_MINUTES_KEY = 'atheeldar-viewing-minutes-v1';
export const VIEWING_DURATIONS = [30, 45, 55, 60, 90] as const;
export const JOURNEY_LIMITS = { favorites: 100, compare: 3, viewingPlan: 6, savedSearches: 10, notes: 100 } as const;

export type JourneySavedSearch = PropertySearchState & { id: string | number; url: string; fingerprint: string };
export type JourneyNote = PropertyNote;
export type JourneyNotes = PropertyNotes;
export type JourneySnapshot = {
  favorites: string[];
  compare: string[];
  viewingPlan: string[];
  savedSearches: JourneySavedSearch[];
  notes: JourneyNotes;
  viewingMinutes: number;
};
export type JourneyBackup = {
  format: typeof JOURNEY_BACKUP_FORMAT;
  version: typeof JOURNEY_BACKUP_VERSION;
  exportedAt: string;
  data: JourneySnapshot;
};
export type JourneyCounts = Record<'favorites' | 'compare' | 'viewingPlan' | 'savedSearches' | 'notes', number>;
export type JourneyImportMode = 'merge' | 'replace';
export type JourneyImportPlan = {
  mode: JourneyImportMode;
  data: JourneySnapshot;
  before: JourneyCounts;
  incoming: JourneyCounts;
  after: JourneyCounts;
  skipped: { compare: number; viewingPlan: number; savedSearches: number; noteConflicts: number };
};

const knownProperties = new Set(properties.map(property => property.slug));
const own = (value: Record<string, unknown>, key: string): boolean => Object.prototype.hasOwnProperty.call(value, key);
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);
const forbiddenKeys = new Set(['__proto__', 'prototype', 'constructor']);

function cleanText(value: string, max: number): string {
  return value.normalize('NFC')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '')
    .slice(0, max).trim();
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 19) === value.slice(0, 19);
}

export function emptyJourneySnapshot(): JourneySnapshot {
  return { favorites: [], compare: [], viewingPlan: [], savedSearches: [], notes: {}, viewingMinutes: 55 };
}

function knownIds(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && knownProperties.has(id)))].slice(0, limit);
}

function validSearchUrl(value: unknown): URLSearchParams | null {
  if (typeof value !== 'string' || value.length > 4096 || !value.startsWith('/')
    || value.startsWith('//') || value.includes('\\') || /[\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const url = new URL(value, 'https://atheeldar.invalid');
    if (url.origin !== 'https://atheeldar.invalid' || !['/properties', '/properties/'].includes(url.pathname)) return null;
    return url.searchParams;
  } catch { return null; }
}

function searchFingerprint(state: PropertySearchState): string {
  const { view: _view, sort: _sort, ...criteria } = state;
  return JSON.stringify(criteria);
}

/** Rebuild links from validated filters; stored URLs can never become external or script URLs. */
export function normalizeJourneySavedSearch(value: unknown, index = 0): JourneySavedSearch | null {
  if (!record(value)) return null;
  let params: URLSearchParams;
  if (own(value, 'url')) {
    const safe = validSearchUrl(value.url);
    if (!safe) return null;
    params = safe;
  } else {
    params = new URLSearchParams();
    if (typeof value.query === 'string') params.set('q', cleanText(value.query, 300));
    for (const key of ['city', 'type', 'purpose', 'max', 'beds', 'minArea', 'maxArea', 'quick', 'sort', 'view', 'residentialOnly']) {
      const raw = value[key];
      if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') params.set(key, String(raw));
    }
    if (![...params.keys()].length) return null;
  }
  if (params.has('q')) params.set('q', cleanText(params.get('q') ?? '', 300));
  const state = readPropertySearchParams(params);
  const query = writePropertySearchParams(state).toString();
  const id = typeof value.id === 'number' && Number.isSafeInteger(value.id) && value.id >= 0 ? value.id
    : typeof value.id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value.id) ? value.id : `imported-search-${index}`;
  return { ...state, id, url: `/properties${query ? `?${query}` : ''}`, fingerprint: searchFingerprint(state) };
}

export function normalizeJourneySavedSearches(value: unknown): JourneySavedSearch[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const ids = new Set<string>();
  const result: JourneySavedSearch[] = [];
  for (let index = 0; index < Math.min(value.length, 100); index += 1) {
    const search = normalizeJourneySavedSearch(value[index], index);
    if (!search || seen.has(search.fingerprint)) continue;
    seen.add(search.fingerprint);
    let suffix = 0;
    while (ids.has(String(search.id))) { search.id = `imported-search-${index}-${result.length}-${suffix}`; suffix += 1; }
    ids.add(String(search.id));
    result.push(search);
    if (result.length === JOURNEY_LIMITS.savedSearches) break;
  }
  return result;
}

export function normalizeJourneyNotes(value: unknown): JourneyNotes {
  return normalizePropertyNotes(value);
}

/** Read-only normalization of old browser data. Does not silently write repairs back to storage. */
export function normalizeJourneySnapshot(value: unknown): JourneySnapshot {
  const source = record(value) ? value : {};
  return {
    favorites: knownIds(source.favorites, JOURNEY_LIMITS.favorites),
    compare: knownIds(source.compare, JOURNEY_LIMITS.compare),
    viewingPlan: knownIds(source.viewingPlan, JOURNEY_LIMITS.viewingPlan),
    savedSearches: normalizeJourneySavedSearches(source.savedSearches),
    notes: normalizeJourneyNotes(source.notes),
    viewingMinutes: typeof source.viewingMinutes === 'number' && VIEWING_DURATIONS.some(item => item === source.viewingMinutes)
      ? source.viewingMinutes : 55,
  };
}

export function journeyCounts(data: JourneySnapshot): JourneyCounts {
  return { favorites: data.favorites.length, compare: data.compare.length, viewingPlan: data.viewingPlan.length,
    savedSearches: data.savedSearches.length, notes: Object.values(data.notes).filter(note => note.note.trim() || note.checklist.length).length };
}

export function createJourneyBackup(data: JourneySnapshot, exportedAt = new Date().toISOString()): JourneyBackup {
  if (!validDate(exportedAt)) throw new Error('تاريخ النسخة غير صالح.');
  return { format: JOURNEY_BACKUP_FORMAT, version: JOURNEY_BACKUP_VERSION, exportedAt,
    data: normalizeJourneySnapshot(data) };
}

function validateIdList(value: unknown, label: string, limit: number, warnings: string[]): string[] {
  if (!Array.isArray(value) || value.length > limit || value.some(item => typeof item !== 'string' || item.length > 100)) {
    throw new Error(`قائمة ${label} غير صالحة أو تجاوزت الحد المسموح (${limit}).`);
  }
  const result = knownIds(value, limit);
  if (result.length < value.length) warnings.push(`استُبعدت اختيارات مكررة أو غير موجودة حاليًا من ${label}.`);
  return result;
}

function validateSearches(value: unknown): JourneySavedSearch[] {
  if (!Array.isArray(value) || value.length > JOURNEY_LIMITS.savedSearches) throw new Error('قائمة البحوث غير صالحة؛ الحد الأقصى عشرة بحوث.');
  for (let index = 0; index < value.length; index += 1) {
    const entry = value[index];
    if (!record(entry) || !normalizeJourneySavedSearch(entry, index)) throw new Error('تحتوي النسخة على بحث غير صالح أو رابط غير مسموح.');
    if (typeof entry.query !== 'undefined' && (typeof entry.query !== 'string' || entry.query.length > 300)) throw new Error('نص البحث في النسخة غير صالح أو أطول من المسموح.');
    for (const [key, maximum] of [['max', 1_000_000_000], ['beds', 20], ['minArea', 100_000], ['maxArea', 100_000]] as const) {
      const number = entry[key];
      if (number !== undefined && (typeof number !== 'number' || !Number.isInteger(number) || number < 0 || number > maximum)) {
        throw new Error('تحتوي النسخة على حدود بحث رقمية غير صالحة.');
      }
    }
    for (const [key, allowed] of [['city', PROPERTY_CITIES], ['type', PROPERTY_TYPES], ['purpose', PROPERTY_PURPOSES],
      ['quick', PROPERTY_QUICK_FILTERS], ['sort', PROPERTY_SORTS], ['view', ['list', 'map']]] as const) {
      if (entry[key] !== undefined && (typeof entry[key] !== 'string' || !(allowed as readonly string[]).includes(entry[key]))) {
        throw new Error('تحتوي النسخة على خيار بحث غير معروف.');
      }
    }
    if (entry.residentialOnly !== undefined && typeof entry.residentialOnly !== 'boolean') throw new Error('نوع فلتر العقارات السكنية غير صالح.');
  }
  return normalizeJourneySavedSearches(value);
}

function validateNotes(value: unknown, warnings: string[]): JourneyNotes {
  if (!record(value) || Object.keys(value).length > JOURNEY_LIMITS.notes) throw new Error('قائمة الملاحظات غير صالحة.');
  for (const [slug, entry] of Object.entries(value)) {
    if (forbiddenKeys.has(slug)) throw new Error('تحتوي النسخة على مفتاح بيانات غير مسموح.');
    if (!knownProperties.has(slug)) { warnings.push('استُبعدت ملاحظة لعقار غير موجود في الكتالوج الحالي.'); continue; }
    if (!record(entry) || typeof entry.note !== 'string' || entry.note.length > MAX_PROPERTY_NOTE_LENGTH || !validDate(entry.updatedAt)
      || !Array.isArray(entry.checklist) || entry.checklist.length > PROPERTY_CHECKLIST.length
      || entry.checklist.some(item => typeof item !== 'string' || !PROPERTY_CHECKLIST.some(option => option.id === item))) {
      throw new Error('تحتوي النسخة على ملاحظة غير صالحة أو نص يتجاوز الحد المسموح.');
    }
  }
  return normalizeJourneyNotes(value);
}

/** Validate the whole file before allowing any browser data to change. */
export function parseJourneyBackup(text: string): { backup: JourneyBackup; warnings: string[] } {
  if (typeof text !== 'string' || text.length > MAX_JOURNEY_BACKUP_BYTES || new TextEncoder().encode(text).byteLength > MAX_JOURNEY_BACKUP_BYTES) {
    throw new Error('حجم النسخة أكبر من ١ ميغابايت. اختر ملفًا أصغر.');
  }
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error('لم نتمكن من قراءة الملف. اختر نسخة أثيلدار بصيغة JSON.'); }
  if (!record(value) || value.format !== JOURNEY_BACKUP_FORMAT || value.version !== JOURNEY_BACKUP_VERSION) {
    throw new Error('هذا الملف ليس نسخة أثيلدار مدعومة. الإصدار المدعوم هو ١.');
  }
  if (!validDate(value.exportedAt) || !record(value.data)) throw new Error('بيانات النسخة أو تاريخها غير صالحين.');
  const data = value.data;
  const warnings: string[] = [];
  const allowed = new Set(['favorites', 'compare', 'viewingPlan', 'savedSearches', 'notes', 'viewingMinutes']);
  if (Object.keys(data).some(key => !allowed.has(key))) warnings.push('تم تجاهل بيانات إضافية خارج أقسام المساحة الخمسة ومدة المعاينة.');
  for (const key of allowed) if (!own(data, key)) throw new Error('النسخة غير مكتملة. صدّر نسخة جديدة من مساحة أثيلدار.');
  if (typeof data.viewingMinutes !== 'number' || !VIEWING_DURATIONS.some(item => item === data.viewingMinutes)) {
    throw new Error('مدة المعاينة في النسخة غير صالحة.');
  }
  const snapshot: JourneySnapshot = {
    favorites: validateIdList(data.favorites, 'المفضلة', JOURNEY_LIMITS.favorites, warnings),
    compare: validateIdList(data.compare, 'المقارنة', JOURNEY_LIMITS.compare, warnings),
    viewingPlan: validateIdList(data.viewingPlan, 'المعاينات', JOURNEY_LIMITS.viewingPlan, warnings),
    savedSearches: validateSearches(data.savedSearches),
    notes: validateNotes(data.notes, warnings),
    viewingMinutes: data.viewingMinutes,
  };
  if (Array.isArray(data.savedSearches) && snapshot.savedSearches.length < data.savedSearches.length) warnings.push('جُمعت البحوث المتكررة في بحث واحد لكل مجموعة شروط.');
  return { backup: { format: JOURNEY_BACKUP_FORMAT, version: JOURNEY_BACKUP_VERSION,
    exportedAt: new Date(value.exportedAt).toISOString(), data: snapshot }, warnings: [...new Set(warnings)] };
}

export function prepareJourneyImport(current: JourneySnapshot, incoming: JourneySnapshot, mode: JourneyImportMode): JourneyImportPlan {
  if (mode !== 'merge' && mode !== 'replace') throw new Error('اختر الدمج أو الاستبدال قبل الاستيراد.');
  const beforeData = normalizeJourneySnapshot(current);
  const incomingData = normalizeJourneySnapshot(incoming);
  const skipped = { compare: 0, viewingPlan: 0, savedSearches: 0, noteConflicts: 0 };
  let data = incomingData;
  if (mode === 'merge') {
    const combineIds = (key: 'favorites' | 'compare' | 'viewingPlan'): string[] => {
      const all = [...new Set([...beforeData[key], ...incomingData[key]])];
      const limit = JOURNEY_LIMITS[key];
      if (key !== 'favorites') skipped[key] = Math.max(0, all.length - limit);
      return all.slice(0, limit);
    };
    const existingSearches = new Set(beforeData.savedSearches.map(search => search.fingerprint));
    const combinedSearches = [...beforeData.savedSearches,
      ...incomingData.savedSearches.filter(search => !existingSearches.has(search.fingerprint))];
    skipped.savedSearches = Math.max(0, combinedSearches.length - JOURNEY_LIMITS.savedSearches);
    const notes = { ...incomingData.notes, ...beforeData.notes };
    skipped.noteConflicts = Object.keys(incomingData.notes).filter(slug => beforeData.notes[slug]
      && JSON.stringify(beforeData.notes[slug]) !== JSON.stringify(incomingData.notes[slug])).length;
    data = { favorites: combineIds('favorites'), compare: combineIds('compare'), viewingPlan: combineIds('viewingPlan'),
      savedSearches: normalizeJourneySavedSearches(combinedSearches), notes, viewingMinutes: beforeData.viewingMinutes };
  }
  return { mode, data, before: journeyCounts(beforeData), incoming: journeyCounts(incomingData),
    after: journeyCounts(data), skipped };
}

export function savedSearchTitle(search: JourneySavedSearch): string {
  if (search.query.trim()) return search.query;
  return [search.type === DEFAULT_PROPERTY_SEARCH.type ? 'عقارات' : search.type,
    search.purpose === DEFAULT_PROPERTY_SEARCH.purpose ? '' : search.purpose,
    search.city === DEFAULT_PROPERTY_SEARCH.city ? 'كل المدن' : search.city].filter(Boolean).join(' · ');
}
