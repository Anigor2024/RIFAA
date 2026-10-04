import { MediaAsset } from '@/types';

export const MEDIA_MANIFEST: Record<string, MediaAsset> = {
  // Hero Campaign
  heroCampaign: {
    id: 'hero-campaign-riyadh-01',
    src: '/images/hero_campaign_riyadh.jpg',
    department: 'family',
    role: 'hero',
    subject: 'Modern Saudi couple in Diriyah limestone pavilion wearing bespoke abaya and white thobe',
    altAr: 'حملة رِفْعة خريف / شتاء 2026 في الرياض — أناقة سعودية معاصرة',
    altEn: 'RIFAA Autumn / Winter 2026 Campaign in Riyadh — Contemporary Saudi Elegance',
    focalPosition: 'center',
  },

  // Primary Category Feature Panels
  categoryWomen: {
    id: 'cat-women-abaya-01',
    src: '/images/women_editorial_abaya.jpg',
    department: 'women',
    role: 'category',
    subject: 'Contemporary Saudi woman in architectural crepe abaya in Diriyah courtyard',
    altAr: 'مجموعة المرأة في رِفْعة — عبايات كريب ياباني وتفصيل معاصر',
    altEn: 'RIFAA Women Collection — Japanese Crepe Abayas and Modern Tailoring',
    focalPosition: 'center 20%',
  },
  categoryMen: {
    id: 'cat-men-thobe-01',
    src: '/images/men_editorial_thobe.jpg',
    department: 'men',
    role: 'category',
    subject: 'Sophisticated Saudi gentleman wearing bespoke white thobe and Italian wool overshirt',
    altAr: 'مجموعة الرجل في رِفْعة — ثياب سعودية فاخرة وتفصيل عصري',
    altEn: 'RIFAA Men Collection — Bespoke Saudi Thobes and Modern Essentials',
    focalPosition: 'center 15%',
  },
  categoryKids: {
    id: 'cat-kids-family-01',
    src: '/images/kids_editorial_family.jpg',
    department: 'kids',
    role: 'category',
    subject: 'Saudi children in miniature tailored white thobe and tiered linen occasion dress',
    altAr: 'مجموعة الأطفال في رِفْعة — ثياب أطفال فاخرة وفساتين كتان للمناسبات',
    altEn: 'RIFAA Kids Collection — Tailored Children Thobes and Linen Dresses',
    focalPosition: 'center',
  },

  // Editorial Stories
  editorialModernWardrobe: {
    id: 'editorial-modern-wardrobe-01',
    src: '/images/editorial/modern-wardrobe-guide.jpg',
    department: 'editorial',
    role: 'campaign',
    subject: 'Modern Saudi wardrobe editorial study',
    altAr: 'تحرير رِفْعة — دليل خزانة سعودية معاصرة',
    altEn: 'RIFAA Editorial — A Modern Saudi Wardrobe Study',
    focalPosition: 'center',
  },
  editorialLayering: {
    id: 'editorial-layering-01',
    src: '/images/editorial/art-of-layering-saudi-climate.jpg',
    department: 'editorial',
    role: 'campaign',
    subject: 'Layering and textile editorial for the Saudi climate',
    altAr: 'تحرير رِفْعة — فن الطبقات والخامات في مناخ المملكة',
    altEn: 'RIFAA Editorial — Layering and Textile Intelligence for the Saudi Climate',
    focalPosition: 'center',
  },
  editorialEidReflections: {
    id: 'editorial-eid-reflections-01',
    src: '/images/editorial/eid-edit-reflections.jpg',
    department: 'editorial',
    role: 'campaign',
    subject: 'Refined Eid occasionwear editorial',
    altAr: 'تحرير رِفْعة — انعكاسات العيد وتفاصيل المناسبات',
    altEn: 'RIFAA Editorial — Eid Reflections and Occasion Details',
    focalPosition: 'center',
  },

  // Legacy edit asset retained outside the homepage experience
  editRiyadhEvening: {
    id: 'edit-riyadh-dark-01',
    src: '/images/edit_riyadh_evening.jpg',
    department: 'editorial',
    role: 'campaign',
    subject: 'Metropolitan Riyadh evening fashion story in illuminated limestone pavilion',
    altAr: 'تحرير رِفْعة: ليالي الرياض — إطلالات مسائية معاصرة',
    altEn: 'The RIFAA Edit: Riyadh After Dark — Contemporary Evening Silhouettes',
    focalPosition: 'center',
  },

  // Shop The Look Hero
  shopTheLookEnsemble: {
    id: 'look-evening-ensemble-01',
    src: '/images/curated_look_ensemble.jpg',
    department: 'women',
    role: 'look',
    subject: 'Full-length ensemble: pure silk blouse, pleated wide-leg trousers, sculpted leather tote',
    altAr: 'إطلالة المساء المتكاملة من رِفْعة — حرير طبيعي وبنطال واسع وحقيبة جلدية',
    altEn: 'Complete Evening Look by RIFAA — Mulberry Silk, Tailored Trousers & Leather Tote',
    focalPosition: 'center 25%',
  },

  // In-Depth Department Features
  featureWomenCoat: {
    id: 'feature-women-coat-01',
    src: '/images/feature_women_coat.jpg',
    department: 'women',
    role: 'campaign',
    subject: 'Saudi woman in camel wool coat over crepe abaya in Diriyah',
    altAr: 'مجموعة المرأة: قوةٌ بهدوء — معاطف صوف وعبايات انسيابية',
    altEn: 'Women Feature: Quietly Commanding — Virgin Wool Outerwear & Crepe Abayas',
    focalPosition: 'center 20%',
  },
  featureMenBisht: {
    id: 'feature-men-bisht-01',
    src: '/images/feature_men_bisht.jpg',
    department: 'men',
    role: 'campaign',
    subject: 'Saudi man in ceremonial black bisht with matte gold embroidery over white thobe',
    altAr: 'مجموعة الرجل: حضورٌ محسوب — بشت سعودي عصري وثوب تفصيل',
    altEn: 'Men Feature: Considered Presence — Contemporary Bisht & Bespoke Thobe',
    focalPosition: 'center 20%',
  },
  featureKidsPlay: {
    id: 'feature-kids-play-01',
    src: '/images/feature_kids_play.jpg',
    department: 'kids',
    role: 'campaign',
    subject: 'Saudi children wearing organic cotton and linen playwear in sunny Riyadh terrace',
    altAr: 'مجموعة الأطفال: مساحةٌ للحركة — أطقم قطن عضوي مريحة',
    altEn: 'Kids Feature: Made to Move — Breathable Organic Cotton & Linen',
    focalPosition: 'center',
  },

  // Seasonal Drop: Eid Edit 2026
  seasonalDropEid: {
    id: 'drop-eid-edit-01',
    src: '/images/eid_edit_occasion.jpg',
    department: 'family',
    role: 'campaign',
    subject: 'Eid occasionwear campaign in deep oxblood and dark mahogany ambience',
    altAr: 'تحرير العيد 2026 — إطلالات منتقاة لمناسبات المملكة',
    altEn: 'The Eid Edit 2026 — Curated Occasionwear for Saudi Festivities',
    focalPosition: 'center',
  },
};
