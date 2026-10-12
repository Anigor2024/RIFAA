import type { Property } from './atheeldar-data';

export const PROPERTY_CITIES = ['الكل', 'الرياض', 'جدة', 'الخبر', 'الدرعية'] as const;
export const PROPERTY_TYPES = ['الكل', 'فيلا', 'شقة', 'بنتهاوس', 'تاون هاوس', 'مكتب', 'أرض'] as const;
export const PROPERTY_PURPOSES = ['الكل', 'للبيع', 'للإيجار'] as const;
export const PROPERTY_QUICK_FILTERS = ['الكل', 'فاخر', 'موثق', 'جديد', 'استثماري'] as const;
export const PROPERTY_SORTS = ['match', 'priceLow', 'priceHigh', 'score', 'area'] as const;

export type PropertySearchState = {
  query: string;
  city: (typeof PROPERTY_CITIES)[number];
  type: (typeof PROPERTY_TYPES)[number];
  purpose: (typeof PROPERTY_PURPOSES)[number];
  max: number;
  beds: number;
  minArea: number;
  maxArea?: number;
  residentialOnly: boolean;
  quick: (typeof PROPERTY_QUICK_FILTERS)[number];
  sort: (typeof PROPERTY_SORTS)[number];
  view: 'list' | 'map';
};

export const DEFAULT_PROPERTY_SEARCH: PropertySearchState = {
  query: '', city: 'الكل', type: 'الكل', purpose: 'الكل', max: 10_000_000,
  beds: 0, minArea: 0, maxArea: undefined, residentialOnly: false, quick: 'الكل', sort: 'match', view: 'list',
};

export type ParsedPropertyQuery = {
  query: string;
  filters: Partial<PropertySearchState>;
  terms: string[];
  recognized: string[];
};

/** Search normalization only: displayed Arabic is always preserved. */
export function normalizeArabic(value: string): string {
  return value.normalize('NFKC')
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/[ىی]/g, 'ي').replace(/ک/g, 'ك')
    .replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/٫/g, '.').replace(/(\d)[,٬،](?=\d)/g, '$1')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

const BEFORE = '(^|[^\\p{L}\\p{N}])';
const AFTER = '(?=$|[^\\p{L}\\p{N}])';
const amount = '(\\d+(?:\\.\\d+)?)';
const monetaryUnit = '(مليار|ملايين|مليون|الاف|الف|million|thousand|k|m)';
const currency = '(?:ريال(?:\\s*سعودي)?|ر\\.?\\s*س\\.?|sar)';
const areaUnit = '(?:متر(?:ا)?\\s*مربع(?:ا)?|امتار(?:\\s*مربعه)?|متر(?:ا)?|م2|m2|sqm|م)';
const pricePrefix = '(?:ب?ميزانيه(?:\\s*(?:تبلغ|قدرها))?|ب?سعر(?:ها|ه)?|حد\\s*السعر|ب?حد\\s*اقصي|اقل\\s*من|لا\\s*(?:يزيد|تزيد|يتجاوز|تتجاوز)(?:\\s*عن)?|تحت|حتي|ب?حدود)';

const stopWords = new Set([
  'ابحث', 'البحث', 'اريد', 'عايز', 'عاوز', 'ابي', 'ابغي', 'احتاج', 'عندي', 'اود', 'لي',
  'عن', 'في', 'و', 'او', 'من', 'الي', 'علي', 'مع', 'لدي', 'ب', 'هو', 'هي', 'يكون', 'تكون',
  'عقار', 'عقارات', 'عقاري', 'سكن', 'للسكن', 'سكني', 'سكنيه', 'حي', 'الحي', 'مدينه',
  'اقل', 'اكثر', 'فوق', 'تحت', 'لا', 'تقل', 'يقل', 'يزيد', 'تزيد', 'عن', 'حتي', 'بحد', 'اقصي',
  'حد', 'سعر', 'السعر', 'سعرها', 'سعره', 'ميزانيه', 'مساحه', 'مساحتها', 'المساحه',
  'غرف', 'غرفه', 'نوم', 'النوم', 'فقط', 'تقريبا', 'ريال', 'سعودي', 'سنوي', 'سنويا',
  'شراء', 'ايجار', 'رجاء', 'فضلك', 'please', 'find', 'in', 'with', 'and', 'for',
]);

