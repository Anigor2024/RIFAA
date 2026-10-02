'use client';

import React from 'react';
import { CatalogView } from '@/components/catalog/CatalogView';
import { DEMO_PRODUCTS } from '@/data/products';

export default function CollectionsPage() {
  return (
    <CatalogView
      titleAr="التشكيلات الموسمية"
      titleEn="Seasonal Collections"
      subtitleAr="مختارات من تحرير العيد 2026، أساسيات رِفْعة، وتشكيلة خريف / شتاء."
      subtitleEn="Curations from The Eid Edit 2026, Core Wardrobe Essentials, and Autumn / Winter."
      initialProducts={DEMO_PRODUCTS}
    />
  );
}
