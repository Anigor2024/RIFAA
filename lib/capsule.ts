import { DEMO_PRODUCTS } from '@/data/products';
import { Product } from '@/types';

export type CapsuleAudience = 'women' | 'men' | 'boys' | 'girls';
export type CapsuleMoment = 'daily' | 'work' | 'evening' | 'eid' | 'travel';
export type CapsulePalette = 'neutral' | 'warm' | 'deep';

export interface CapsuleFilters {
  audience: CapsuleAudience;
  moment: CapsuleMoment;
  palette: CapsulePalette;
}

export interface CapsuleSelection {
  product: Product;
  roleAr: string;
  roleEn: string;
}

interface CapsuleSlot {
  roleAr: string;
  roleEn: string;
  categoryKeys: string[];
}

const SLOT_MAP: Record<CapsuleAudience, CapsuleSlot[]> = {
  women: [
    { roleAr: 'القطعة المحورية', roleEn: 'Anchor', categoryKeys: ['abayas', 'coords'] },
    { roleAr: 'الطبقة الناعمة', roleEn: 'Soft Layer', categoryKeys: ['tops'] },
    { roleAr: 'القاعدة', roleEn: 'Foundation', categoryKeys: ['bottoms'] },
    { roleAr: 'البنية', roleEn: 'Structure', categoryKeys: ['blazers', 'coords'] },
    { roleAr: 'اللمسة الأخيرة', roleEn: 'Finish', categoryKeys: ['shoes', 'accessories'] },
  ],
  men: [
    { roleAr: 'القطعة المحورية', roleEn: 'Anchor', categoryKeys: ['thobes'] },
    { roleAr: 'الطبقة الخارجية', roleEn: 'Outer Layer', categoryKeys: ['outerwear', 'bishts'] },
    { roleAr: 'الطبقة الخفيفة', roleEn: 'Light Layer', categoryKeys: ['polos'] },
    { roleAr: 'القاعدة', roleEn: 'Foundation', categoryKeys: ['trousers'] },
    { roleAr: 'اللمسة الأخيرة', roleEn: 'Finish', categoryKeys: ['shoes', 'accessories'] },
  ],
  boys: [
    { roleAr: 'الثوب الأساسي', roleEn: 'Core Thobe', categoryKeys: ['boys-thobes'] },
    { roleAr: 'القميص', roleEn: 'Shirt', categoryKeys: ['boys-shirts'] },
    { roleAr: 'الطبقة الرسمية', roleEn: 'Tailored Layer', categoryKeys: ['boys-blazers'] },
    { roleAr: 'البنطال', roleEn: 'Trousers', categoryKeys: ['boys-trousers'] },
    { roleAr: 'الراحة', roleEn: 'Off-duty', categoryKeys: ['kids-sets'] },
  ],
  girls: [
    { roleAr: 'الفستان', roleEn: 'Dress', categoryKeys: ['girls-dresses'] },
    { roleAr: 'الطقم', roleEn: 'Set', categoryKeys: ['girls-sets'] },
    { roleAr: 'طبقة المناسبة', roleEn: 'Occasion Layer', categoryKeys: ['girls-occasions'] },
    { roleAr: 'القاعدة', roleEn: 'Foundation', categoryKeys: ['girls-skirts'] },
    { roleAr: 'الطبقة الناعمة', roleEn: 'Soft Layer', categoryKeys: ['girls-knitwear'] },
  ],
};

function audienceMatches(product: Product, audience: CapsuleAudience) {
  if (audience === 'women' || audience === 'men') {
    return product.department === audience;
  }

  if (product.department !== 'kids') return false;

  if (audience === 'boys') {
    return product.categoryKey.startsWith('boys-') || product.categoryKey === 'kids-sets';
  }

  return product.categoryKey.startsWith('girls-');
}

