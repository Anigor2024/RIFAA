import { DEMO_PRODUCTS } from '@/data/products';
import { Product } from '@/types';

export type DiscoveryDepartment = 'all' | 'women' | 'men' | 'kids';
export type DiscoveryMoment = 'daily' | 'work' | 'evening' | 'eid' | 'travel';
export type DiscoveryPriority = 'balanced' | 'breathable' | 'statement' | 'tailored';

export interface DiscoveryFilters {
  department: DiscoveryDepartment;
  moment: DiscoveryMoment;
  priority: DiscoveryPriority;
}

export interface DiscoveryRecommendation {
  product: Product;
  score: number;
  reasonsAr: string[];
  reasonsEn: string[];
}

const textFor = (product: Product) =>
  [
    product.nameAr,
    product.nameEn,
    product.categoryAr,
    product.categoryEn,
    product.descriptionAr,
    product.descriptionEn,
    product.fabricAr,
    product.fabricEn,
    product.tailoringAr,
    product.tailoringEn,
    product.fitAr,
    product.fitEn,
    product.collection,
    ...(product.detailsAr || []),
    ...(product.detailsEn || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

function includesAny(source: string, terms: string[]) {
  return terms.some((term) => source.includes(term));
}

export function getDiscoveryRecommendations(
  filters: DiscoveryFilters,
  limit = 6
): DiscoveryRecommendation[] {
  return DEMO_PRODUCTS
    .filter(
      (product) =>
        product.inStock &&
        (filters.department === 'all' || product.department === filters.department)
    )
    .map((product) => {
      const source = textFor(product);
      let score = 0;
      const reasonsAr: string[] = [];
      const reasonsEn: string[] = [];

      if (product.isFeatured) score += 2;
      if (product.isBestSeller) score += 2;
      if (product.isNew) score += 1;

      switch (filters.moment) {
        case 'daily':
          if (product.collectionKey === 'core-essentials') {
            score += 7;
            reasonsAr.push('أساسي عملي للاستخدام اليومي');
            reasonsEn.push('Versatile everyday essential');
          }
          if (includesAny(source, ['linen', 'cotton', 'knit', 'كتان', 'قطن', 'تريكو'])) score += 3;
          if (product.price <= 1200) score += 1;
          break;
        case 'work':
          if (
            includesAny(source, [
              'blazer',
              'trouser',
              'shirt',
              'overshirt',
              'tailored',
              'بليزر',
              'بنطال',
              'قميص',
              'تفصيل',
            ])
          ) {
            score += 7;
            reasonsAr.push('بنية تفصيل مناسبة للحضور المهني');
            reasonsEn.push('Structured tailoring for professional settings');
          }
          if (product.collectionKey === 'core-essentials') score += 2;
          break;
        case 'evening':
          if (product.collectionKey === 'occasion' || product.collectionKey === 'eid-edit-2026') score += 5;
          if (
            includesAny(source, [
              'silk',
              'satin',
              'zari',
              'embroider',
              'bisht',
              'cape',
              'حرير',
              'ساتان',
              'زري',
              'تطريز',
              'بشت',
              'كيب',
            ])
          ) {
            score += 6;
            reasonsAr.push('خامة أو تفصيل يمنح حضوراً مسائياً');
            reasonsEn.push('Material or detailing suited to evening presence');
          }
          break;
        case 'eid':
          if (product.collectionKey === 'eid-edit-2026') {
            score += 10;
            reasonsAr.push('من تحرير العيد 2026');
            reasonsEn.push('Part of the Eid Edit 2026');
          }
          if (product.collectionKey === 'occasion') score += 4;
          break;
        case 'travel':
          if (
            includesAny(source, [
              'breathable',
              'crease',
              'linen',
              'cotton',
              'lightweight',
              'مسامي',
              'مقاوم للتجعد',
              'كتان',
              'قطن',
              'خفيف',
            ])
          ) {
            score += 8;
            reasonsAr.push('خامة عملية وخفيفة للحركة والسفر');
            reasonsEn.push('Travel-friendly, breathable fabrication');
          }
          if (product.collectionKey === 'core-essentials') score += 2;
          break;
      }

      switch (filters.priority) {
        case 'breathable':
          if (
            includesAny(source, [
              'breathable',
              'linen',
              'cotton',
              'lightweight',
              'مسامي',
              'كتان',
              'قطن',
              'خفيف',
            ])
          ) {
            score += 8;
            reasonsAr.push('أولوية للتهوية والراحة');
            reasonsEn.push('Prioritizes breathability and comfort');
          }
          break;
        case 'statement':
          if (
            product.isFeatured ||
            includesAny(source, [
              'embroider',
              'zari',
              'cape',
              'ceremonial',
              'architectural',
              'تطريز',
              'زري',
              'كيب',
              'معماري',
            ])
          ) {
            score += 7;
            reasonsAr.push('تفصيل لافت دون مبالغة');
            reasonsEn.push('Distinctive detail with controlled impact');
          }
          break;
        case 'tailored':
          if (
            includesAny(source, [
              'tailor',
              'structured',
              'precision',
              'blazer',
              'تفصيل',
              'مهيكل',
              'دقيق',
              'بليزر',
            ])
          ) {
            score += 8;
            reasonsAr.push('تفصيل مضبوط وبنية دقيقة');
            reasonsEn.push('Precision tailoring and structure');
          }
          break;
        case 'balanced':
          if (product.isBestSeller) {
            score += 3;
            reasonsAr.push('توازن بين العملية والحضور');
            reasonsEn.push('Balanced versatility and presence');
          }
          break;
      }

      if (reasonsAr.length === 0) {
        reasonsAr.push('اختيار متوازن من تشكيلة رِفْعة');
        reasonsEn.push('Balanced selection from the RIFAA wardrobe');
      }

      return {
        product,
        score,
        reasonsAr: Array.from(new Set(reasonsAr)).slice(0, 2),
        reasonsEn: Array.from(new Set(reasonsEn)).slice(0, 2),
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (Boolean(b.product.isFeatured) !== Boolean(a.product.isFeatured)) {
        return Number(Boolean(b.product.isFeatured)) - Number(Boolean(a.product.isFeatured));
      }
      return a.product.price - b.product.price;
    })
    .slice(0, limit);
}
