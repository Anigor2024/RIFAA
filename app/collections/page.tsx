'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogPageContent } from '@/components/catalog/CatalogPageContent';
import { DEMO_PRODUCTS } from '@/data/products';
import { MEDIA_MANIFEST } from '@/data/media';

export default function CollectionsPage() {
  const searchParams = useSearchParams();
  const initialCollectionKey = searchParams.get('collection') || 'all';

  return (
    <CatalogPageContent
      key={initialCollectionKey}
      initialCollectionKey={initialCollectionKey}
      titleAr="التشكيلات الموسمية"
      titleEn="Seasonal Collections"
      subtitleAr="مختارات من تحرير العيد 2026، أساسيات رِفْعة، وتشكيلة خريف / شتاء."
      subtitleEn="Curations from The Eid Edit 2026, Core Wardrobe Essentials, and Autumn / Winter."
      heroImage={MEDIA_MANIFEST.seasonalDropEid.src}
      products={DEMO_PRODUCTS}
    />
  );
}