function textFor(product: Product) {
  return [
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
    ...product.colors.flatMap((color) => [color.nameAr, color.nameEn]),
    ...(product.detailsAr || []),
    ...(product.detailsEn || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function includesAny(source: string, terms: string[]) {
  return terms.some((term) => source.includes(term));
}

function scoreMoment(product: Product, moment: CapsuleMoment) {
  const source = textFor(product);
  let score = 0;

  if (product.isBestSeller) score += 2;
  if (product.isFeatured) score += 1;

  if (moment === 'daily') {
    if (product.collectionKey === 'core-essentials') score += 8;
    if (includesAny(source, ['cotton', 'linen', 'knit', 'قطن', 'كتان', 'تريكو'])) score += 4;
  }

  if (moment === 'work') {
    if (includesAny(source, ['tailor', 'blazer', 'trouser', 'shirt', 'structured', 'تفصيل', 'بليزر', 'بنطال', 'قميص', 'مهيكل'])) score += 7;
    if (product.collectionKey === 'core-essentials') score += 2;
  }

  if (moment === 'evening') {
    if (product.collectionKey === 'occasion' || product.collectionKey === 'eid-edit-2026') score += 6;
    if (includesAny(source, ['silk', 'satin', 'zari', 'bisht', 'cape', 'حرير', 'ساتان', 'زري', 'بشت', 'كيب'])) score += 6;
  }

  if (moment === 'eid') {
    if (product.collectionKey === 'eid-edit-2026') score += 10;
    if (includesAny(source, ['embroider', 'occasion', 'zari', 'تطريز', 'مناسبات', 'زري'])) score += 4;
  }

  if (moment === 'travel') {
    if (includesAny(source, ['breathable', 'crease-resistant', 'linen', 'cotton', 'lightweight', 'مسامي', 'مقاوم للتجعد', 'كتان', 'قطن', 'خفيف'])) score += 8;
    if (product.collectionKey === 'core-essentials') score += 3;
  }

  return score;
}

function scorePalette(product: Product, palette: CapsulePalette) {
  const colors = product.colors.map((color) => color.nameEn.toLowerCase()).join(' ');

  const terms: Record<CapsulePalette, string[]> = {
    neutral: ['black', 'white', 'ivory', 'cream', 'sand', 'beige', 'taupe', 'grey', 'gray', 'ecru', 'oat', 'milk'],
    warm: ['camel', 'brown', 'chocolate', 'espresso', 'sand', 'bronze', 'olive', 'gold', 'caramel', 'rose', 'blush', 'warm'],
    deep: ['black', 'charcoal', 'navy', 'olive', 'oxblood', 'midnight', 'espresso', 'slate'],
  };

  return includesAny(colors, terms[palette]) ? 6 : 0;
}

function scoreProduct(product: Product, filters: CapsuleFilters) {
  return scoreMoment(product, filters.moment) + scorePalette(product, filters.palette);
}

export function getCapsule(filters: CapsuleFilters): CapsuleSelection[] {
  const eligible = DEMO_PRODUCTS.filter(
    (product) => product.inStock && audienceMatches(product, filters.audience)
  );
  const selected = new Set<string>();

  return SLOT_MAP[filters.audience]
    .map((slot) => {
      const candidates = eligible
        .filter(
          (product) =>
            !selected.has(product.id) &&
            slot.categoryKeys.includes(product.categoryKey)
        )
        .sort((a, b) => {
          const scoreDiff = scoreProduct(b, filters) - scoreProduct(a, filters);
          if (scoreDiff !== 0) return scoreDiff;
          return a.price - b.price;
        });

      const fallback = eligible
        .filter((product) => !selected.has(product.id))
        .sort((a, b) => scoreProduct(b, filters) - scoreProduct(a, filters));

      const product = candidates[0] || fallback[0];
      if (!product) return null;

      selected.add(product.id);
      return {
        product,
        roleAr: slot.roleAr,
        roleEn: slot.roleEn,
      };
    })
    .filter((item): item is CapsuleSelection => Boolean(item));
}

export function getCapsuleMetrics(selections: CapsuleSelection[]) {
  const total = selections.reduce((sum, item) => sum + item.product.price, 0);
  const colorways = selections.reduce(
    (sum, item) => sum + item.product.colors.length,
    0
  );
  const careProfiles = new Set(
    selections.map((item) => item.product.careEn || item.product.careAr || '')
  ).size;

  return {
    total,
    rolesFilled: selections.length,
    colorways,
    careProfiles,
  };
}
