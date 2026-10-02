export type Department = 'women' | 'men' | 'kids';

export type Language = 'ar' | 'en';

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
  department: Department;
  price: number; // in SAR
  oldPrice?: number; // in SAR
  colors: ProductColor[];
  sizes: string[];
  image: string;
  secondImage: string;
  descriptionAr: string;
  descriptionEn: string;
  collection: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  lookId?: string;
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
