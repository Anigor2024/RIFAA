'use client';

import React from 'react';
import { CatalogView } from '@/components/catalog/CatalogView';
import { DEMO_PRODUCTS } from '@/data/products';

export default function SalePage() {
  const saleProducts = DEMO_PRODUCTS.filter((p) => Boolean(p.oldPrice));

  return (
    <CatalogView
      titleAr="التخفيضات الاستثنائية"
      titleEn="Archival Reductions"
      subtitleAr="قطع مختارة من المواسم السابقة بأسعار مميزة، مع الاحتفاظ بذات معايير الجودة والحرفية."
      subtitleEn="Curated seasonal archival pieces presented at privileged pricing, upholding RIFAA’s uncompromising craftsmanship."
      initialProducts={saleProducts.length > 0 ? saleProducts : DEMO_PRODUCTS.slice(0, 8)}
    />
  );
}
