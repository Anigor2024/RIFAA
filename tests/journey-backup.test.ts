import test from 'node:test';
import assert from 'node:assert/strict';
import { properties } from '../lib/atheeldar-data';
import { createPropertySearch } from '../lib/property-search';
import {
  MAX_JOURNEY_BACKUP_BYTES, createJourneyBackup, emptyJourneySnapshot, normalizeJourneySavedSearch,
  journeyCounts, normalizeJourneySavedSearches, normalizeJourneySnapshot, parseJourneyBackup, prepareJourneyImport,
  type JourneySnapshot,
} from '../lib/journey-backup';

const stamp = '2026-10-12T19:20:00.000Z';
const ids = properties.map(property => property.slug);
const search = (query: string, id: string | number = 12) => normalizeJourneySavedSearch({ ...createPropertySearch(query), id })!;
const snapshot = (patch: Partial<JourneySnapshot> = {}): JourneySnapshot => ({ ...emptyJourneySnapshot(), ...patch });
const file = (data = snapshot()) => createJourneyBackup(data, stamp);
const parse = (data: unknown) => parseJourneyBackup(JSON.stringify(data));

test('export/import round trip preserves Arabic search filters, viewing order and property notes', () => {
  const original = snapshot({ favorites: [ids[1], ids[0]], compare: [ids[0], ids[1]], viewingPlan: [ids[2], ids[0]], viewingMinutes: 45,
    savedSearches: [search('شقة للإيجار في جدة أقل من 200 ألف')],
    notes: { [ids[0]]: { note: 'مساحة مناسبة للعائلة\nأراجع الإضاءة مساءً.', checklist: ['condition', 'costs'], updatedAt: stamp } } });
  const parsed = parse(file(original));
  assert.deepEqual(parsed.backup.data, original);
  assert.equal(parsed.backup.data.savedSearches[0].max, 200_000);
  assert.equal(parsed.backup.data.savedSearches[0].purpose, 'للإيجار');
  assert.equal(parsed.backup.data.savedSearches[0].city, 'جدة');
  assert.deepEqual(parsed.warnings, []);
});

test('malformed JSON, unknown format and future versions are rejected before any plan exists', () => {
  assert.throws(() => parseJourneyBackup('{'), /JSON/);
  assert.throws(() => parse({ ...file(), format: 'other-app' }), /ليس نسخة أثيلدار/);
  assert.throws(() => parse({ ...file(), version: 2 }), /الإصدار المدعوم/);
  assert.throws(() => parse(null), /ليس نسخة أثيلدار/);
});

test('file size is enforced in bytes, including multibyte Arabic characters', () => {
  assert.throws(() => parseJourneyBackup('x'.repeat(MAX_JOURNEY_BACKUP_BYTES + 1)), /ميغابايت/);
  const oversized = 'أ'.repeat(Math.floor(MAX_JOURNEY_BACKUP_BYTES / 2) + 1);
  assert.ok(oversized.length < MAX_JOURNEY_BACKUP_BYTES);
  assert.throws(() => parseJourneyBackup(oversized), /ميغابايت/);
});

test('incomplete and malformed sections are rejected rather than interpreted as empty replacement', () => {
  const partial = { ...file(), data: { favorites: [] } };
  assert.throws(() => parse(partial), /غير مكتملة/);
  assert.throws(() => parse({ ...file(), data: { ...snapshot(), compare: {} } }), /قائمة المقارنة/);
  assert.throws(() => parse({ ...file(), data: { ...snapshot(), viewingMinutes: 0 } }), /مدة المعاينة/);
  assert.throws(() => parse({ ...file(), data: { ...snapshot(), notes: [] } }), /قائمة الملاحظات/);
});

test('unknown storage fields are ignored with an explicit preview warning', () => {
  const parsed = parse({ ...file(), data: { ...snapshot(), arbitraryKey: { token: 'do-not-import' } } });
  assert.ok(parsed.warnings.some(warning => warning.includes('بيانات إضافية')));
  assert.equal('arbitraryKey' in parsed.backup.data, false);
  assert.deepEqual(Object.keys(parsed.backup.data).sort(), ['compare', 'favorites', 'notes', 'savedSearches', 'viewingMinutes', 'viewingPlan'].sort());
});

test('unavailable and duplicate property IDs are removed with a preview explanation', () => {
  const parsed = parse({ ...file(), data: { ...snapshot(), favorites: [ids[0], ids[0], 'unavailable-home'],
    notes: { 'unavailable-home': { note: 'a note', checklist: [], updatedAt: stamp } } } });
  assert.deepEqual(parsed.backup.data.favorites, [ids[0]]);
  assert.deepEqual(parsed.backup.data.notes, {});
  assert.ok(parsed.warnings.some(warning => warning.includes('المفضلة')));
  assert.ok(parsed.warnings.some(warning => warning.includes('ملاحظة')));
});

