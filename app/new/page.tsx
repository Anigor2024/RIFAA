'use client';

import React from 'react';
import { CatalogPageContent } from '@/components/catalog/CatalogPageContent';
import { DEMO_PRODUCTS } from '@/data/products';
import { MEDIA_MANIFEST } from '@/data/media';

export default function NewArrivalsPage() {
  const newProducts = DEMO_PRODUCTS.filter((p) => p.isNew);

  return (
    <CatalogPageContent
      titleAr="وصل حديثاً"
      titleEn="New In"
      subtitleAr="أحدث الإضافات إلى خزانة دار رِفْعة لموسم خريف وشتاء 2026 في المملكة."
      subtitleEn="The latest additions to the RIFAA wardrobe for Autumn / Winter 2026."
      heroImage={MEDIA_MANIFEST.heroCampaign.src}
      products={newProducts.length > 0 ? newProducts : DEMO_PRODUCTS}
    />
  );
}