const digitWords: Record<string, number> = {
  واحد: 1, واحده: 1, اثنين: 2, اثنتين: 2, اثنان: 2, اثنتان: 2,
  ثلاث: 3, ثلاثه: 3, اربع: 4, اربعه: 4, خمس: 5, خمسه: 5,
  ست: 6, سته: 6, سبع: 7, سبعه: 7, ثمان: 8, ثماني: 8, ثمانيه: 8,
  تسع: 9, تسعه: 9, عشر: 10, عشره: 10,
};

function unitMultiplier(unit = ''): number {
  if (/^(مليار)$/.test(unit)) return 1_000_000_000;
  if (/^(مليون|ملايين|million|m)$/.test(unit)) return 1_000_000;
  if (/^(الف|الاف|thousand|k)$/.test(unit)) return 1_000;
  return 1;
}

/** Deterministic, local parsing; no remote AI or geolocation service is implied. */
export function parsePropertyQuery(input: string): ParsedPropertyQuery {
  const query = input.trim().slice(0, 300);
  let remaining = normalizeArabic(query);
  const filters: Partial<PropertySearchState> = {};
  const recognized: string[] = [];
  const consume = (expression: RegExp): RegExpMatchArray | null => {
    const match = remaining.match(expression);
    if (match) remaining = remaining.slice(0, match.index) + ' ' + remaining.slice((match.index ?? 0) + match[0].length);
    return match;
  };
  const named = <T extends string>(choices: ReadonlyArray<readonly [T, string]>) => {
    for (const [value, pattern] of choices) {
      if (consume(new RegExp(`${BEFORE}(?:و)?(?:ب|ل)?(?:${pattern})${AFTER}`, 'u'))) {
        recognized.push(value);
        return value;
      }
    }
    return undefined;
  };

  filters.city = named([
    ['الرياض', 'الرياض|رياض|riyadh'], ['جدة', 'جده|jeddah'],
    ['الخبر', 'الخبر|خبر|khobar'], ['الدرعية', 'الدرعيه|درعيه|diriyah'],
  ] as const);
  filters.type = named([
    ['تاون هاوس', 'تاون\\s*هاوس|تاون\\s*هاوز|townhouse'],
    ['بنتهاوس', 'بنت\\s*هاوس|بنتهاوس|penthouse'],
    ['فيلا', 'فيلا|فيله|فلل|villa'], ['شقة', 'شقه|شقق|apartment'],
    ['مكتب', 'مكتب|مكاتب|office'], ['أرض', 'ارض|اراضي|land'],
  ] as const);
  filters.purpose = named([
    ['للإيجار', 'للايجار|للاجار|ايجار|اجار|استيجار|للاستيجار|استاجر|استاجار|rent|rental'],
    ['للبيع', 'للبيع|بيع|شراء|للشراء|تملك|اشتري|buy|sale|purchase'],
  ] as const);
  filters.quick = named([
    ['استثماري', 'استثمار(?:ي|يه)?|عائد|عوائد|investment'],
    ['جديد', 'جديد(?:ه)?|حديث(?:ه)?|new'],
    ['فاخر', 'فاخر(?:ه)?|فخم(?:ه)?|luxury'], ['موثق', 'موثق(?:ه)?|verified'],
  ] as const);

  // Consume room and area quantities before money so 5 rooms / 200 m² cannot become a budget.
  const roomNumber = `(?:\\d{1,2}|${Object.keys(digitWords).join('|')})`;
  const roomMatch = consume(new RegExp(`${BEFORE}(?:و)?(${roomNumber})\\s*(?:غرفه|غرف)(?:\\s*(?:نوم|النوم))?${AFTER}`, 'u'));
  if (roomMatch) {
    const beds = digitWords[roomMatch[2]] ?? Number(roomMatch[2]);
    if (beds >= 0 && beds <= 20) filters.beds = beds;
  } else if (consume(new RegExp(`${BEFORE}(?:غرفتين|غرفتان)(?:\\s*نوم)?${AFTER}`, 'u'))) {
    filters.beds = 2;
  } else if (consume(new RegExp(`${BEFORE}غرفه\\s*(?:واحده|نوم)${AFTER}`, 'u'))) {
    filters.beds = 1;
  }
  if (filters.beds !== undefined) recognized.push(`${filters.beds} غرف فأكثر`);

  // Arabic «م» is ambiguous: with a price cue it means million, unless a preceding area cue owns it.
  const shorthandPriceExpression = new RegExp(`${BEFORE}${pricePrefix}\\s*:?\\s*${amount}\\s*م${AFTER}`, 'u');
  const shorthandPrice = remaining.match(shorthandPriceExpression);
  if (shorthandPrice && !/(?:مساحه|مساحتها)$/.test(remaining.slice(0, shorthandPrice.index).trim())) {
    const value = Number(shorthandPrice[2]) * 1_000_000;
    if (value > 0 && value <= 1_000_000_000) {
      consume(shorthandPriceExpression);
      filters.max = Math.round(value);
    }
  }

  const areaMatch = consume(new RegExp(`${BEFORE}(?:و)?(?:(?:ب?مساحه|مساحتها)\\s*)?(?:(اقل\\s*من|حتي|لا\\s*تزيد\\s*عن)|(اكثر\\s*من|من|لا\\s*تقل\\s*عن|علي\\s*الاقل))?\\s*${amount}\\s*${areaUnit}${AFTER}`, 'u'));
  if (areaMatch) {
    const area = Number(areaMatch[4]);
    if (area > 0 && area <= 100_000) {
      if (areaMatch[2]) filters.maxArea = area;
      else filters.minArea = area;
      recognized.push(`المساحة ${areaMatch[2] ? 'حتى' : 'من'} ${area} م²`);
    }
  }

  // Full units work with or without an explicit price cue. Bare numbers require a price cue/currency.
  const budget = consume(new RegExp(`${BEFORE}(?:${pricePrefix}\\s*:?\\s*)?${amount}\\s*${monetaryUnit}(?:\\s*(?:و\\s*)?(نصف|نص))?(?:\\s*${currency})?${AFTER}`, 'u'))
    ?? consume(new RegExp(`${BEFORE}${pricePrefix}\\s*:?\\s*${amount}\\s*(${currency})?${AFTER}`, 'u'))
    ?? consume(new RegExp(`${BEFORE}${amount}\\s*(${currency})${AFTER}`, 'u'));
  if (budget) {
    const value = Math.round((Number(budget[2]) + (budget[4] ? 0.5 : 0)) * unitMultiplier(budget[3]));
    if (Number.isFinite(value) && value > 0 && value <= 1_000_000_000) {
      filters.max = value;
    }
  }
  if (filters.max !== undefined) recognized.push(`حتى ${filters.max.toLocaleString('ar-SA')} ر.س`);

  // Undefined properties must not overwrite the useful defaults when callers spread filters.
  for (const key of Object.keys(filters) as Array<keyof PropertySearchState>) {
    if (filters[key] === undefined) delete filters[key];
  }
  const terms = [...new Set((remaining.match(/[\p{L}\p{N}]+/gu) ?? [])
    .map(word => word.startsWith('و') && word.length > 3 ? word.slice(1) : word)
    .filter(word => !stopWords.has(word) && !(word.startsWith('ب') && stopWords.has(word.slice(1))) && word.length > 1))];
  return { query, filters, terms, recognized };
}

