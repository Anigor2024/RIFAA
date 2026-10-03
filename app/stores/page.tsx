'use client';

import Link from 'next/link';
import { MapPin, Clock, Calendar, Sparkles, Building2, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SaudiMotif } from '@/components/common/SaudiMotif';

export default function StoresPage() {
  const { language, isRtl } = useLanguage();

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#242220]/50 mb-8">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">
            {language === 'ar' ? 'مساحات رِفْعة' : 'RIFAA Spaces'}
          </span>
        </nav>

        {/* Header */}
        <header className="pb-8 mb-10 border-b border-[#242220]/10 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#511D24] font-semibold">
            <Building2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'المفاهيم المكانية' : 'SPATIAL ARCHITECTURE'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'مساحات رِفْعة المعمارية' : 'RIFAA Architectural Spaces'}
          </h1>
          <p className="text-xs sm:text-sm text-[#242220]/75 max-w-2xl font-light leading-relaxed">
            {language === 'ar'
              ? 'صُممت مساحات رِفْعة كامتداد طبيعي لفلسفة الأزياء: رصانة نجدية، خطوط هندسية واضحة، وأجواء تأملية هادئة تعيد تعريف تجربة التسوق الفاخر.'
              : 'Conceived as architectural extensions of our sartorial philosophy: Najdi poise, clean geometric volumes, and contemplative sanctuaries redefining contemporary luxury.'}
          </p>
        </header>

        {/* Portfolio Concept Disclosure */}
        <div className="p-4 bg-[#EAE3D6]/80 border-s-3 border-[#B59A73] text-xs text-[#242220]/80 leading-relaxed mb-12 shadow-2xs">
          <p className="font-semibold text-[#111111] mb-1">
            {language === 'ar' ? 'إشعار توضيحي لاستعراض محفظة الأعمال:' : 'Portfolio Demonstration Disclosure:'}
          </p>
          <p>
            {language === 'ar'
              ? 'المساحات المعروضة أدناه تمثل مفاهيم معمارية واستعراضاً بيانياً لرؤية التوسع المكاني لدار رِفْعة في المملكة، وليست مواقع بيع تجارية فعلية مفتوحة للجمهور حالياً.'
              : 'The retail spaces detailed below represent conceptual architectural visions developed for the RIFAA brand showcase, rather than currently open operational storefronts.'}
          </p>
        </div>

        {/* Store Concepts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Riyadh Pavilion Concept */}
          <div className="bg-[#FFFDFC] border border-[#242220]/10 overflow-hidden shadow-xs flex flex-col">
            <div className="relative aspect-[16/10] bg-[#EAE3D6]">
              <ImageWithFallback
                src="/images/hero_campaign_riyadh.jpg"
                alt="Riyadh Architectural Pavilion Concept"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 start-4 bg-[#111111]/85 text-white text-[10px] uppercase tracking-widest px-3 py-1 font-semibold backdrop-blur-xs">
                {language === 'ar' ? 'مفهوم الرياض' : 'Riyadh Concept'}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#511D24] uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حي العليا، الرياض' : 'Al Olaya District, Riyadh'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                  {language === 'ar' ? 'جناح رِفْعة المعماري — الرياض' : 'RIFAA Flagship Pavilion — Riyadh'}
                </h2>
                <p className="text-xs sm:text-sm text-[#242220]/75 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'تصميم يحتفي بالحجر الجيري الطبيعي وأشعة شمس الرياض المتسللة عبر المشربيات المعاصرة، مخصص لاستعراض المجموعات الموسمية وصالون الخياطة الفاخرة.'
                    : 'A sanctuary of local limestone and dappled desert sunlight filtered through contemporary mashrabiyas, envisioned for seasonal showcase and private tailoring.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#242220]/10 text-xs text-[#242220]/70 space-y-1">
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#511D24]" />
                  <span>{language === 'ar' ? 'ساعات المفهوم: ٤:٠٠ م — ١١:٠٠ م' : 'Concept Hours: 4:00 PM — 11:00 PM'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B59A73]" />
                  <span>{language === 'ar' ? 'خدمة استشارات القياس والملاءمة' : 'Private Sizing & Consultation Salon'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Jeddah Coastal Suite Concept */}
          <div className="bg-[#FFFDFC] border border-[#242220]/10 overflow-hidden shadow-xs flex flex-col">
            <div className="relative aspect-[16/10] bg-[#EAE3D6]">
              <ImageWithFallback
                src="/images/women_editorial_abaya.jpg"
                alt="Jeddah Coastal Atelier Concept"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 start-4 bg-[#111111]/85 text-white text-[10px] uppercase tracking-widest px-3 py-1 font-semibold backdrop-blur-xs">
                {language === 'ar' ? 'مفهوم جدة' : 'Jeddah Concept'}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#511D24] uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حي الشاطئ، جدة' : 'Al Shati District, Jeddah'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                  {language === 'ar' ? 'جناح المواعيد الخاصة — جدة' : 'Private Coastal Suite — Jeddah'}
                </h2>
                <p className="text-xs sm:text-sm text-[#242220]/75 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'فضاء ساحلي رحب مخصص للمواعيد الخاصة، يجمع بين برودة الأقمشة الكتانية الطبيعية والإطلالات البصرية المفتوحة على نسيم البحر الأحمر.'
                    : 'An expansive coastal atelier engineered for private fittings, balancing breathable natural linens with open architectural sightlines overlooking the Red Sea breeze.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#242220]/10 text-xs text-[#242220]/70 space-y-1">
                <p className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#511D24]" />
                  <span>{language === 'ar' ? 'مواعيد خاصة حصرياً' : 'Private Appointment Format'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#B59A73]" />
                  <span>{language === 'ar' ? 'مجموعات مناسبات العيد والمساء' : 'Occasion & Evening Curations'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Motif Divider */}
        <div className="flex justify-center my-12">
          <SaudiMotif className="w-8 h-8 text-[#B59A73]" />
        </div>

        {/* Digital Concierge CTA */}
        <div className="bg-[#111111] text-white p-8 sm:p-12 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B59A73] font-semibold block">
            {language === 'ar' ? 'مفهوم خدمة الكونسيرج الرقمي' : 'CONCIERGE CONCEPT'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold max-w-xl mx-auto">
            {language === 'ar'
              ? 'استعراض تجربة الاستشارات الخاصة والأناقة المخصصة'
              : 'Demonstrating Bespoke Client Guidance & Concierge Care'}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto font-light leading-relaxed">
            {language === 'ar'
              ? 'يستعرض هذا القسم تصور دار رِفْعة لخدمة الكونسيرج الفاخرة، موضحاً كيفية تقديم المشورة الشخصية حول الأنسجة والقياسات والتنسيق في المنظومة الإنتاجية.'
              : 'Illustrating the RIFAA concept for luxury client care, demonstrating how bespoke textile advisory and private styling consultations would operate in a production store.'}
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 py-3 px-8 bg-[#FAF8F5] text-[#111111] text-xs font-semibold tracking-widest uppercase hover:bg-[#511D24] hover:text-white transition-colors cursor-pointer"
            >
              <span>{language === 'ar' ? 'تواصل مع الكونسيرج' : 'Connect with Concierge'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
