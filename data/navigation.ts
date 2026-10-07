export type MegaNavKey =
  | 'women'
  | 'men'
  | 'kids'
  | 'new'
  | 'collections'
  | 'studio'
  | 'editorial'
  | 'sale';

export interface MegaNavItem {
  href: string;
  ar: string;
  en: string;
  noteAr?: string;
  noteEn?: string;
}

export interface MegaNavGroup {
  titleAr: string;
  titleEn: string;
  items: MegaNavItem[];
}

export interface MegaNavConfig {
  key: MegaNavKey;
  href: string;
  labelAr: string;
  labelEn: string;
  eyebrowAr: string;
  eyebrowEn: string;
  descriptionAr: string;
  descriptionEn: string;
  ctaAr: string;
  ctaEn: string;
  featuredProductId?: string;
  groups: MegaNavGroup[];
}

export const MEGA_NAVIGATION: MegaNavConfig[] = [
  {
    key: 'women',
    href: '/women',
    labelAr: 'النساء',
    labelEn: 'Women',
    eyebrowAr: 'تحرير المرأة',
    eyebrowEn: 'WOMEN’S EDIT',
    descriptionAr: 'عبايات معمارية، تفصيل معاصر، وقطع أساسية مصممة لإيقاع الحياة في المملكة.',
    descriptionEn: 'Architectural abayas, modern tailoring and wardrobe essentials for life in the Kingdom.',
    ctaAr: 'اكتشف مجموعة النساء',
    ctaEn: 'Explore Women',
    featuredProductId: 'w-02',
    groups: [
      {
        titleAr: 'تسوّق حسب الفئة',
        titleEn: 'Shop by category',
        items: [
          { href: '/women?category=abayas', ar: 'العبايات والمناسبات', en: 'Abayas & Occasions' },
          { href: '/women?category=coords', ar: 'الأطقم المنسقة', en: 'Co-ords & Sets' },
          { href: '/women?category=blazers', ar: 'البليزرات والجاكيتات', en: 'Blazers & Jackets' },
          { href: '/women?category=tops', ar: 'القمصان والتوبات', en: 'Tops & Blouses' },
        ],
      },
      {
        titleAr: 'مسارات سريعة',
        titleEn: 'Quick paths',
        items: [
          { href: '/new', ar: 'وصل حديثاً', en: 'New In', noteAr: 'أحدث الإضافات', noteEn: 'Latest arrivals' },
          { href: '/collections?collection=eid-edit-2026', ar: 'تحرير العيد', en: 'The Eid Edit', noteAr: 'مناسبات مختارة', noteEn: 'Occasion edit' },
          { href: '/pairing', ar: 'أكمل الإطلالة', en: 'Pairing Studio', noteAr: 'تنسيق ذكي', noteEn: 'Intelligent pairing' },
        ],
      },
    ],
  },
  {
    key: 'men',
    href: '/men',
    labelAr: 'الرجال',
    labelEn: 'Men',
    eyebrowAr: 'تحرير الرجل',
    eyebrowEn: 'MEN’S EDIT',
    descriptionAr: 'ثياب سعودية، بشوت للمناسبات، وطبقات معاصرة بهدوء بصري محسوب.',
    descriptionEn: 'Saudi thobes, ceremonial bishts and considered contemporary layers.',
    ctaAr: 'اكتشف مجموعة الرجال',
    ctaEn: 'Explore Men',
    featuredProductId: 'm-01',
    groups: [
      {
        titleAr: 'تسوّق حسب الفئة',
        titleEn: 'Shop by category',
        items: [
          { href: '/men?category=thobes', ar: 'الثياب الرسمية', en: 'Bespoke Thobes' },
          { href: '/men?category=bishts', ar: 'البشوت والمناسبات', en: 'Bishts & Ceremonial' },
          { href: '/men?category=outerwear', ar: 'الطبقات الخارجية', en: 'Outerwear & Jackets' },
          { href: '/men?category=polos', ar: 'القمصان والبولو', en: 'Shirts & Polos' },
        ],
      },
      {
        titleAr: 'مسارات سريعة',
        titleEn: 'Quick paths',
        items: [
          { href: '/new', ar: 'الجديد', en: 'New In', noteAr: 'آخر التحريرات', noteEn: 'Latest edit' },
          { href: '/atelier?edit=ceremonial-presence', ar: 'حضور المناسبة', en: 'Ceremonial Presence', noteAr: 'إطلالة متكاملة', noteEn: 'Complete edit' },
          { href: '/compare', ar: 'قارن القطع', en: 'Compare Pieces', noteAr: 'قرار أوضح', noteEn: 'Sharper decision' },
        ],
      },
    ],
  },
  {
    key: 'kids',
    href: '/kids',
    labelAr: 'الأطفال',
    labelEn: 'Kids',
    eyebrowAr: 'تحرير الصغار',
    eyebrowEn: 'KIDS’ EDIT',
    descriptionAr: 'تفصيل أنيق وراحة للحركة، من الثياب المصغرة إلى فساتين المناسبات والأطقم اليومية.',
    descriptionEn: 'Tailored polish with room to move, from miniature thobes to occasion dresses and everyday sets.',
    ctaAr: 'اكتشف مجموعة الأطفال',
    ctaEn: 'Explore Kids',
    featuredProductId: 'k-03',
    groups: [
      {
        titleAr: 'الأولاد',
        titleEn: 'Boys',
        items: [
          { href: '/kids?category=boys-thobes', ar: 'ثياب الأولاد', en: 'Boys’ Thobes' },
          { href: '/kids?category=boys-shirts', ar: 'قمصان الأولاد', en: 'Boys’ Shirts' },
          { href: '/kids?category=boys-blazers', ar: 'البليزرات', en: 'Boys’ Blazers' },
        ],
      },
      {
        titleAr: 'البنات والصغار',
        titleEn: 'Girls & Little Ones',
        items: [
          { href: '/kids?category=girls-dresses', ar: 'فساتين البنات', en: 'Girls’ Dresses' },
          { href: '/kids?category=girls-sets', ar: 'أطقم البنات', en: 'Girls’ Sets' },
          { href: '/kids?category=babywear', ar: 'ملابس الرضع', en: 'Babywear' },
        ],
      },
    ],
  },
  {
    key: 'new',
    href: '/new',
    labelAr: 'وصل حديثاً',
    labelEn: 'New In',
    eyebrowAr: 'آخر الوصولات',
    eyebrowEn: 'LATEST ARRIVALS',
    descriptionAr: 'تحرير متجدد من أحدث القطع عبر أقسام رِفْعة، مع وصول أسرع للأكثر تميزاً.',
    descriptionEn: 'A fresh edit of the latest pieces across RIFAA, with faster paths to standout arrivals.',
    ctaAr: 'استكشف كل الجديد',
    ctaEn: 'Explore All New In',
    featuredProductId: 'w-03',
    groups: [
      {
        titleAr: 'حسب القسم',
        titleEn: 'By department',
        items: [
          { href: '/women', ar: 'جديد النساء', en: 'Women’s New Edit' },
          { href: '/men', ar: 'جديد الرجال', en: 'Men’s New Edit' },
          { href: '/kids', ar: 'جديد الأطفال', en: 'Kids’ New Edit' },
        ],
      },
      {
        titleAr: 'استكشف أكثر',
        titleEn: 'Explore further',
        items: [
          { href: '/editorial', ar: 'المجلة', en: 'Journal', noteAr: 'السرد التحريري', noteEn: 'Editorial stories' },
          { href: '/discover', ar: 'منسّق رِفْعة', en: 'RIFAA Curator', noteAr: 'اختيار شخصي', noteEn: 'Personal edit' },
        ],
      },
    ],
  },
  {
    key: 'collections',
    href: '/collections',
    labelAr: 'التشكيلات',
    labelEn: 'Collections',
    eyebrowAr: 'تشكيلات الدار',
    eyebrowEn: 'HOUSE COLLECTIONS',
    descriptionAr: 'تحرير العيد، أساسيات رِفْعة، وخريف / شتاء في مسارات واضحة قابلة للفلترة مباشرة.',
    descriptionEn: 'The Eid Edit, Core Essentials and Autumn / Winter in directly filterable collection paths.',
    ctaAr: 'كل التشكيلات',
    ctaEn: 'All Collections',
    featuredProductId: 'w-01',
    groups: [
      {
        titleAr: 'التشكيلات',
        titleEn: 'Collections',
        items: [
          { href: '/collections?collection=eid-edit-2026', ar: 'تحرير العيد 2026', en: 'The Eid Edit 2026' },
          { href: '/collections?collection=autumn-winter-2026', ar: 'خريف / شتاء 2026', en: 'Autumn / Winter 2026' },
          { href: '/collections?collection=core-essentials', ar: 'أساسيات رِفْعة', en: 'Core Essentials' },
          { href: '/collections?collection=occasion', ar: 'المناسبات', en: 'Grand Occasions' },
        ],
      },
      {
        titleAr: 'حسب التجربة',
        titleEn: 'By experience',
        items: [
          { href: '/capsule', ar: 'استوديو الكابسولة', en: 'Capsule Studio' },
          { href: '/atelier', ar: 'مشغل رِفْعة', en: 'RIFAA Atelier' },
          { href: '/pairing', ar: 'تنسيق القطع', en: 'Pairing Studio' },
        ],
      },
    ],
  },
  {
    key: 'studio',
    href: '/studio',
    labelAr: 'الاستوديو',
    labelEn: 'Studio',
    eyebrowAr: 'أدوات القرار',
    eyebrowEn: 'DECISION TOOLS',
    descriptionAr: 'مساحة واحدة تجمع الاكتشاف، التنسيق، المقارنة، الكابسولة، جواز الأسلوب والكونسيرج.',
    descriptionEn: 'One workspace for discovery, styling, comparison, capsules, Style Passport and Concierge.',
    ctaAr: 'افتح استوديو رِفْعة',
    ctaEn: 'Open RIFAA Studio',
    featuredProductId: 'm-05',
    groups: [
      {
        titleAr: 'اكتشف ونسّق',
        titleEn: 'Discover & compose',
        items: [
          { href: '/discover', ar: 'منسّق رِفْعة', en: 'RIFAA Curator', noteAr: 'ترشيحات حسب المناسبة', noteEn: 'Moment-aware recommendations' },
          { href: '/atelier', ar: 'مشغل رِفْعة', en: 'RIFAA Atelier', noteAr: 'إطلالة كاملة', noteEn: 'Compose a full edit' },
          { href: '/pairing', ar: 'تنسيق القطع', en: 'Pairing Studio', noteAr: 'أكمل القطعة', noteEn: 'Complete the piece' },
        ],
      },
      {
        titleAr: 'قرّر واحتفظ',
        titleEn: 'Decide & retain',
        items: [
          { href: '/compare', ar: 'استوديو المقارنة', en: 'Compare Studio', noteAr: 'حتى 3 قطع', noteEn: 'Up to 3 pieces' },
          { href: '/capsule', ar: 'استوديو الكابسولة', en: 'Capsule Studio', noteAr: 'خمس وظائف', noteEn: 'Five wardrobe roles' },
          { href: '/passport', ar: 'جواز الأسلوب', en: 'Style Passport', noteAr: 'تفضيلات محلية', noteEn: 'Local preferences' },
          { href: '/concierge', ar: 'كونسيرج رِفْعة', en: 'RIFAA Concierge', noteAr: 'الخطوة التالية', noteEn: 'Next best action' },
        ],
      },
    ],
  },
  {
    key: 'editorial',
    href: '/editorial',
    labelAr: 'الإطلالات',
    labelEn: 'Editorial',
    eyebrowAr: 'مجلة رِفْعة',
    eyebrowEn: 'RIFAA JOURNAL',
    descriptionAr: 'قصص عن التفصيل والخامة والثقافة البصرية السعودية المعاصرة.',
    descriptionEn: 'Stories on tailoring, materials and contemporary Saudi visual culture.',
    ctaAr: 'اقرأ مجلة رِفْعة',
    ctaEn: 'Read RIFAA Journal',
    featuredProductId: 'w-09',
    groups: [
      {
        titleAr: 'اقرأ واستكشف',
        titleEn: 'Read & explore',
        items: [
          { href: '/editorial', ar: 'كل المقالات', en: 'All Stories' },
          { href: '/sustainability', ar: 'الحرفة والاستدامة', en: 'Craft & Sustainability' },
          { href: '/about', ar: 'عن رِفْعة', en: 'About RIFAA' },
        ],
      },
      {
        titleAr: 'من القصة إلى القطعة',
        titleEn: 'From story to piece',
        items: [
          { href: '/collections', ar: 'التشكيلات', en: 'Collections' },
          { href: '/materials', ar: 'تفاصيل الخامات', en: 'Material Intelligence' },
        ],
      },
    ],
  },
  {
    key: 'sale',
    href: '/sale',
    labelAr: 'التخفيضات',
    labelEn: 'Sale',
    eyebrowAr: 'اختيارات أرشيفية',
    eyebrowEn: 'ARCHIVAL REDUCTIONS',
    descriptionAr: 'قطع موسمية مختارة بأسعار مميزة مع الحفاظ على تجربة رِفْعة الكاملة.',
    descriptionEn: 'Selected seasonal pieces at privileged pricing with the full RIFAA experience intact.',
    ctaAr: 'استكشف التخفيضات',
    ctaEn: 'Explore Sale',
    featuredProductId: 'w-01',
    groups: [
      {
        titleAr: 'تسوّق التخفيضات',
        titleEn: 'Shop reductions',
        items: [
          { href: '/sale', ar: 'كل التخفيضات', en: 'All Reductions' },
          { href: '/women', ar: 'النساء', en: 'Women' },
          { href: '/men', ar: 'الرجال', en: 'Men' },
          { href: '/kids', ar: 'الأطفال', en: 'Kids' },
        ],
      },
      {
        titleAr: 'قبل القرار',
        titleEn: 'Before deciding',
        items: [
          { href: '/compare', ar: 'قارن القطع', en: 'Compare Pieces' },
          { href: '/size-guide', ar: 'دليل المقاسات', en: 'Size Guide' },
        ],
      },
    ],
  },
];
