export type Department = 'women' | 'men' | 'kids';

export type Language = 'ar' | 'en';

export type CollectionKey = 'autumn-winter-2026' | 'eid-edit-2026' | 'core-essentials' | 'occasion';

export interface ProductColor {
  nameAr: string;
  nameEn: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  categoryKey: string;
  department: Department;
  price: number; // in SAR
  oldPrice?: number; // in SAR
  colors: ProductColor[];
  sizes: string[];
  image: string;
  secondImage?: string;
  additionalImages?: string[];
  descriptionAr: string;
  descriptionEn: string;
  collection: string;
  collectionKey: CollectionKey;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  lookId?: string;
  // Authentic craftsmanship and tailoring specifications
  fabricAr?: string;
  fabricEn?: string;
  tailoringAr?: string;
  tailoringEn?: string;
  careAr?: string;
  careEn?: string;
  originAr?: string;
  originEn?: string;
  fitAr?: string;
  fitEn?: string;
  detailsAr?: string[];
  detailsEn?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface JournalStory {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  readTimeAr: string;
  readTimeEn: string;
  excerptAr: string;
  excerptEn: string;
  image: string;
  date: string;
  authorAr?: string;
  authorEn?: string;
  paragraphsAr?: string[];
  paragraphsEn?: string[];
}

export interface CuratedLook {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  mainImage: string;
  productIds: string[];
}

export interface MediaAsset {
  id: string;
  src: string;
  department: Department | 'family' | 'editorial';
  role: 'hero' | 'category' | 'campaign' | 'journal' | 'look';
  subject: string;
  altAr: string;
  altEn: string;
  focalPosition?: string;
}
