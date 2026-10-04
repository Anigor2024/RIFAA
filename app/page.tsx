import { Hero } from '@/components/home/Hero';
import { ExperienceIndex } from '@/components/home/ExperienceIndex';
import { CategoryEditorial } from '@/components/home/CategoryEditorial';
import { NewArrivals } from '@/components/home/NewArrivals';
import { StyleConcierge } from '@/components/home/StyleConcierge';
import { ShopTheEdit } from '@/components/home/ShopTheEdit';
import { ShopTheLook } from '@/components/home/ShopTheLook';
import { AtelierPreview } from '@/components/home/AtelierPreview';
import { MaterialLibrary } from '@/components/home/MaterialLibrary';
import { WardrobeBoard } from '@/components/home/WardrobeBoard';
import { DepartmentFeatures } from '@/components/home/DepartmentFeatures';
import { HouseSignature } from '@/components/home/HouseSignature';
import { SeasonalDrop } from '@/components/home/SeasonalDrop';
import { JournalSection } from '@/components/home/JournalSection';
import { TrustStrip } from '@/components/home/TrustStrip';
import { Newsletter } from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />
      <ExperienceIndex />

      <div id="collections" className="scroll-mt-28">
        <CategoryEditorial />
      </div>

      <div id="new-arrivals" className="scroll-mt-28">
        <NewArrivals />
      </div>

      <div id="curator" className="scroll-mt-28">
        <StyleConcierge />
      </div>

      <ShopTheEdit />
      <ShopTheLook />

      <div id="atelier" className="scroll-mt-28">
        <AtelierPreview />
      </div>

      <div id="materials" className="scroll-mt-28">
        <MaterialLibrary />
      </div>

      <div id="wardrobe" className="scroll-mt-28">
        <WardrobeBoard />
      </div>

      <DepartmentFeatures />
      <HouseSignature />
      <SeasonalDrop />

      <div id="journal" className="scroll-mt-28">
        <JournalSection />
      </div>

      <TrustStrip />
      <Newsletter />
    </main>
  );
}
