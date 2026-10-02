'use client';

import React from 'react';
import { CatalogView } from '@/components/catalog/CatalogView';
import { DEMO_PRODUCTS } from '@/data/products';

export default function KidsPage() {
  const kidsProducts = DEMO_PRODUCTS.filter((p) => p.department === 'kids');

  return (
    <CatalogView
      titleAr="مجموعة الأطفال"
      titleEn="Kids’ Collection"
      subtitleAr="أطقم قطن عضوي معتمد، فساتين كتان للمناسبات، وقطع مريحة لحركة الصغار بحرية وأناقة."
      subtitleEn="GOTS-certified organic cotton knits, breathable linen occasion dresses, and refined coordinates for modern family living."
      department="kids"
      initialProducts={kidsProducts}
    />
  );
}
