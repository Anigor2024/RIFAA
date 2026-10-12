import test from 'node:test';
import assert from 'node:assert/strict';
import { properties } from '../lib/atheeldar-data';
import {
  DEFAULT_PROPERTY_SEARCH, createPropertySearch, filterProperties, normalizeArabic,
  parsePropertyQuery, readPropertySearchParams, writePropertySearchParams,
} from '../lib/property-search';

test('Arabic rental request infers city, type, purpose and a thousand-denominated budget', () => {
  const query = 'شقة للإيجار في جدة أقل من 200 ألف';
  const parsed = parsePropertyQuery(query);
  assert.deepEqual(parsed.filters, { city: 'جدة', type: 'شقة', purpose: 'للإيجار', max: 200000 });
  assert.deepEqual(parsed.terms, []);
  assert.deepEqual(filterProperties(properties, createPropertySearch(query)).map(p => p.slug), ['rawdah-rental-jeddah']);
});

test('normalization handles Arabic/Persian digits, diacritics, tatweel, decimal and group separators', () => {
  assert.equal(normalizeArabic('شُـقّة في جِدّة ۲۰۰٬۰۰۰ و١٫٥'), 'شقه في جده 200000 و1.5');
  assert.equal(createPropertySearch('بنتهاوس بالرياض بميزانية ۴٫۵ مليون و۴ غرف').max, 4500000);
  assert.equal(createPropertySearch('بنتهاوس بالرياض بميزانية ۴٫۵ مليون و۴ غرف').beds, 4);
  assert.equal(createPropertySearch('شقة بجدة حتى ٢٠٠٬٠٠٠ ريال').max, 200000);
});

test('Arabic numbers, no-space conjunctions, room counts and floor area remain independent', () => {
  const query = 'شقة للإيجار بجدة أقل من ٢٠٠ ألف و٣ غرف و٢٠٠ متر مربع';
  const state = createPropertySearch(query);
  assert.equal(state.max, 200000);
  assert.equal(state.beds, 3);
  assert.equal(state.minArea, 200);
  assert.deepEqual(parsePropertyQuery(query).terms, []);
  assert.deepEqual(filterProperties(properties, state).map(p => p.slug), ['rawdah-rental-jeddah']);
});

test('plural millions are parsed while square metre notation never becomes a monetary unit', () => {
  const state = createPropertySearch('فيلا في الرياض أقل من ٧ ملايين و٥ غرف مساحة ٦٠٠ م²');
  assert.equal(state.max, 7000000);
  assert.equal(state.beds, 5);
  assert.equal(state.minArea, 600);
  assert.deepEqual(filterProperties(properties, state).map(p => p.slug), ['villa-al-sidr-hittin']);
  const areaOnly = createPropertySearch('أرض مساحة ٩٠٠ متر مربع');
  assert.equal(areaOnly.max, DEFAULT_PROPERTY_SEARCH.max);
  assert.equal(areaOnly.minArea, 900);
  assert.deepEqual(filterProperties(properties, areaOnly).map(p => p.slug), ['alnarjis-investment-land']);
});

test('an upper area limit stays separate from the price ceiling', () => {
  const state = createPropertySearch('شقة للإيجار في جدة مساحة أقل من ٢٢٠ متر مربع حتى ٢٠٠ ألف');
  assert.equal(state.maxArea, 220);
  assert.equal(state.minArea, 0);
  assert.equal(state.max, 200000);
  assert.deepEqual(filterProperties(properties, state).map(p => p.slug), ['rawdah-rental-jeddah']);
});

test('numbers without a price cue are not silently treated as budgets', () => {
  const state = createPropertySearch('فيلا 5 غرف و620 متر');
  assert.equal(state.max, DEFAULT_PROPERTY_SEARCH.max);
  assert.equal(state.beds, 5);
  assert.equal(state.minArea, 620);
  assert.deepEqual(parsePropertyQuery('5 غرف').filters, { beds: 5 });
});

test('Arabic million shorthand is contextual and cannot swallow an explicitly named area', () => {
  const budget = createPropertySearch('فيلا بالرياض أقل من 7 م و5 غرف');
  assert.equal(budget.max, 7000000);
  assert.equal(budget.maxArea, undefined);
  const area = createPropertySearch('أرض مساحة أقل من ٩٠٠ م بسعر ٣ مليون');
  assert.equal(area.maxArea, 900);
  assert.equal(area.max, 3000000);
});