test('oversized comparison, viewing and saved-search lists are rejected', () => {
  assert.throws(() => parse({ ...file(), data: { ...snapshot(), compare: ids.slice(0, 4) } }), /المقارنة/);
  assert.throws(() => parse({ ...file(), data: { ...snapshot(), viewingPlan: ids.slice(0, 7) } }), /المعاينات/);
  assert.throws(() => parse({ ...file(), data: { ...snapshot(), savedSearches: Array.from({ length: 11 }, () => search('جدة')) } }), /عشرة بحوث/);
  assert.throws(() => parse({ ...file(), data: { ...snapshot(), favorites: Array(101).fill(ids[0]) } }), /المفضلة/);
});

test('external, script, path-traversal and backslash search URLs cannot be imported', () => {
  for (const url of ['https://evil.example/properties', '//evil.example/properties', 'javascript:alert(1)',
    '/\\evil.example/properties', '/properties/../../account', '/%2f%2fevil.example', '/properties\n']) {
    const entry = { ...search('جدة'), url };
    assert.equal(normalizeJourneySavedSearch(entry), null, url);
    assert.throws(() => parse({ ...file(), data: { ...snapshot(), savedSearches: [entry] } }), /رابط غير مسموح/);
  }
});

test('canonical restoration strips arbitrary query parameters and preserves explicit overrides', () => {
  const entry = { ...search('فيلا في الرياض أقل من مليون'),
    url: '/properties?q=%D9%81%D9%8A%D9%84%D8%A7%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6&city=%D8%AC%D8%AF%D8%A9&max=2000000&redirect=https://evil.example#javascript:alert(1)' };
  const restored = normalizeJourneySavedSearch(entry)!;
  assert.equal(restored.city, 'جدة');
  assert.equal(restored.max, 2_000_000);
  assert.equal(restored.url.includes('redirect'), false);
  assert.equal(restored.url.includes('javascript'), false);
  assert.ok(restored.url.startsWith('/properties?'));
});

test('invalid numeric and enum fields are rejected instead of importing altered criteria', () => {
  for (const patch of [{ max: -1 }, { beds: 1.5 }, { minArea: '500' }, { maxArea: 100_001 },
    { city: 'unknown' }, { purpose: 'confirmed-booking' }, { residentialOnly: 'true' }]) {
    assert.throws(() => parse({ ...file(), data: { ...snapshot(), savedSearches: [{ ...search('جدة'), ...patch }] } }), /غير صالح|غير معروف/);
  }
  assert.throws(() => parse({ ...file(), data: { ...snapshot(), savedSearches: [{ ...search('جدة'), query: 'أ'.repeat(301) }] } }), /أطول من المسموح/);
});

test('notes require real ISO dates, bounded text and known checklist IDs', () => {
  for (const note of [
    { note: 'n', checklist: ['anything'], updatedAt: stamp },
    { note: 'x'.repeat(4001), checklist: [], updatedAt: stamp },
    { note: 'n', checklist: 'documents', updatedAt: stamp },
    { note: 'n', checklist: [], updatedAt: '2026-02-30T00:00:00.000Z' },
    { note: 'n', checklist: [], updatedAt: 'yesterday' },
  ]) assert.throws(() => parse({ ...file(), data: { ...snapshot(), notes: { [ids[0]]: note } } }), /ملاحظة غير صالحة/);
  assert.throws(() => parse({ ...file(), exportedAt: '2026-02-30T00:00:00.000Z' }), /تاريخها غير صالح/);
});

test('prototype-related note keys are rejected and never applied to an object prototype', () => {
  const maliciousNotes = JSON.parse('{"__proto__":{"polluted":true}}') as unknown;
  assert.throws(() => parse({ ...file(), data: { ...snapshot(), notes: maliciousNotes } }), /مفتاح بيانات غير مسموح/);
  assert.equal(({} as Record<string, unknown>).polluted, undefined);
});

