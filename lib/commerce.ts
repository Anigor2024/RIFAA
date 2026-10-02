/**
 * Central Commerce Configuration for RIFAA Platform
 * Stores delivery options, promo codes, cities, and pricing logic.
 */

export interface DeliveryOption {
  id: 'standard' | 'express' | 'riyadh_same_day';
  nameAr: string;
  nameEn: string;
  price: number;
  freeThreshold?: number; // Order subtotal to qualify for free shipping
  estimatedDaysAr: string;
  estimatedDaysEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 50 for 50 SAR
  descriptionAr: string;
  descriptionEn: string;
  minOrder?: number;
}

export interface SaudiCity {
  id: string;
  nameAr: string;
  nameEn: string;
  regionAr: string;
  regionEn: string;
  supportsSameDay?: boolean;
}

export interface DemoOrder {
  orderReference: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    country: string;
    city: string;
    district: string;
    street: string;
    building?: string;
    postalCode?: string;
    additionalInfo?: string;
  };
  deliveryMethod: DeliveryOption;
  paymentMethod: {
    type: 'mada' | 'card' | 'apple_pay';
    labelAr: string;
    labelEn: string;
    lastFour?: string;
  };
  items: {
    id: string;
    productId: string;
    productNameAr: string;
    productNameEn: string;
    image: string;
    size: string;
    colorNameAr: string;
    colorNameEn: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCodeApplied?: string;
  total: number;
}

