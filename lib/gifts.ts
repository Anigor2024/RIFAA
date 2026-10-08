import { DEMO_PRODUCTS } from '@/data/products';
import type { Product } from '@/types';

export type GiftRecipient = 'women' | 'men' | 'kids';
export type GiftOccasion = 'eid' | 'celebration' | 'gratitude' | 'everyday';
export type GiftMood = 'understated' | 'statement' | 'practical';
export type GiftBudget = '1000' | '2000' | '3500' | 'any';

export interface GiftPreferences {
  recipient: GiftRecipient;
  occasion: GiftOccasion;
  mood: GiftMood;
  budget: GiftBudget;
}

export interface GiftRecommendation {
  product: Product;
  score: number;
  reasonAr: string;
  reasonEn: string;
}

export const DEFAULT_GIFT_PREFERENCES: GiftPreferences = {
  recipient: 'women',
  occasion: 'celebration',
  mood: 'understated',
  budget: '2000',
};

export function isGiftRecipient(value: string | null): value is GiftRecipient {
  return value === 'women' || value === 'men' || value === 'kids';
}
export function isGiftOccasion(value: string | null): value is GiftOccasion {
  return value === 'eid' || value === 'celebration' || value === 'gratitude' || value === 'everyday';
}
export function isGiftMood(value: string | null): value is GiftMood {
  return value === 'understated' || value === 'statement' || value === 'practical';
}
export function isGiftBudget(value: string | null): value is GiftBudget {
  return value === '1000' || value === '2000' || value === '3500' || value === 'any';
}

export function giftPreferencesFromParams(params: URLSearchParams): GiftPreferences {
  const recipient = params.get('recipient');
  const occasion = params.get('occasion');
  const mood = params.get('mood');
  const budget = params.get('budget');

  return {
    recipient: isGiftRecipient(recipient) ? recipient : DEFAULT_GIFT_PREFERENCES.recipient,
    occasion: isGiftOccasion(occasion) ? occasion : DEFAULT_GIFT_PREFERENCES.occasion,
    mood: isGiftMood(mood) ? mood : DEFAULT_GIFT_PREFERENCES.mood,
    budget: isGiftBudget(budget) ? budget : DEFAULT_GIFT_PREFERENCES.budget,
  };
}

export function giftPreferencesToQuery(preferences: GiftPreferences): string {
  return new URLSearchParams({
    recipient: preferences.recipient,
    occasion: preferences.occasion,
    mood: preferences.mood,
    budget: preferences.budget,
  }).toString();
}

export function findGiftRecommendations(
  preferences: GiftPreferences,
  limit = 6
): GiftRecommendation[] {
  const maximum = preferences.budget === 'any' ? Infinity : Number(preferences.budget);

  return DEMO_PRODUCTS.filter(
    (product) =>
      product.inStock &&
      product.department === preferences.recipient &&
      product.price <= maximum
  )
    .map((product) => {
      const description = [
        product.nameEn, product.nameAr, product.fabricEn, product.fabricAr,
        product.tailoringEn, product.tailoringAr, product.categoryKey,
      ].filter(Boolean).join(' ').toLowerCase();
      let score = 0;
      let reasonAr = 'اختيار متوازن من تشكيلة رِفْعة';
      let reasonEn = 'A considered choice from the RIFAA wardrobe';

      if (product.isFeatured) score += 2;
      if (product.isBestSeller) score += 3;
      if (product.isNew) score += 1;

      if (preferences.occasion === 'eid') {
        if (product.collectionKey === 'eid-edit-2026') {
          score += 11;
          reasonAr = 'من تشكيلة العيد المختارة';
          reasonEn = 'Selected from the Eid edit';
        }
        if (product.collectionKey === 'occasion') score += 5;
      } else if (preferences.occasion === 'celebration') {
        if (product.collectionKey === 'occasion' || product.collectionKey === 'eid-edit-2026') {
          score += 8;
          reasonAr = 'تفصيل مناسب لحضور المناسبات';
          reasonEn = 'Occasion-minded styling and detail';
        }
        if (/silk|satin|zari|embroider|حرير|ساتان|تطريز|زري/.test(description)) score += 3;
      } else if (preferences.occasion === 'gratitude') {
        if (product.categoryKey === 'accessories' || product.categoryKey === 'shoes') {
          score += 10;
          reasonAr = 'قطعة يمكن إهداؤها دون تخمين المقاس غالباً';
          reasonEn = 'A considered gift with less fit uncertainty';
        }
        if (product.collectionKey === 'core-essentials') score += 4;
      } else {
        if (product.collectionKey === 'core-essentials') {
          score += 9;
          reasonAr = 'قطعة متعددة الاستخدام في الحياة اليومية';
          reasonEn = 'Versatile enough for everyday wear';
        }
        if (/cotton|linen|breathable|قطن|كتان|مسامي/.test(description)) score += 3;
      }

      if (preferences.mood === 'understated') {
        if (/minimal|classic|linen|cotton|clean|silk|كلاسيكي|بسيط|قطن|كتان|حرير/.test(description)) {
          score += 7;
          reasonAr = 'حضور هادئ وخامة منتقاة';
          reasonEn = 'Restrained elegance and considered fabrication';
        }
      } else if (preferences.mood === 'statement') {
        if (/architectural|embroider|zari|bisht|ceremonial|cape|معماري|تطريز|زري|بشت/.test(description)) {
          score += 9;
          reasonAr = 'تفصيل لافت له شخصية واضحة';
          reasonEn = 'Expressive craftsmanship with a distinct silhouette';
        }
      } else {
        if (/cotton|linen|breathable|crease-resistant|comfortable|قطن|كتان|مريح|مسامي/.test(description)) {
          score += 8;
          reasonAr = 'خامة عملية وراحة متوازنة';
          reasonEn = 'Practical fabrication with considered comfort';
        }
      }

      // Budget is a hard cap, never a guessed discount.
      // Small preference for versatility when two pieces match equally.
      if (product.collectionKey === 'core-essentials') score += 1;

      return { product, score, reasonAr, reasonEn };
    })
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, Math.max(0, limit));
}
