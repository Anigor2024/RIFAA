'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogPageContent } from '@/components/catalog/CatalogPageContent';
import { DEMO_PRODUCTS } from '@/data/products';
import { MEDIA_MANIFEST } from '@/data/media';

export default function KidsPage() {
  const searchParams = useSearchParams();
  const initialCategoryKey = searchParams.get('category') || 'all';
  const kidsProducts = DEMO_PRODUCTS.filter((p) => p.department === 'kids');

  return (
    <CatalogPageContent
      key={initialCategoryKey}
      department="kids"
      initialCategoryKey={initialCategoryKey}
      titleAr="مجموعة الأطفال"
      titleEn="Kids’ Collection"
      subtitleAr="ثياب أولاد مفصلة بعناية، فساتين كتان وبشوت خفيفة للمناسبات، وأطقم قطن عضوي لطيفة على بشرة الصغار."
      subtitleEn="Tailored miniature thobes, tiered linen occasion dresses, and certified organic cotton coordinates designed for joyful movement."
      heroImage={MEDIA_MANIFEST.categoryKids.src}
      products={kidsProducts}
    />
  );
}
