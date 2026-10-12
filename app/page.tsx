import { Hero } from '@/components/home/Hero';
import { ExperienceIndex } from '@/components/home/ExperienceIndex';
import { CategoryEditorial } from '@/components/home/CategoryEditorial';
import { NewArrivals } from '@/components/home/NewArrivals';
import { StyleConcierge } from '@/components/home/StyleConcierge';
import { ShopTheEdit } from '@/components/home/ShopTheEdit';
import { ShopTheLook } from '@/components/home/ShopTheLook';
import { AtelierPreview } from '@/components/home/AtelierPreview';
import { MaterialLibrary } from '@/components/home/MaterialLibrary';
import { CompareStudioPreview } from '@/components/home/CompareStudioPreview';
import { PairingPreview } from '@/components/home/PairingPreview';
import { CapsuleStudioPreview } from '@/components/home/CapsuleStudioPreview';
import { WardrobeBoard } from '@/components/home/WardrobeBoard';
import { StylePassportPreview } from '@/components/home/StylePassportPreview';
import { ConciergePreview } from '@/components/home/ConciergePreview';
import { GiftAtelierPreview } from '@/components/home/GiftAtelierPreview';
import { DepartmentFeatures } from '@/components/home/DepartmentFeatures';
import { FittingRoomPreview } from '@/components/home/FittingRoomPreview';
import { SeasonalDrop } from '@/components/home/SeasonalDrop';
import { JournalSection } from '@/components/home/JournalSection';
import { TrustStrip } from '@/components/home/TrustStrip';
import { Newsletter } from '@/components/home/Newsletter';
export default function HomePage(){return <main className="w-full overflow-x-hidden">
 <Hero/><ExperienceIndex/>
 <div id="collections" className="scroll-mt-36"><CategoryEditorial/></div>
 <div id="new-arrivals" className="scroll-mt-36"><NewArrivals/></div>
 <FittingRoomPreview/>
 <div id="curator" className="scroll-mt-36"><StyleConcierge/></div>
 <ShopTheEdit/><ShopTheLook/>
 <div id="atelier" className="scroll-mt-36"><AtelierPreview/></div>
 <div id="materials" className="scroll-mt-36"><MaterialLibrary/></div>
 <div id="pairing" className="scroll-mt-36"><PairingPreview/></div>
 <div id="compare" className="scroll-mt-36"><CompareStudioPreview/></div>
 <div id="capsule" className="scroll-mt-36"><CapsuleStudioPreview/></div>
 <div id="passport" className="scroll-mt-36"><StylePassportPreview/></div>
 <div id="concierge" className="scroll-mt-36"><ConciergePreview/></div>
 <div id="wardrobe" className="scroll-mt-36"><WardrobeBoard/></div>
 <div id="gifts" className="scroll-mt-36"><GiftAtelierPreview/></div>
 <DepartmentFeatures/><SeasonalDrop/>
 <div id="journal" className="scroll-mt-36"><JournalSection/></div>
 <TrustStrip/><Newsletter/>
 </main>;}
