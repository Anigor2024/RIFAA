import test from 'node:test';
import assert from 'node:assert/strict';
import type { Property } from '../lib/atheeldar-data';
import { properties } from '../lib/atheeldar-data';
import {
  DEFAULT_HOME_PREFERENCES, explainNoHomeMatches, parseHomeBudget,
  parseHomePreferences, rankHomeMatches,
  type HomePreferences,
} from '../lib/home-matching';

const preferences = (patch: Partial<HomePreferences> = {}): HomePreferences => ({
  ...DEFAULT_HOME_PREFERENCES, maxBudget: 10_000_000, priorities: [], ...patch,
});
const property = (slug: string, patch: Partial<Property> = {}): Property => ({
  ...properties[0], slug, title: slug, price: 2_000_000, beds: 3,
  featured: false, newBuild: false, investment: false, features: [], ...patch,
});

test('home purchase and rental exclude commercial assets even when rooms and all other fields match', () => {
  const catalogue = [
    property('home'),
    property('land', { type: 'أرض', investment: true }),
    property('office', { type: 'مكتب', investment: true }),
    property('rent-home', { purpose: 'للإيجار', price: 100_000 }),
    property('rent-office', { purpose: 'للإيجار', price: 80_000, type: 'مكتب' }),
  ];
  assert.deepEqual(rankHomeMatches(catalogue, preferences()).map(match => match.property.slug), ['home']);
  assert.deepEqual(rankHomeMatches(catalogue, preferences({ purpose: 'rent', maxBudget: 100_000 }))
    .map(match => match.property.slug), ['rent-home']);
});

test('investment allows advertised land and office purchases, never annual office rent', () => {
  const catalogue = [
    property('land', { type: 'أرض', investment: true, beds: 0 }),
    property('office', { type: 'مكتب', investment: true, beds: 0 }),
    property('rent-office', { type: 'مكتب', investment: true, purpose: 'للإيجار', beds: 0 }),
    property('unclassified-home'),
  ];
  const result = rankHomeMatches(catalogue, preferences({ purpose: 'invest', minBeds: 0 }));
  assert.deepEqual(result.map(match => match.property.slug), ['land', 'office']);
  assert.deepEqual(rankHomeMatches(catalogue, preferences({ purpose: 'invest', minBeds: 2 })), []);
});

test('city, budget and minimum bedrooms remain hard constraints regardless of priorities', () => {
  const catalogue = [
    property('eligible', { newBuild: false }),
    property('wrong-city', { city: 'جدة', newBuild: true }),
    property('over-budget', { price: 2_000_001, newBuild: true }),
    property('too-small', { beds: 2, newBuild: true }),
  ];
  const result = rankHomeMatches(catalogue, preferences({ maxBudget: 2_000_000, priorities: ['newBuild'] }));
  assert.deepEqual(result.map(match => match.property.slug), ['eligible']);
  assert.ok(result[0].reasons.includes('سعره عند الحد الأقصى لميزانيتك'));
});

test('optional priorities rank eligible homes without silently excluding other matching homes', () => {
  const catalogue = [
    property('cheapest', { price: 1_000_000 }),
    property('one-priority', { price: 1_500_000, newBuild: true }),
    property('two-priorities', { newBuild: true, features: ['مجلس مستقل'] }),
  ];
  const untouchedOrder = catalogue.map(item => item.slug);
  const result = rankHomeMatches(catalogue, preferences({ priorities: ['newBuild', 'privacy'] }));
  assert.deepEqual(result.map(match => match.property.slug), ['two-priorities', 'one-priority', 'cheapest']);
  assert.ok(result[0].reasons.includes('ميزة للخصوصية: مجلس مستقل'));
  assert.deepEqual(catalogue.map(item => item.slug), untouchedOrder);
});

test('private parking alone is not presented as home privacy', () => {
  const result = rankHomeMatches([property('parking', { features: ['مواقف خاصة'] })], preferences({ priorities: ['privacy'] }));
  assert.deepEqual(result[0].matchedPriorities, []);
  assert.ok(result[0].reasons.every(reason => !reason.includes('خصوصية')));
});

