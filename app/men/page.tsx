'use client';

import React from 'react';
import { CatalogView } from '@/components/catalog/CatalogView';
import { DEMO_PRODUCTS } from '@/data/products';

export default function MenPage() {
  const menProducts = DEMO_PRODUCTS.filter((p) => p.department === 'men');

  return (
    <CatalogView
      titleAr="مجموعة الرجل"
      titleEn="Men’s Collection"
      subtitleAr="أوفرشيرت صوف مضغوط، قمصان كتان مغسول، وبناطيل تفصيل بقصّات معاصرة."
      subtitleEn="Italian boiled wool overshirts, washed French flax shirts, and relaxed tailored trousers crafted for metropolitan poise."
      department="men"
      initialProducts={menProducts}
    />
  );
}