export const COMMERCE_CONFIG = {
  currency: 'SAR',
  currencySymbolAr: 'ر.س',
  currencySymbolEn: 'SAR',
  freeShippingThreshold: 500,

  deliveryOptions: [
    {
      id: 'standard',
      nameAr: 'التوصيل القياسي لكافة مناطق المملكة',
      nameEn: 'Standard Delivery Across Saudi Arabia',
      price: 35,
      freeThreshold: 500,
      estimatedDaysAr: '٢ - ٤ أيام عمل',
      estimatedDaysEn: '2 - 4 Business Days',
      descriptionAr: 'شحن موثوق عبر شبكة النقل المعتمدة في المملكة. مجاني للطلبات فوق 500 ر.س.',
      descriptionEn: 'Complimentary on orders over SAR 500. Reliable delivery to all regions.',
    },
    {
      id: 'express',
      nameAr: 'الشحن السريع ذو الأولوية',
      nameEn: 'Priority Express Delivery',
      price: 65,
      estimatedDaysAr: '١ - ٢ يوم عمل',
      estimatedDaysEn: '1 - 2 Business Days',
      descriptionAr: 'معالجة فورية وأولوية شحن للطلبات المستعجلة.',
      descriptionEn: 'Immediate processing with expedited priority handling.',
    },
    {
      id: 'riyadh_same_day',
      nameAr: 'توصيل الرياض في نفس اليوم (كونسيرج)',
      nameEn: 'Riyadh Concierge Same-Day Delivery',
      price: 90,
      estimatedDaysAr: 'اليوم (للطلبات قبل ٢ ظهراً)',
      estimatedDaysEn: 'Same Day (For orders placed before 2 PM AST)',
      descriptionAr: 'خدمة تسليم خاصة بالسيارات الفارهة داخل حدود مدينة الرياض.',
      descriptionEn: 'Private white-glove courier service within Riyadh city limits.',
    },
  ] as DeliveryOption[],

  promoCodes: [
    {
      code: 'RIFAA10',
      type: 'percentage',
      value: 10,
      descriptionAr: 'خصم ١٠٪ على إجمالي القطع',
      descriptionEn: '10% off total items',
    },
    {
      code: 'EID2026',
      type: 'percentage',
      value: 15,
      minOrder: 800,
      descriptionAr: 'خصم ١٥٪ لتحرير العيد للطلبات فوق ٨٠٠ ر.س',
      descriptionEn: '15% Eid celebration discount on orders over SAR 800',
    },
    {
      code: 'DIRIYAH',
      type: 'fixed',
      value: 50,
      descriptionAr: 'خصم ٥٠ ر.س ترحيبي',
      descriptionEn: 'SAR 50 welcome reduction',
    },
  ] as PromoCode[],

  saudiCities: [
    { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh', regionAr: 'منطقة الرياض', regionEn: 'Riyadh Province', supportsSameDay: true },
    { id: 'jeddah', nameAr: 'جدة', nameEn: 'Jeddah', regionAr: 'منطقة مكة المكرمة', regionEn: 'Makkah Province' },
    { id: 'dammam', nameAr: 'الدمام', nameEn: 'Dammam', regionAr: 'المنطقة الشرقية', regionEn: 'Eastern Province' },
    { id: 'khobar', nameAr: 'الخبر', nameEn: 'Al Khobar', regionAr: 'المنطقة الشرقية', regionEn: 'Eastern Province' },
    { id: 'makkah', nameAr: 'مكة المكرمة', nameEn: 'Makkah', regionAr: 'منطقة مكة المكرمة', regionEn: 'Makkah Province' },
    { id: 'madinah', nameAr: 'المدينة المنورة', nameEn: 'Madinah', regionAr: 'منطقة المدينة المنورة', regionEn: 'Madinah Province' },
    { id: 'dhahran', nameAr: 'الظهران', nameEn: 'Dhahran', regionAr: 'المنطقة الشرقية', regionEn: 'Eastern Province' },
    { id: 'taif', nameAr: 'الطائف', nameEn: 'Taif', regionAr: 'منطقة مكة المكرمة', regionEn: 'Makkah Province' },
    { id: 'tabuk', nameAr: 'تبوك', nameEn: 'Tabuk', regionAr: 'منطقة تبوك', regionEn: 'Tabuk Province' },
    { id: 'abha', nameAr: 'أبها', nameEn: 'Abha', regionAr: 'منطقة عسير', regionEn: 'Asir Province' },
    { id: 'buraidah', nameAr: 'بريدة', nameEn: 'Buraidah', regionAr: 'منطقة القصيم', regionEn: 'Qassim Province' },
    { id: 'ahsa', nameAr: 'الأحساء', nameEn: 'Al Ahsa', regionAr: 'المنطقة الشرقية', regionEn: 'Eastern Province' },
    { id: 'jubail', nameAr: 'الجبيل', nameEn: 'Jubail', regionAr: 'المنطقة الشرقية', regionEn: 'Eastern Province' },
    { id: 'hail', nameAr: 'حائل', nameEn: 'Hail', regionAr: 'منطقة حائل', regionEn: 'Hail Province' },
    { id: 'khamis_mushait', nameAr: 'خميس مشيط', nameEn: 'Khamis Mushait', regionAr: 'منطقة عسير', regionEn: 'Asir Province' },
    { id: 'yanbu', nameAr: 'ينبع', nameEn: 'Yanbu', regionAr: 'منطقة المدينة المنورة', regionEn: 'Madinah Province' },
    { id: 'najran', nameAr: 'نجران', nameEn: 'Najran', regionAr: 'منطقة نجران', regionEn: 'Najran Province' },
    { id: 'jazan', nameAr: 'جازان', nameEn: 'Jazan', regionAr: 'منطقة جازان', regionEn: 'Jazan Province' },
  ] as SaudiCity[],
};

/**
 * Calculates delivery fee based on subtotal and chosen method
 */
export function calculateDeliveryFee(subtotal: number, deliveryMethod: DeliveryOption): number {
  if (deliveryMethod.freeThreshold && subtotal >= deliveryMethod.freeThreshold) {
    return 0;
  }
  return deliveryMethod.price;
}

/**
 * Calculates discount amount based on active promo and subtotal
 */
export function calculateDiscount(subtotal: number, promo: PromoCode | null): number {
  if (!promo) return 0;
  if (promo.minOrder && subtotal < promo.minOrder) return 0;

  if (promo.type === 'percentage') {
    return Math.round((subtotal * promo.value) / 100);
  }
  if (promo.type === 'fixed') {
    return Math.min(promo.value, subtotal);
  }
  return 0;
}

/**
 * Generates an elegant demo order reference (e.g. RIFAA-26-48912)
 */
export function generateOrderReference(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `RIFAA-26-${randomDigits}`;
}
