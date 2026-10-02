'use client';

import React from 'react';
import { CatalogPageContent } from '@/components/catalog/CatalogPageContent';
import { DEMO_PRODUCTS } from '@/data/products';

export default function SalePage() {
  const saleProducts = DEMO_PRODUCTS.filter((p) => Boolean(p.oldPrice));

  return (
    <CatalogPageContent
      titleAr="التخفيضات الاستثنائية"
      titleEn="Archival Reductions"
      subtitleAr="قطع مختارة من المواسم السابقة بأسعار مميزة، مع الاحتفاظ بذات معايير الجودة والحرفية."
      subtitleEn="Curated seasonal archival pieces presented at privileged pricing, upholding RIFAA’s uncompromising craftsmanship."
      products={saleProducts.length > 0 ? saleProducts : DEMO_PRODUCTS.slice(0, 8)}
    />
  );
}
