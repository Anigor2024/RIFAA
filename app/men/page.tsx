'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogPageContent } from '@/components/catalog/CatalogPageContent';
import { DEMO_PRODUCTS } from '@/data/products';
import { MEDIA_MANIFEST } from '@/data/media';

export default function MenPage() {
  const searchParams = useSearchParams();
  const initialCategoryKey = searchParams.get('category') || 'all';
  const menProducts = DEMO_PRODUCTS.filter((p) => p.department === 'men');

  return (
    <CatalogPageContent
      key={initialCategoryKey}
      department="men"
      initialCategoryKey={initialCategoryKey}
      titleAr="مجموعة الرجل"
      titleEn="Men’s Collection"
      subtitleAr="ثياب سعودية كلاسيكية بقماش ياباني معتمد، بشوت مناسبات فاخرة، وأوفرشيرت صوف مضغوط لإيقاع الحياة المعاصرة في المملكة."
      subtitleEn="Bespoke Saudi thobes in certified Japanese fabrics, ceremonial bishts, and dense boiled wool overshirts tailored for metropolitan poise."
      heroImage={MEDIA_MANIFEST.categoryMen.src}
      products={menProducts}
    />
  );
}
