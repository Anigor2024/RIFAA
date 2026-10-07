'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogPageContent } from '@/components/catalog/CatalogPageContent';
import { DEMO_PRODUCTS } from '@/data/products';
import { MEDIA_MANIFEST } from '@/data/media';

export default function WomenPage() {
  const searchParams = useSearchParams();
  const initialCategoryKey = searchParams.get('category') || 'all';
  const womenProducts = DEMO_PRODUCTS.filter((p) => p.department === 'women');

  return (
    <CatalogPageContent
      key={initialCategoryKey}
      department="women"
      initialCategoryKey={initialCategoryKey}
      titleAr="مجموعة المرأة"
      titleEn="Women’s Collection"
      subtitleAr="عبايات كريب ياباني، بليزرات صوف بقصّات هندسية، وحرير طبيعي انسيابي لأناقة معاصرة تعكس رصانة المرأة في المملكة."
      subtitleEn="Sculptural Japanese crepe abayas, virgin wool tailoring, and mulberry silk silhouettes designed for effortless poise."
      heroImage={MEDIA_MANIFEST.categoryWomen.src}
      products={womenProducts}
    />
  );
}