test('annual rental ceilings never accidentally use the purchase budget or mix purchase results', () => {
  const result = rankHomeMatches(properties, preferences({ purpose: 'rent', city: 'جدة', maxBudget: 155_000, minBeds: 3 }));
  assert.deepEqual(result.map(match => match.property.slug), ['rawdah-rental-jeddah']);
  assert.equal(rankHomeMatches(properties, preferences({ purpose: 'rent', city: 'جدة', maxBudget: 154_999, minBeds: 3 })).length, 0);
});

test('a deliberate budget suggestion preserves purpose, city and bedroom constraints', () => {
  const catalogue = [
    property('home', { price: 2_200_000, beds: 4 }),
    property('cheaper-land', { type: 'أرض', investment: true, price: 100_000, beds: 4 }),
    property('elsewhere', { city: 'جدة', price: 1_900_000, beds: 4 }),
  ];
  const prefs = preferences({ maxBudget: 2_000_000, minBeds: 4 });
  assert.equal(rankHomeMatches(catalogue, prefs).length, 0);
  const explanation = explainNoHomeMatches(catalogue, prefs);
  assert.equal(explanation.suggestedBudget, 2_200_000);
  assert.equal(explanation.suggestedMinBeds, undefined);
  assert.deepEqual(rankHomeMatches(catalogue, { ...prefs, maxBudget: explanation.suggestedBudget! })
    .map(match => match.property.slug), ['home']);
});

test('a deliberate bedroom suggestion preserves the current budget and residential type', () => {
  const catalogue = [property('home', { beds: 2 }), property('big-over-budget', { beds: 5, price: 3_000_000 })];
  const prefs = preferences({ maxBudget: 2_000_000, minBeds: 4 });
  const explanation = explainNoHomeMatches(catalogue, prefs);
  assert.equal(explanation.suggestedMinBeds, 2);
  assert.equal(explanation.suggestedBudget, 3_000_000);
  assert.deepEqual(rankHomeMatches(catalogue, { ...prefs, minBeds: explanation.suggestedMinBeds! })
    .map(match => match.property.slug), ['home']);
});

test('a city with no eligible homes has no misleading budget or bedroom relaxation', () => {
  const explanation = explainNoHomeMatches(properties, preferences({ city: 'الرياض', purpose: 'rent' }));
  assert.ok(explanation.message.includes('لا توجد حاليًا منازل للإيجار في الرياض'));
  assert.equal(explanation.suggestedBudget, undefined);
  assert.equal(explanation.suggestedMinBeds, undefined);
});

test('preference restoration rejects malformed, unsupported and stale data', () => {
  const cities = ['الرياض', 'جدة'];
  for (const value of [null, [], 'saved', {}, { ...preferences(), city: 'مدينة غير موجودة' },
    { ...preferences(), purpose: 'anything' }, { ...preferences(), maxBudget: NaN },
    { ...preferences(), maxBudget: -1 }, { ...preferences(), minBeds: 1.5 }, { ...preferences(), minBeds: 11 },
    { ...preferences(), priorities: ['unknown'] }, { ...preferences(), priorities: null }]) {
    assert.equal(parseHomePreferences(value, cities), null);
  }
  const saved = parseHomePreferences(preferences({ priorities: ['newBuild', 'newBuild'] }), cities);
  assert.deepEqual(saved?.priorities, ['newBuild']);
});

test('numeric budgets accept correctly grouped Arabic, Persian and Latin numerals', () => {
  for (const value of ['2,000,000', '٢٬٠٠٠٬٠٠٠', '۲۰۰۰۰۰۰', '2000000', '2 000 000']) {
    assert.equal(parseHomeBudget(value), 2_000_000);
  }
  for (const value of ['', ' ', '1e6', '-100', 'Infinity', '1,5', '2.5', '0', '1000000001']) {
    assert.equal(parseHomeBudget(value), null);
  }
});

test('invalid numeric constraints fail closed instead of returning the full catalogue', () => {
  assert.deepEqual(rankHomeMatches(properties, preferences({ maxBudget: NaN })), []);
  assert.deepEqual(rankHomeMatches(properties, preferences({ maxBudget: Infinity })), []);
  assert.deepEqual(rankHomeMatches(properties, preferences({ minBeds: -1 })), []);
});
