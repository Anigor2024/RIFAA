import { Hero } from '@/components/home/Hero';
import { CategoryEditorial } from '@/components/home/CategoryEditorial';
import { NewArrivals } from '@/components/home/NewArrivals';
import { ShopTheEdit } from '@/components/home/ShopTheEdit';
import { ShopTheLook } from '@/components/home/ShopTheLook';
import { DepartmentFeatures } from '@/components/home/DepartmentFeatures';
import { SeasonalDrop } from '@/components/home/SeasonalDrop';
import { JournalSection } from '@/components/home/JournalSection';
import { TrustStrip } from '@/components/home/TrustStrip';
import { Newsletter } from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* 1. Cinematic Full-Viewport Hero */}
      <Hero />

      {/* 2. Asymmetric Category Editorial (Women / Men / Kids) */}
      <CategoryEditorial />

      {/* 3. Filterable New Arrivals Discovery */}
      <NewArrivals />

      {/* 4. The RIFAA Edit: "City After Sunset" */}
      <ShopTheEdit />

      {/* 5. Shop The Look: Curated Ensemble with Coordinates */}
      <ShopTheLook />

      {/* 6. In-Depth Department Features (Women / Men / Kids) */}
      <DepartmentFeatures />

      {/* 7. High-Contrast Seasonal Drop: The Eid Edit 2026 */}
      <SeasonalDrop />

      {/* 8. RIFAA Journal Magazine Stories */}
      <JournalSection />

      {/* 9. Standards & Trust Strip */}
      <TrustStrip />

      {/* 10. Newsletter Invitation */}
      <Newsletter />
    </main>
  );
}
