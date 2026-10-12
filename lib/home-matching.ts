import type { Property } from './atheeldar-data';

export type HomePurpose = 'buy' | 'rent' | 'invest';
export type HomePriority = 'newBuild' | 'privacy';

export type HomePreferences = {
  purpose: HomePurpose;
  city: string;
  maxBudget: number;
  minBeds: number;
  priorities: HomePriority[];
};

export type HomeMatch = {
  property: Property;
  reasons: string[];
  matchedPriorities: HomePriority[];
};

export type HomeMatchExplanation = {
  message: string;
  suggestedBudget?: number;
  suggestedMinBeds?: number;
};

export const HOME_FINDER_STORAGE_KEY = 'atheeldar-home-preferences-v1';

export const DEFAULT_HOME_PREFERENCES: HomePreferences = {
  purpose: 'buy',
  city: 'الرياض',
  maxBudget: 4_000_000,
  minBeds: 3,
  priorities: [],
};

const residentialTypes = new Set<Property['type']>(['فيلا', 'شقة', 'بنتهاوس', 'تاون هاوس']);
const purposes: readonly HomePurpose[] = ['buy', 'rent', 'invest'];
const priorities: readonly HomePriority[] = ['newBuild', 'privacy'];
const privacyFeatures = new Set([
  'مجلس مستقل', 'فناء داخلي', 'حديقة خلفية', 'تراس خاص', 'مسبح خاص', 'مدخل مستقل',
]);
const numberFormat = new Intl.NumberFormat('ar-SA');

/** Accept familiar Arabic/Latin numerals, without coercing blanks, exponents or negatives. */
export function parseHomeBudget(value: string): number | null {
  const normalized = value.trim()
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x06f0));
  if (!/^(?:\d+|\d{1,3}(?:[,٬، ]\d{3})+)$/.test(normalized)) return null;
  const amount = Number(normalized.replace(/[,٬، ]/g, ''));
  return Number.isSafeInteger(amount) && amount > 0 && amount <= 1_000_000_000 ? amount : null;
}

function validConstraints(value: HomePreferences): boolean {
  return purposes.includes(value.purpose)
    && typeof value.city === 'string' && value.city.trim().length > 0
    && Number.isSafeInteger(value.maxBudget) && value.maxBudget > 0 && value.maxBudget <= 1_000_000_000
    && Number.isInteger(value.minBeds) && value.minBeds >= 0 && value.minBeds <= 10
    && Array.isArray(value.priorities) && value.priorities.every(priority => priorities.includes(priority));
}

/** A stored value is untrusted: validate every constraint before restoring it. */
export function parseHomePreferences(value: unknown, cities: readonly string[]): HomePreferences | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const candidate = value as HomePreferences;
  if (!validConstraints(candidate) || !cities.includes(candidate.city)) return null;
  return {
    purpose: candidate.purpose,
    city: candidate.city,
    maxBudget: candidate.maxBudget,
    minBeds: candidate.minBeds,
    priorities: [...new Set(candidate.priorities)],
  };
}

/** Rent is annual. Investment means acquiring an advertised investment asset, not leasing one. */
export function isHomePurposeEligible(property: Property, purpose: HomePurpose): boolean {
  if (purpose === 'invest') return property.purpose === 'للبيع' && property.investment === true;
  if (purpose !== 'buy' && purpose !== 'rent') return false;
  return residentialTypes.has(property.type)
    && property.purpose === (purpose === 'rent' ? 'للإيجار' : 'للبيع');
}

function eligibleInCity(items: readonly Property[], preferences: HomePreferences): Property[] {
  return items.filter(property => isHomePurposeEligible(property, preferences.purpose)
    && property.city === preferences.city && Number.isFinite(property.price) && property.price > 0);
}

/** Hard constraints are applied before ranking; optional preferences never admit an ineligible home. */
export function rankHomeMatches(items: readonly Property[], preferences: HomePreferences): HomeMatch[] {
  if (!validConstraints(preferences)) return [];
  return eligibleInCity(items, preferences)
    .filter(property => property.price <= preferences.maxBudget && property.beds >= preferences.minBeds)
    .map(property => {
      const matchedPriorities: HomePriority[] = [];
      const difference = preferences.maxBudget - property.price;
      const reasons = [preferences.purpose === 'rent' ? 'منزل معروض للإيجار السنوي'
        : preferences.purpose === 'invest' ? 'معروض للبيع ومصنف للاستثمار' : 'منزل معروض للبيع'];
      reasons.push(difference === 0 ? 'سعره عند الحد الأقصى لميزانيتك'
        : `أقل من ميزانيتك${preferences.purpose === 'rent' ? ' السنوية' : ''} بـ ${numberFormat.format(difference)} ر.س`);
      if (preferences.minBeds > 0) reasons.push(`${numberFormat.format(property.beds)} غرف؛ يحقق الحد الأدنى الذي اخترته`);
      if (preferences.priorities.includes('newBuild') && property.newBuild === true) {
        matchedPriorities.push('newBuild');
        reasons.push('بناء جديد، حسب تفضيلك');
      }
      const privacyFeature = property.features.find(feature => privacyFeatures.has(feature));
      if (preferences.priorities.includes('privacy') && privacyFeature) {
        matchedPriorities.push('privacy');
        reasons.push(`ميزة للخصوصية: ${privacyFeature}`);
      }
      return { property, reasons, matchedPriorities };
    })
    .sort((a, b) => b.matchedPriorities.length - a.matchedPriorities.length
      || a.property.price - b.property.price
      || b.property.area - a.property.area
      || a.property.slug.localeCompare(b.property.slug));
}

/** Every suggested change creates a match by changing just the named constraint. */
export function explainNoHomeMatches(items: readonly Property[], preferences: HomePreferences): HomeMatchExplanation {
  if (!validConstraints(preferences)) return { message: 'راجع المدينة والميزانية وعدد الغرف قبل عرض الخيارات.' };
  const candidates = eligibleInCity(items, preferences);
  const label = preferences.purpose === 'rent' ? 'منازل للإيجار'
    : preferences.purpose === 'invest' ? 'أصول مصنفة للاستثمار ومعروضة للبيع' : 'منازل للبيع';
  if (candidates.length === 0) return {
    message: `لا توجد حاليًا ${label} في ${preferences.city} ضمن العقارات المعروضة. يمكنك تعديل المدينة أو العودة لاحقًا.`,
  };
  const withBedrooms = candidates.filter(property => property.beds >= preferences.minBeds);
  const withinBudget = candidates.filter(property => property.price <= preferences.maxBudget);
  const minimumBudget = withBedrooms.length ? Math.min(...withBedrooms.map(property => property.price)) : undefined;
  const availableBedrooms = withinBudget.length ? Math.max(...withinBudget.map(property => property.beds)) : undefined;
  return {
    message: `لا يوجد عقار في ${preferences.city} يجمع ميزانية حتى ${numberFormat.format(preferences.maxBudget)} ر.س${preferences.purpose === 'rent' ? ' سنويًا' : ''}${preferences.minBeds > 0 ? ` و${numberFormat.format(preferences.minBeds)} غرف نوم فأكثر` : ''}. لم نغيّر شروطك؛ يمكنك تجربة أحد التعديلات التالية.`,
    ...(minimumBudget !== undefined && minimumBudget > preferences.maxBudget ? { suggestedBudget: minimumBudget } : {}),
    ...(availableBedrooms !== undefined && availableBedrooms < preferences.minBeds ? { suggestedMinBeds: availableBedrooms } : {}),
  };
}
