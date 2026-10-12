import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { properties } from '../lib/atheeldar-data';

const NOTE_KEY = 'atheeldar-property-notes-v1';
const MARKER_KEY = 'atheeldar-property-notes-migrated-v1';
const slug = properties[0].slug;
const legacyKey = `atheeldar-note-${slug}`;
type NotesApi = typeof import('../lib/property-notes');

function browserStore(initial: Record<string, string> = {}, reject: (key: string) => boolean = () => false) {
  const values = new Map(Object.entries(initial));
  const attempts: string[] = [];
  const target = Object.assign(new EventTarget(), { localStorage: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { attempts.push(key); if (reject(key)) throw new Error('quota'); values.set(key, value); },
  } });
  Object.defineProperty(globalThis, 'window', { value: target, writable: true, configurable: true });
  delete require.cache[require.resolve('../lib/property-notes')];
  delete require.cache[require.resolve('../lib/browser-storage')];
  const api = require('../lib/property-notes') as NotesApi;
  return { api, values, attempts, snapshot: () => Object.fromEntries(values) };
}
afterEach(() => { Reflect.deleteProperty(globalThis, 'window'); });

test('legacy text migrates once without deleting it and explicit clear survives the next visit', () => {
  let store = browserStore({ [legacyKey]: 'سؤال قديم عن الإضاءة' });
  assert.equal(store.api.readPropertyNotes()[slug].note, 'سؤال قديم عن الإضاءة');
  assert.equal(store.values.get(legacyKey), 'سؤال قديم عن الإضاءة');
  assert.equal(store.values.get(MARKER_KEY), 'true');
  assert.equal(store.api.writePropertyNotes({}).persisted, true);
  store = browserStore(store.snapshot());
  assert.equal(store.api.readPropertyNotes()[slug].note, '');
});

test('failed migration payload never persists its completion marker on repeated reads', () => {
  let store = browserStore({ [legacyKey]: 'ملاحظة لا يجب فقدانها' }, key => key === NOTE_KEY);
  assert.equal(store.api.readPropertyNotes()[slug].note, 'ملاحظة لا يجب فقدانها');
  assert.equal(store.api.readPropertyNotes()[slug].note, 'ملاحظة لا يجب فقدانها');
  assert.equal(store.values.has(MARKER_KEY), false);
  assert.equal(store.attempts.filter(key => key === NOTE_KEY).length, 1);
  store = browserStore(store.snapshot());
  assert.equal(store.api.readPropertyNotes()[slug].note, 'ملاحظة لا يجب فقدانها');
  assert.equal(store.values.get(MARKER_KEY), 'true');
});

test('a failed completion marker is reported and tombstones prevent old notes resurrecting after replace', () => {
  let store = browserStore({ [legacyKey]: 'أزل هذه الملاحظة' }, key => key === MARKER_KEY);
  const result = store.api.writePropertyNotes({});
  assert.equal(result.persisted, false);
  assert.equal(JSON.parse(store.values.get(NOTE_KEY)!)[slug].note, '');
  assert.equal(store.values.has(MARKER_KEY), false);
  store = browserStore(store.snapshot());
  assert.equal(store.api.readPropertyNotes()[slug].note, '');
});

test('a failed replacement preserves the previous permanent notes while exposing temporary changes honestly', () => {
  const previous = { [slug]: { note: 'المحفوظ القديم', checklist: ['condition'], updatedAt: '2026-10-12T08:00:00.000Z' } };
  let store = browserStore({ [NOTE_KEY]: JSON.stringify(previous), [MARKER_KEY]: 'true' }, key => key === NOTE_KEY);
  const result = store.api.savePropertyNote(slug, { note: 'تعديل مؤقت', checklist: ['costs'] });
  assert.equal(result.persisted, false);
  assert.equal(store.api.readPropertyNotes()[slug].note, 'تعديل مؤقت');
  store = browserStore(store.snapshot());
  assert.equal(store.api.readPropertyNotes()[slug].note, 'المحفوظ القديم');
});

test('normalization retains only known property/checklist IDs, bounded text and valid timestamps', () => {
  const store = browserStore();
  const notes = store.api.normalizePropertyNotes({
    [slug]: { note: 'س'.repeat(4500), checklist: ['condition', 'condition', 'foreign'], updatedAt: '2026-10-12T08:00:00.000Z' },
    [properties[1].slug]: { note: 'bad date', checklist: [], updatedAt: 'today' },
    unknown: { note: 'unknown property', checklist: [], updatedAt: '2026-10-12T08:00:00.000Z' },
  });
  assert.deepEqual(Object.keys(notes), [slug]);
  assert.equal(notes[slug].note.length, 4000);
  assert.deepEqual(notes[slug].checklist, ['condition']);
});

test('saving one property does not create empty conflicts for never-noted properties in a later merge', () => {
  const store = browserStore();
  const result = store.api.savePropertyNote(slug, { note: 'أول ملاحظة', checklist: [] });
  assert.deepEqual(Object.keys(result.notes), [slug]);
  const cleared = store.api.writePropertyNotes({});
  assert.deepEqual(Object.keys(cleared.notes), [slug]);
  assert.equal(cleared.notes[slug].note, '');
});
