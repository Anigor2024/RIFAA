import { properties } from './atheeldar-data';
import { readJSON, writeJSON } from './browser-storage';

export const PROPERTY_NOTES_KEY = 'atheeldar-property-notes-v1';
export const MAX_PROPERTY_NOTE_LENGTH = 4000;
const MIGRATION_KEY = 'atheeldar-property-notes-migrated-v1';

export const PROPERTY_CHECKLIST = [
  { id: 'documents', label: 'مستندات العقار', description: 'دوّن المستندات والأسئلة التي تحتاج مراجعتها مع المعلن.' },
  { id: 'condition', label: 'حالة العقار', description: 'راجع التشطيبات والخدمات وأي أعمال تحتاج تقديرًا.' },
  { id: 'neighborhood', label: 'الحي والمشاوير', description: 'اختبر الوصول إلى وجهاتك في الوقت الذي يناسب يومك.' },
  { id: 'costs', label: 'التكلفة الكاملة', description: 'أضف إلى السعر تكاليف التشغيل وأي رسوم متوقعة.' },
  { id: 'questions', label: 'أسئلة المعاينة', description: 'اجمع الأسئلة الحاسمة قبل الذهاب لمعاينة العقار.' },
] as const;

export type PropertyChecklistId = typeof PROPERTY_CHECKLIST[number]['id'];
export type PropertyNote = { note: string; checklist: PropertyChecklistId[]; updatedAt: string };
export type PropertyNotes = Record<string, PropertyNote>;

const slugs = new Set(properties.map(property => property.slug));
const checklistIds = new Set<string>(PROPERTY_CHECKLIST.map(item => item.id));
let migrationAttempted = false;

export function normalizePropertyNotes(value: unknown): PropertyNotes {
  const notes: PropertyNotes = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return notes;
  for (const [slug, entry] of Object.entries(value)) {
    if (!slugs.has(slug) || !entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    const item = entry as Record<string, unknown>;
    if (typeof item.note !== 'string' || !Array.isArray(item.checklist) || typeof item.updatedAt !== 'string') continue;
    const timestamp = Date.parse(item.updatedAt);
    if (!/^\d{4}-\d{2}-\d{2}T/.test(item.updatedAt) || !Number.isFinite(timestamp)) continue;
    notes[slug] = {
      note: item.note.slice(0, MAX_PROPERTY_NOTE_LENGTH),
      checklist: [...new Set(item.checklist.filter((id): id is PropertyChecklistId => typeof id === 'string' && checklistIds.has(id)))],
      updatedAt: new Date(timestamp).toISOString(),
    };
  }
  return notes;
}

/** One-time migration retains the raw legacy keys for older tools. No mount autosave. */
export function readPropertyNotes(): PropertyNotes {
  const notes = normalizePropertyNotes(readJSON<unknown>(PROPERTY_NOTES_KEY, {}));
  if (typeof window === 'undefined' || migrationAttempted || readJSON<unknown>(MIGRATION_KEY, false) === true) return notes;
  // A failed large write must not be followed by a successful completion marker
  // on a later read during this visit. On reload we can retry from the raw keys.
  migrationAttempted = true;
  let changed = false;
  for (const property of properties) {
    if (notes[property.slug]) continue;
    try {
      const legacy = window.localStorage.getItem(`atheeldar-note-${property.slug}`);
      if (legacy?.trim()) {
        notes[property.slug] = { note: legacy.slice(0, MAX_PROPERTY_NOTE_LENGTH), checklist: [], updatedAt: new Date().toISOString() };
        changed = true;
      }
    } catch { /* A blocked browser can still use the current visit's memory. */ }
  }
  const persisted = !changed || writeJSON(PROPERTY_NOTES_KEY, notes).persisted;
  if (persisted) writeJSON(MIGRATION_KEY, true);
  return notes;
}

export function writePropertyNotes(value: PropertyNotes): { notes: PropertyNotes; persisted: boolean } {
  const notes = normalizePropertyNotes(value);
  // Explicit replacement must not resurrect old notes even if only the marker
  // write fails. Empty entries are tombstones, not visible notes or counts.
  const previousSlugs = new Set(Object.keys(normalizePropertyNotes(readJSON<unknown>(PROPERTY_NOTES_KEY, {}))));
  if (typeof window !== 'undefined') {
    for (const slug of slugs) {
      try { if (window.localStorage.getItem(`atheeldar-note-${slug}`)?.trim()) previousSlugs.add(slug); }
      catch { /* Keep available typed notes and report any write failure below. */ }
    }
  }
  const updatedAt = new Date().toISOString();
  // Only a previous note can be deleted. Do not create placeholders for never
  // noted properties: those would incorrectly block a later backup merge.
  for (const slug of previousSlugs) if (!notes[slug]) notes[slug] = { note: '', checklist: [], updatedAt };
  migrationAttempted = true;
  const result = writeJSON(PROPERTY_NOTES_KEY, notes);
  const markerPersisted = result.persisted && writeJSON(MIGRATION_KEY, true).persisted;
  return { notes, persisted: result.persisted && markerPersisted };
}

export function savePropertyNote(slug: string, value: Pick<PropertyNote, 'note' | 'checklist'>): { notes: PropertyNotes; persisted: boolean } {
  const notes = readPropertyNotes();
  if (!slugs.has(slug)) return { notes, persisted: false };
  return writePropertyNotes({ ...notes, [slug]: { ...value, updatedAt: new Date().toISOString() } });
}