export function createPropertySearch(query = ''): PropertySearchState {
  const parsed = parsePropertyQuery(query);
  return { ...DEFAULT_PROPERTY_SEARCH, ...parsed.filters, query: parsed.query };
}

function searchWordVariants(word: string): string[] {
  const variants = [word];
  if (word.startsWith('ال') && word.length > 3) variants.push(word.slice(2));
  if (/^[بل]/.test(word) && word.length > 3) {
    variants.push(word.slice(1));
    if (/^[بل]ال/.test(word)) variants.push(word.slice(3));
  }
  return variants;
}

export function filterProperties(items: readonly Property[], state: PropertySearchState): Property[] {
  const { terms } = parsePropertyQuery(state.query);
  return items.filter(property => {
    if ((state.city !== 'الكل' && property.city !== state.city)
      || (state.type !== 'الكل' && property.type !== state.type)
      || (state.purpose !== 'الكل' && property.purpose !== state.purpose)
      || property.price > state.max || property.beds < state.beds
      || property.area < state.minArea || (state.maxArea !== undefined && property.area > state.maxArea)) return false;
    if (state.residentialOnly && (property.type === 'مكتب' || property.type === 'أرض')) return false;
    if (state.quick === 'فاخر' && property.score < 92) return false;
    if (state.quick === 'موثق' && !property.verified) return false;
    if (state.quick === 'جديد' && !property.newBuild) return false;
    if (state.quick === 'استثماري' && !property.investment) return false;
    if (terms.length) {
      const words = normalizeArabic([
        property.title, property.city, property.district, property.type, property.purpose,
        property.badge, property.description, ...property.features,
      ].join(' ')).match(/[\p{L}\p{N}]+/gu) ?? [];
      const haystack = new Set(words.flatMap(searchWordVariants));
      if (!terms.every(term => searchWordVariants(term).some(word => haystack.has(word)))) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (state.sort) {
      case 'priceLow': return a.price - b.price;
      case 'priceHigh': return b.price - a.price;
      case 'score': return b.score - a.score;
      case 'area': return b.area - a.area;
      default: return (b.score + (b.featured ? 4 : 0)) - (a.score + (a.featured ? 4 : 0));
    }
  });
}

function optionValue<T extends string>(raw: string | null, options: readonly T[]): T | undefined {
  if (!raw) return undefined;
  const normalized = normalizeArabic(raw);
  return options.find(option => normalizeArabic(option) === normalized);
}

function numberValue(raw: string | null, upper: number): number | undefined {
  if (raw === null || !/^[\d٠-٩۰-۹,.٫٬،]+$/.test(raw)) return undefined;
  const value = Number(normalizeArabic(raw));
  return Number.isFinite(value) && value >= 0 && value <= upper ? Math.round(value) : undefined;
}

/** q alone is inferred; explicit valid controls override that inference after reload or sharing. */
export function readPropertySearchParams(params: URLSearchParams, fallbackQuery = ''): PropertySearchState {
  const state = createPropertySearch(params.has('q') ? params.get('q') ?? '' : fallbackQuery);
  state.city = optionValue(params.get('city'), PROPERTY_CITIES) ?? state.city;
  state.type = optionValue(params.get('type'), PROPERTY_TYPES) ?? state.type;
  const purpose = params.get('purpose');
  const purposeAlias: Record<string, PropertySearchState['purpose']> = {
    buy: 'للبيع', sale: 'للبيع', purchase: 'للبيع', rent: 'للإيجار', rental: 'للإيجار', all: 'الكل',
  };
  state.purpose = optionValue(purpose, PROPERTY_PURPOSES) ?? purposeAlias[purpose?.toLowerCase() ?? ''] ?? state.purpose;
  if (purpose === 'invest' || purpose === 'investment') {
    state.purpose = 'للبيع';
    state.quick = 'استثماري';
  }
  state.max = numberValue(params.get('max'), 1_000_000_000) ?? state.max;
  state.beds = numberValue(params.get('beds'), 20) ?? state.beds;
  state.minArea = numberValue(params.get('minArea'), 100_000) ?? state.minArea;
  state.maxArea = params.get('maxArea') === 'all' ? undefined : numberValue(params.get('maxArea'), 100_000) ?? state.maxArea;
  const residentialOnly = params.get('residentialOnly');
  if (residentialOnly === '1' || residentialOnly === 'true') state.residentialOnly = true;
  else if (residentialOnly === '0' || residentialOnly === 'false') state.residentialOnly = false;
  state.quick = optionValue(params.get('quick'), PROPERTY_QUICK_FILTERS) ?? state.quick;
  state.sort = optionValue(params.get('sort'), PROPERTY_SORTS) ?? state.sort;
  state.view = optionValue(params.get('view'), ['list', 'map'] as const) ?? state.view;
  return state;
}

export function writePropertySearchParams(state: PropertySearchState, base?: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams(base);
  const inferred = createPropertySearch(state.query);
  const keys = ['city', 'type', 'purpose', 'max', 'beds', 'minArea', 'maxArea', 'quick', 'sort', 'view'] as const;
  if (state.query.trim()) params.set('q', state.query.trim());
  else params.delete('q');
  if (state.residentialOnly) params.set('residentialOnly', '1');
  else params.delete('residentialOnly');
  for (const key of keys) {
    const value = state[key];
    // Preserve overrides of a query even when the selected value happens to be the default.
    if (value !== undefined && (value !== DEFAULT_PROPERTY_SEARCH[key] || value !== inferred[key])) params.set(key, String(value));
    else if (key === 'maxArea' && inferred.maxArea !== undefined && value === undefined) params.set('maxArea', 'all');
    else params.delete(key);
  }
  return params;
}
