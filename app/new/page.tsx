'use client';

import React from 'react';
import { CatalogView } from '@/components/catalog/CatalogView';
import { DEMO_PRODUCTS } from '@/data/products';

export default function NewArrivalsPage() {
  const newProducts = DEMO_PRODUCTS.filter((p) => p.isNew);

  return (
    <CatalogView
      titleAr="وصل حديثاً"
      titleEn="New In"
      subtitleAr="أحدث الإضافات إلى مجموعات رِفْعة لموسم خريف وشتاء 2026."
      subtitleEn="The latest additions to the RIFAA wardrobe for Autumn / Winter 2026."
      initialProducts={newProducts.length > 0 ? newProducts : DEMO_PRODUCTS}
    />
  );
}
