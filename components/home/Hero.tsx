'use client';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

/** Native editorial storefront; all shopping routes retain their original behavior. */
export function Hero() {
  const { language, isRtl } = useLanguage();
  const ar = language === 'ar';
  return (
    <section className="rifaa-editorial-hero" aria-labelledby="rifaa-home-title">
      <div className="rifaa-editorial-copy">
        <h1 id="rifaa-home-title">{ar ? <>أناقة سعودية،<br /><em>بلمسة معاصرة.</em></> : <>Saudi elegance.<br /><em>A modern expression.</em></>}</h1>
        <p>{ar ? 'قطع مختارة بعناية، وتفاصيل تحكي ذوقك. اكتشف عالم رِفْعة للأزياء السعودية المعاصرة.' : 'Considered pieces. Details that express your style. Discover the world of contemporary Saudi fashion.'}</p>
        <div className="rifaa-editorial-actions">
          <Link href="/collections" className="rifaa-editorial-primary">{ar ? 'اكتشف التشكيلة' : 'Explore the collection'}{isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}</Link>
          <Link href="/discover" className="rifaa-editorial-secondary"><Sparkles size={17} />{ar ? 'منسّق رِفْعة' : 'RIFAA Curator'}</Link>
        </div>
      </div>
      <div className="rifaa-editorial-photo">
        <ImageWithFallback src="/images/rifaa-editorial-v6.webp" alt={ar ? 'تصوير تحريري لعباية بلون عنابي وسط عمارة حجرية سعودية معاصرة' : 'Oxblood abaya in a contemporary Saudi stone courtyard'} fill priority sizes="(max-width: 760px) 100vw, 60vw" className="object-cover" />
      </div>
    </section>
  );
}
