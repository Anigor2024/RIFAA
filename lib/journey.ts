export interface JourneySignals {
  passportConfigured: boolean;
  viewedCount: number;
  wishlistCount: number;
  compareCount: number;
  bagCount: number;
  orderCount: number;
}

export type JourneyMilestoneKey =
  | 'taste'
  | 'explore'
  | 'shortlist'
  | 'decide'
  | 'ready';

export interface JourneyMilestone {
  key: JourneyMilestoneKey;
  complete: boolean;
  labelAr: string;
  labelEn: string;
  noteAr: string;
  noteEn: string;
}

export interface JourneyAction {
  href: string;
  labelAr: string;
  labelEn: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  eyebrowAr: string;
  eyebrowEn: string;
}

export interface JourneyPlan {
  milestones: JourneyMilestone[];
  completedCount: number;
  progress: number;
  nextAction: JourneyAction;
}

export function getJourneyPlan(signals: JourneySignals): JourneyPlan {
  const milestones: JourneyMilestone[] = [
    {
      key: 'taste',
      complete: signals.passportConfigured,
      labelAr: 'عرّف ذوقك',
      labelEn: 'Define taste',
      noteAr: 'جواز الأسلوب يحدد نقطة بداية قابلة للتعديل.',
      noteEn: 'Style Passport creates an editable starting point.',
    },
    {
      key: 'explore',
      complete: signals.viewedCount > 0,
      labelAr: 'استكشف',
      labelEn: 'Explore',
      noteAr: 'مشاهدة قطعة واحدة على الأقل تضيف سياقاً للرحلة.',
      noteEn: 'Viewing at least one piece adds context to the journey.',
    },
    {
      key: 'shortlist',
      complete: signals.wishlistCount > 0,
      labelAr: 'اختصر القائمة',
      labelEn: 'Shortlist',
      noteAr: 'احفظ القطع التي تستحق الرجوع لها.',
      noteEn: 'Save pieces worth returning to.',
    },
    {
      key: 'decide',
      complete: signals.compareCount > 0,
      labelAr: 'قارن',
      labelEn: 'Compare',
      noteAr: 'المقارنة تحوّل الانطباع إلى قرار أوضح.',
      noteEn: 'Comparison turns impressions into a clearer decision.',
    },
    {
      key: 'ready',
      complete: signals.bagCount > 0,
      labelAr: 'جاهز للمراجعة',
      labelEn: 'Ready to review',
      noteAr: 'وجود قطعة في الحقيبة يعني أن الرحلة وصلت لمرحلة المراجعة.',
      noteEn: 'A bag item means the journey has reached review.',
    },
  ];

  const completedCount = milestones.filter((item) => item.complete).length;
  const progress = Math.round((completedCount / milestones.length) * 100);

  let nextAction: JourneyAction;

  if (signals.bagCount > 0) {
    nextAction = {
      href: '/checkout',
      labelAr: 'راجع الطلب',
      labelEn: 'Review checkout',
      titleAr: 'الحقيبة جاهزة للمراجعة النهائية.',
      titleEn: 'Your bag is ready for final review.',
      bodyAr: 'راجع المقاسات والألوان والتوصيل قبل الانتقال إلى تأكيد الطلب التجريبي.',
      bodyEn: 'Review sizes, colors and delivery before moving into the demo order confirmation flow.',
      eyebrowAr: 'الخطوة التالية · المراجعة',
      eyebrowEn: 'NEXT BEST ACTION · REVIEW',
    };
  } else if (signals.compareCount > 0) {
    nextAction = {
      href: '/compare',
      labelAr: 'أكمل المقارنة',
      labelEn: 'Continue comparison',
      titleAr: 'عندك مقارنة مفتوحة تستحق الحسم.',
      titleEn: 'You have an open comparison worth resolving.',
      bodyAr: 'راجع الخامة والتفصيل والعناية والسعر جنباً إلى جنب قبل نقل قطعة إلى الحقيبة.',
      bodyEn: 'Review fabric, tailoring, care and price side by side before moving a piece to bag.',
      eyebrowAr: 'الخطوة التالية · القرار',
      eyebrowEn: 'NEXT BEST ACTION · DECIDE',
    };
  } else if (signals.wishlistCount > 0) {
    nextAction = {
      href: '/wishlist',
      labelAr: 'راجع القائمة القصيرة',
      labelEn: 'Review shortlist',
      titleAr: 'القطع المحفوظة هي أفضل نقطة للقرار الآن.',
      titleEn: 'Your saved pieces are the strongest decision point now.',
      bodyAr: 'افتح المفضلة، قرّب أفضل قطعتين أو ثلاث للمقارنة، ثم اختصر القرار.',
      bodyEn: 'Open wishlist, move the strongest two or three pieces into Compare, then narrow the decision.',
      eyebrowAr: 'الخطوة التالية · القائمة القصيرة',
      eyebrowEn: 'NEXT BEST ACTION · SHORTLIST',
    };
  } else if (signals.viewedCount > 0) {
    nextAction = {
      href: '/studio',
      labelAr: 'حوّل التصفح إلى اختيار',
      labelEn: 'Turn browsing into an edit',
      titleAr: 'بدأت الاستكشاف؛ الآن حان وقت تضييق الاختيارات.',
      titleEn: 'You have started exploring; now narrow the field.',
      bodyAr: 'استخدم الاستوديو للانتقال من المشاهدة العامة إلى منسّق أو كابسولة أو إطلالة متكاملة.',
      bodyEn: 'Use Studio to move from open browsing into a Curator edit, Capsule or composed look.',
      eyebrowAr: 'الخطوة التالية · التنظيم',
      eyebrowEn: 'NEXT BEST ACTION · ORGANIZE',
    };
  } else if (signals.passportConfigured) {
    nextAction = {
      href: '/discover',
      labelAr: 'ابدأ بالمنسّق',
      labelEn: 'Start with Curator',
      titleAr: 'ذوقك محفوظ؛ افتح أول تحرير شخصي.',
      titleEn: 'Your taste baseline is ready; open your first personal edit.',
      bodyAr: 'المنسّق يستخدم الجمهور والمناسبة وأولوية الاختيار لبدء التصفح من نقطة أقرب لك.',
      bodyEn: 'Curator uses audience, moment and decision priority to start closer to your preferences.',
      eyebrowAr: 'الخطوة التالية · الاكتشاف',
      eyebrowEn: 'NEXT BEST ACTION · DISCOVER',
    };
  } else {
    nextAction = {
      href: '/passport',
      labelAr: 'أنشئ جواز الأسلوب',
      labelEn: 'Create Style Passport',
      titleAr: 'ابدأ بأربع تفضيلات فقط.',
      titleEn: 'Start with just four preferences.',
      bodyAr: 'حدد الجمهور والمناسبة ولوحة الألوان وأولوية الاختيار. تُحفظ هذه التفضيلات محلياً على جهازك.',
      bodyEn: 'Define audience, moment, palette and decision priority. These preferences stay locally on your device.',
      eyebrowAr: 'الخطوة التالية · نقطة البداية',
      eyebrowEn: 'NEXT BEST ACTION · START',
    };
  }

  return {
    milestones,
    completedCount,
    progress,
    nextAction,
  };
}
