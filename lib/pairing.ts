import { DEMO_PRODUCTS } from '@/data/products';
import { Product } from '@/types';

export interface PairingRecommendation {
  product: Product;
  score: number;
  reasonAr: string;
  reasonEn: string;
}

const COMPLEMENTS: Record<string, string[]> = {
  // Women
  abayas: ['tops', 'bottoms', 'shoes', 'accessories', 'blazers'],
  coords: ['shoes', 'accessories', 'blazers'],
  tops: ['bottoms', 'blazers', 'shoes', 'accessories', 'abayas'],
  bottoms: ['tops', 'blazers', 'shoes', 'accessories', 'abayas'],
  blazers: ['tops', 'bottoms', 'shoes', 'accessories'],
  shoes: ['abayas', 'coords', 'tops', 'bottoms', 'blazers'],
  accessories: ['abayas', 'coords', 'tops', 'bottoms', 'blazers'],

  // Men
  thobes: ['bishts', 'shoes', 'accessories', 'outerwear'],
  bishts: ['thobes', 'shoes', 'accessories'],
  outerwear: ['polos', 'trousers', 'shoes', 'accessories', 'thobes'],
  polos: ['trousers', 'outerwear', 'shoes', 'accessories'],
  trousers: ['polos', 'outerwear', 'shoes', 'accessories'],
  // shared shoes/accessories handled above

  // Kids
  'boys-thobes': ['boys-blazers', 'boys-shirts', 'boys-trousers', 'kids-sets'],
  'boys-shirts': ['boys-trousers', 'boys-blazers', 'kids-sets'],
  'boys-blazers': ['boys-shirts', 'boys-trousers', 'boys-thobes'],
  'boys-trousers': ['boys-shirts', 'boys-blazers', 'kids-sets'],
  'girls-dresses': ['girls-knitwear', 'girls-occasions', 'girls-skirts'],
  'girls-sets': ['girls-knitwear', 'girls-occasions', 'girls-skirts'],
  'girls-occasions': ['girls-dresses', 'girls-sets', 'girls-knitwear'],
  'girls-skirts': ['girls-knitwear', 'girls-sets', 'girls-occasions'],
  'girls-knitwear': ['girls-dresses', 'girls-skirts', 'girls-sets'],
  'kids-sets': ['boys-shirts', 'boys-trousers', 'girls-knitwear'],
  babywear: ['kids-sets'],
};

const COLOR_FAMILIES: Record<string, string[]> = {
  neutral: ['black', 'white', 'ivory', 'cream', 'ecru', 'beige', 'sand', 'taupe', 'grey', 'gray', 'charcoal', 'oat', 'milk'],
  warm: ['camel', 'brown', 'espresso', 'chocolate', 'bronze', 'gold', 'caramel', 'rose', 'blush', 'sand'],
  deep: ['black', 'charcoal', 'navy', 'midnight', 'olive', 'oxblood', 'espresso', 'slate'],
  soft: ['ivory', 'cream', 'ecru', 'blush', 'rose', 'powder', 'milk', 'pearl', 'oatmeal'],
};

function colorFamilies(product: Product) {
  const source = product.colors.map((color) => color.nameEn.toLowerCase()).join(' ');
  return Object.entries(COLOR_FAMILIES)
    .filter(([, terms]) => terms.some((term) => source.includes(term)))
    .map(([family]) => family);
}

function categoryScore(anchor: Product, candidate: Product) {
  const complements = COMPLEMENTS[anchor.categoryKey] || [];
  const index = complements.indexOf(candidate.categoryKey);
  if (index === -1) return 0;
  return Math.max(3, 10 - index * 2);
}

function colorScore(anchor: Product, candidate: Product) {
  const anchorFamilies = colorFamilies(anchor);
  const candidateFamilies = colorFamilies(candidate);
  const overlap = anchorFamilies.filter((family) => candidateFamilies.includes(family));
  return overlap.length > 0 ? 4 : 0;
}

function getReason(anchor: Product, candidate: Product) {
  const categoryMatch = categoryScore(anchor, candidate) > 0;
  const sameCollection = anchor.collectionKey === candidate.collectionKey;
  const colorMatch = colorScore(anchor, candidate) > 0;

  if (categoryMatch && colorMatch) {
    return {
      ar: 'يكمل وظيفة القطعة مع تقارب لوني مدروس',
      en: 'Complements the wardrobe role with considered color harmony',
    };
  }

  if (categoryMatch && sameCollection) {
    return {
      ar: 'وظيفة مكملة ومن نفس لغة التشكيلة',
      en: 'A complementary role from the same collection language',
    };
  }

  if (categoryMatch) {
    return {
      ar: 'يضيف وظيفة مختلفة تكمل الإطلالة',
      en: 'Adds a distinct wardrobe role that completes the look',
    };
  }

  if (sameCollection) {
    return {
      ar: 'من نفس التشكيلة وبحضور بصري متقارب',
      en: 'From the same collection with a related visual character',
    };
  }

  return {
    ar: 'اختيار متوازن حسب بيانات القطعة والتشكيلة',
    en: 'Balanced pairing based on product and collection signals',
  };
}

export function getPairingRecommendations(
  anchor: Product,
  limit = 4
): PairingRecommendation[] {
  return DEMO_PRODUCTS
    .filter(
      (candidate) =>
        candidate.id !== anchor.id &&
        candidate.inStock &&
        candidate.department === anchor.department
    )
    .map((candidate) => {
      let score = 0;
      score += categoryScore(anchor, candidate);
      score += colorScore(anchor, candidate);

      if (candidate.collectionKey === anchor.collectionKey) score += 4;
      if (candidate.isFeatured) score += 1;
      if (candidate.isBestSeller) score += 1;
      if (candidate.isNew) score += 0.5;

      const reason = getReason(anchor, candidate);

      return {
        product: candidate,
        score,
        reasonAr: reason.ar,
        reasonEn: reason.en,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.product.price - b.product.price;
    })
    .slice(0, limit);
}

export function getPairingSet(anchorId: string, limit = 3) {
  const anchor = DEMO_PRODUCTS.find((product) => product.id === anchorId);
  if (!anchor) return null;

  return {
    anchor,
    recommendations: getPairingRecommendations(anchor, limit),
  };
}
