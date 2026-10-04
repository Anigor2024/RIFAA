export interface AtelierEdit {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  departmentAr: string;
  departmentEn: string;
  productIds: string[];
}

export const ATELIER_EDITS: AtelierEdit[] = [
  {
    id: 'evening-poise',
    titleAr: 'هدوء المساء',
    titleEn: 'Evening Poise',
    subtitleAr: 'حرير · تفصيل · جلد منحوت',
    subtitleEn: 'Silk · Tailoring · Sculpted Leather',
    descriptionAr:
      'إطلالة نسائية معاصرة تبدأ بحرير طبيعي ناعم، تتوازن ببنطال واسع مضبوط، وتنتهي بحقيبة جلدية ذات حضور معماري.',
    descriptionEn:
      'A contemporary women’s edit built around fluid silk, balanced by precise wide-leg tailoring and finished with sculpted leather.',
    departmentAr: 'تحرير المرأة',
    departmentEn: 'Women’s Edit',
    productIds: ['w-08', 'w-09', 'w-11'],
  },
  {
    id: 'ceremonial-presence',
    titleAr: 'حضور المناسبة',
    titleEn: 'Ceremonial Presence',
    subtitleAr: 'ثوب · بشت · جلد فاخر',
    subtitleEn: 'Thobe · Bisht · Refined Leather',
    descriptionAr:
      'تركيب رجالي رسمي يوازن بين نقاء الثوب السعودي، هيبة البشت، وقطعة جلدية عملية تضيف لمسة حضرية محسوبة.',
    descriptionEn:
      'A formal men’s composition balancing the clarity of a Saudi thobe, the authority of a bisht and a refined leather finish.',
    departmentAr: 'تحرير الرجل',
    departmentEn: 'Men’s Edit',
    productIds: ['m-01', 'm-05', 'm-12'],
  },
  {
    id: 'young-occasion',
    titleAr: 'مناسبة صغيرة بتفاصيل كبيرة',
    titleEn: 'Little Occasion, Considered',
    subtitleAr: 'كتان · بليزر · راحة للحركة',
    subtitleEn: 'Linen · Blazer · Easy Movement',
    descriptionAr:
      'إطلالة أطفال متوازنة للمناسبات تعتمد على طبقات مريحة وخامات لطيفة، مع تفصيل واضح يسمح بالحركة دون فقدان الأناقة.',
    descriptionEn:
      'A children’s occasion edit using comfortable layers, gentle fabrication and tailored structure without restricting movement.',
    departmentAr: 'تحرير الأطفال',
    departmentEn: 'Kids’ Edit',
    productIds: ['k-03', 'k-04', 'k-05'],
  },
];
