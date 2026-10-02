'use client';

import React from 'react';
import { CatalogPageContent } from '@/components/catalog/CatalogPageContent';
import { DEMO_PRODUCTS } from '@/data/products';
import { MEDIA_MANIFEST } from '@/data/media';

export default function WomenPage() {
  const womenProducts = DEMO_PRODUCTS.filter((p) => p.department === 'women');

  return (
    <CatalogPageContent
      department="women"
      titleAr="مجموعة المرأة"
      titleEn="Women’s Collection"
      subtitleAr="عبايات كريب ياباني، بليزرات صوف بقصّات هندسية، وحرير طبيعي انسيابي لأناقة معاصرة تعكس رصانة المرأة في المملكة."
      subtitleEn="Sculptural Japanese crepe abayas, virgin wool tailoring, and mulberry silk silhouettes designed for effortless poise."
      heroImage={MEDIA_MANIFEST.categoryWomen.src}
      products={womenProducts}
    />
  );
}
