'use client';

import React from 'react';
import { CatalogView } from '@/components/catalog/CatalogView';
import { DEMO_PRODUCTS } from '@/data/products';

export default function WomenPage() {
  const womenProducts = DEMO_PRODUCTS.filter((p) => p.department === 'women');

  return (
    <CatalogView
      titleAr="مجموعة المرأة"
      titleEn="Women’s Collection"
      subtitleAr="عبايات كريب ياباني، بليزرات صوف بقصّات هندسية، وحرير طبيعي انسيابي لأناقة معاصرة."
      subtitleEn="Sculptural Japanese crepe abayas, virgin wool tailoring, and mulberry silk silhouettes designed for effortless poise."
      department="women"
      initialProducts={womenProducts}
    />
  );
}