test('property titles, districts and unmatched keywords actually affect results', () => {
  assert.deepEqual(filterProperties(properties, createPropertySearch('السِدر')).map(p => p.slug), ['villa-al-sidr-hittin']);
  assert.deepEqual(filterProperties(properties, createPropertySearch('في حي الروضة')).map(p => p.slug), ['rawdah-rental-jeddah']);
  assert.equal(filterProperties(properties, createPropertySearch('عقار زمردي غيرموجود')).length, 0);
  assert.equal(parsePropertyQuery('الرياضيات').filters.city, undefined);
});

test('written room numbers and feature keywords work together', () => {
  const state = createPropertySearch('فيلا خمس غرف ومسبح');
  assert.equal(state.beds, 5);
  assert.deepEqual(filterProperties(properties, state).map(p => p.slug).sort(), ['almarjan-villa-jeddah', 'villa-al-sidr-hittin'].sort());
});

test('no-result constraints are not relaxed behind the user’s back', () => {
  const state = createPropertySearch('شقة للإيجار في جدة أقل من 100 ألف');
  assert.equal(filterProperties(properties, state).length, 0);
  assert.equal(filterProperties(properties, { ...DEFAULT_PROPERTY_SEARCH }).length, properties.length);
});

test('URL state round-trips every control and overrides inferred query filters', () => {
  const state = {
    ...createPropertySearch('شقة للإيجار في جدة أقل من 200 ألف'),
    city: 'الكل' as const, type: 'الكل' as const, max: DEFAULT_PROPERTY_SEARCH.max,
    beds: 2, minArea: 150, residentialOnly: true, view: 'map' as const, sort: 'priceLow' as const,
  };
  const params = writePropertySearchParams(state);
  assert.equal(params.get('city'), 'الكل');
  assert.equal(params.get('type'), 'الكل');
  assert.equal(params.get('max'), '10000000');
  assert.equal(params.get('residentialOnly'), '1');
  assert.deepEqual(readPropertySearchParams(params), state);
});

test('URL normalization accepts Arabic numeric filters and tolerates invalid values', () => {
  const valid = readPropertySearchParams(new URLSearchParams('city=جدة&purpose=rent&max=٢٠٠٠٠٠&beds=٣&view=map'));
  assert.equal(valid.max, 200000);
  assert.equal(valid.beds, 3);
  assert.equal(valid.purpose, 'للإيجار');
  const invalid = readPropertySearchParams(new URLSearchParams('city=الرياضيات&max=-10&beds=900&minArea=Infinity&sort=oops&view=anything&type=برج&purpose=unknown'));
  assert.deepEqual(invalid, DEFAULT_PROPERTY_SEARCH);
});

test('reset removes query and all search controls while preserving unrelated parameters', () => {
  const params = writePropertySearchParams({ ...DEFAULT_PROPERTY_SEARCH }, new URLSearchParams('q=فيلا&city=جدة&type=فيلا&purpose=rent&max=200000&beds=3&quick=جديد&view=map&sort=area&minArea=90&maxArea=500&residentialOnly=1&utm_source=portfolio'));
  assert.equal(params.toString(), 'utm_source=portfolio');
  assert.deepEqual(readPropertySearchParams(params), DEFAULT_PROPERTY_SEARCH);
});

test('a removed query-derived upper area filter stays removed after reload', () => {
  const state = { ...createPropertySearch('شقة مساحة أقل من ٢٢٠ متر مربع'), maxArea: undefined };
  assert.deepEqual(readPropertySearchParams(writePropertySearchParams(state)), state);
});

test('guided residential rental search excludes offices; investment aliases mean purchase assets', () => {
  const rentals = filterProperties(properties, { ...DEFAULT_PROPERTY_SEARCH, purpose: 'للإيجار', residentialOnly: true });
  assert.deepEqual(rentals.map(p => p.slug), ['rawdah-rental-jeddah']);
  const investment = readPropertySearchParams(new URLSearchParams('purpose=invest'));
  assert.equal(investment.purpose, 'للبيع');
  assert.equal(investment.quick, 'استثماري');
  assert.deepEqual(filterProperties(properties, investment).map(p => p.slug).sort(), ['alnarjis-investment-land', 'jeddah-waterfront-residence'].sort());
});

test('sorting works without mutating the catalog', () => {
  const original = properties.map(p => p.slug);
  const sorted = filterProperties(properties, { ...DEFAULT_PROPERTY_SEARCH, sort: 'priceLow' });
  assert.equal(sorted[0].slug, 'rawdah-rental-jeddah');
  assert.deepEqual(properties.map(p => p.slug), original);
});