test('merge keeps existing order and data, and reports capacity instead of silently replacing selections', () => {
  const current = snapshot({ favorites: [ids[0]], compare: ids.slice(0, 3), viewingPlan: ids.slice(0, 6), viewingMinutes: 45,
    notes: { [ids[0]]: { note: 'My original note', checklist: ['costs'], updatedAt: stamp } } });
  const incoming = snapshot({ favorites: [ids[1], ids[0]], compare: [ids[3], ids[4], ids[0]], viewingPlan: [ids[6], ids[7], ids[0]], viewingMinutes: 90,
    notes: { [ids[0]]: { note: 'Different imported note', checklist: ['documents'], updatedAt: stamp },
      [ids[2]]: { note: 'New note', checklist: [], updatedAt: stamp } } });
  const before = JSON.stringify(current), incomingBefore = JSON.stringify(incoming);
  const plan = prepareJourneyImport(current, incoming, 'merge');
  assert.deepEqual(plan.data.compare, current.compare);
  assert.deepEqual(plan.data.viewingPlan, current.viewingPlan);
  assert.deepEqual(plan.data.favorites, [ids[0], ids[1]]);
  assert.equal(plan.data.notes[ids[0]].note, 'My original note');
  assert.equal(plan.data.notes[ids[2]].note, 'New note');
  assert.equal(plan.data.viewingMinutes, 45);
  assert.deepEqual(plan.skipped, { compare: 2, viewingPlan: 2, savedSearches: 0, noteConflicts: 1 });
  assert.equal(plan.after.notes, 2);
  assert.equal(JSON.stringify(current), before);
  assert.equal(JSON.stringify(incoming), incomingBefore);
});

test('replace uses the complete reviewed snapshot including intentional empty sections', () => {
  const current = snapshot({ favorites: [ids[0]], compare: [ids[1]], notes: { [ids[0]]: { note: 'old', checklist: [], updatedAt: stamp } }, viewingMinutes: 30 });
  const incoming = snapshot({ viewingMinutes: 90 });
  const plan = prepareJourneyImport(current, incoming, 'replace');
  assert.deepEqual(plan.data, incoming);
  assert.equal(plan.before.favorites, 1);
  assert.equal(plan.after.favorites, 0);
  assert.equal(plan.after.notes, 0);
  assert.equal(current.favorites.length, 1);
});

test('cleared notes remain tombstones during backup and merge but are excluded from visible counts', () => {
  const current = snapshot({ notes: { [ids[0]]: { note: '', checklist: [], updatedAt: stamp } } });
  const restored = parse(file(current)).backup.data;
  assert.deepEqual(restored.notes, current.notes);
  assert.equal(journeyCounts(restored).notes, 0);
  const incoming = snapshot({ notes: { [ids[0]]: { note: 'Old deleted note', checklist: ['costs'], updatedAt: stamp } } });
  const plan = prepareJourneyImport(current, incoming, 'merge');
  assert.equal(plan.after.notes, 0);
  assert.equal(plan.skipped.noteConflicts, 1);
  assert.equal(plan.data.notes[ids[0]].note, '');
});

test('search merging deduplicates criteria and preserves distinct searches despite ID collisions', () => {
  const searches = normalizeJourneySavedSearches([search('جدة', 12), search('الرياض', 12), search('جدة', 20)]);
  assert.equal(searches.length, 2);
  assert.equal(new Set(searches.map(item => item.id)).size, 2);
  const plan = prepareJourneyImport(snapshot({ savedSearches: [search('جدة', 12)] }), snapshot({ savedSearches: [search('جدة', 20), search('الرياض', 12)] }), 'merge');
  assert.equal(plan.data.savedSearches.length, 2);
  assert.equal(new Set(plan.data.savedSearches.map(item => item.id)).size, 2);
  assert.equal(plan.data.savedSearches[0].city, 'جدة');
});

test('search merge overflow is reported while the existing ten searches remain first', () => {
  const existing = Array.from({ length: 10 }, (_, index) => normalizeJourneySavedSearch({ ...createPropertySearch(''), max: (index + 1) * 100_000, id: index })!);
  const incoming = [normalizeJourneySavedSearch({ ...createPropertySearch(''), max: 5_000_000, id: 12 })!];
  const plan = prepareJourneyImport(snapshot({ savedSearches: existing }), snapshot({ savedSearches: incoming }), 'merge');
  assert.equal(plan.skipped.savedSearches, 1);
  assert.deepEqual(plan.data.savedSearches, existing);
});

test('malformed browser snapshots normalize safely without import-like writes or arbitrary fields', () => {
  assert.deepEqual(normalizeJourneySnapshot(null), emptyJourneySnapshot());
  const normalized = normalizeJourneySnapshot({ favorites: [ids[0], '__proto__', 42], compare: ids,
    viewingPlan: ids, savedSearches: [{ url: 'javascript:alert(1)' }], notes: null, viewingMinutes: 200, other: true });
  assert.deepEqual(normalized.favorites, [ids[0]]);
  assert.equal(normalized.compare.length, 3);
  assert.equal(normalized.viewingPlan.length, 6);
  assert.deepEqual(normalized.savedSearches, []);
  assert.equal(normalized.viewingMinutes, 55);
  assert.equal('other' in normalized, false);
});
