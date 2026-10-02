'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Feather, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SaudiMotif } from '@/components/common/SaudiMotif';

export default function AboutPage() {
  const { language, isRtl, t } = useLanguage();

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
            {language === 'ar' ? 'عن دار رِفْعة' : 'About RIFAA'}
          </span>
        </nav>

        {/* Hero Section */}
        <header className="pb-10 mb-12 border-b border-[#242220]/10 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#511D24] font-semibold">
            <span>{t.brandSentiment}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] max-w-3xl leading-tight">
            {language === 'ar'
              ? 'دار رِفْعة: صياغة معاصرة للأناقة والرصانة السعودية'
              : 'RIFAA: Contemporary Saudi Poise & Architectural Fashion'}
          </h1>
          <p className="text-sm sm:text-base text-[#242220]/75 max-w-2xl font-light leading-relaxed pt-2">
            {language === 'ar'
              ? 'تأسست دار رِفْعة في الرياض كفضاء إبداعي يربط بين نبل التقاليد السعودية وأحدث مفاهيم التصميم العالمي المعاصر للمرأة والرجل والطفل.'
              : 'Conceived in Riyadh as an editorial fashion house bridging noble Saudi sartorial traditions with contemporary architectural tailoring across Women, Men, and Kids.'}
          </p>
        </header>

        {/* Editorial Visual Feature */}
        <div className="relative aspect-[16/9] w-full bg-[#EAE3D6] overflow-hidden mb-16 shadow-xs">
          <ImageWithFallback
            src="/images/hero_campaign_riyadh.jpg"
            alt="RIFAA Atelier Riyadh"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Brand Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B59A73] font-semibold block">
              {language === 'ar' ? 'فلسفة التصميم' : 'DESIGN PHILOSOPHY'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] leading-snug">
              {language === 'ar'
                ? 'الهيبة في هدوء الخطوط، والتميز في نقاء الأقمشة'
                : 'Gravitas in Stillness, Nobility in Pure Textiles'}
            </h2>
            <div className="pt-4 flex items-center">
              <SaudiMotif className="w-8 h-8 text-[#511D24]" />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-[#242220]/85 text-sm sm:text-base font-light leading-relaxed">
            <p>
              {language === 'ar'
                ? 'تستلهم دار رِفْعة هويتها البصرية من ألوان وهندسة مدن المملكة: تدرجات حجر الدرعية الدافئ، صخور طويق الشامخة، وانعكاسات سماء نجد عند المغيب. نؤمن بأن الفخامة الحقيقية لا تتطلب زركشة مفرطة، بل تنبع من القيمة الجوهرية للقصّة والانسيابية العالية التي تراعي راحة القوام.'
                : 'RIFAA draws its visual vocabulary from the landscape of the Kingdom: the warm limestone hues of Diriyah, the monumental escarpments of Tuwaiq, and the luminous desert skies at dusk. True luxury requires no superficial excess; it emanates from the structural integrity of the silhouette, precision construction, and generous drape designed for metropolitan movement.'}
            </p>
            <p>
              {language === 'ar'
                ? 'نعمل بشراكة مع أعرق مصانع الأقمشة المتخصصة حول العالم—من الكريب الياباني المزدوج فائق الجودة، إلى الكتان الفرنسي الطبيعي، والحرير التوتي، والصوف الإيطالي خفيف الوزن—لتطوير منسوجات تتنفس بطبيعتها وتلائم مناخ المملكة المتنوع.'
                : 'We partner with master fabric mills globally—curating dense Japanese double crepes, natural French flax linen, pure mulberry silk, and tropical-weight Italian virgin wool—to weave textiles that breathe effortlessly and adapt to Saudi Arabia’s dynamic climatic shifts.'}
            </p>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 space-y-3">
            <Compass className="w-6 h-6 text-[#511D24]" />
            <h3 className="text-base font-semibold text-[#111111]">
              {language === 'ar' ? 'أصالة مستنيرة' : 'Rooted Modernity'}
            </h3>
            <p className="text-xs text-[#242220]/70 leading-relaxed font-light">
              {language === 'ar'
                ? 'إعادة قراءة الثوب والبشت والعباية بعين معمارية حديثة تكرّم التراث وتواكب المستقبل.'
                : 'Reimagining the thobe, bisht, and abaya through architectural lines that honor heritage while embracing modern utility.'}
            </p>
          </div>

          <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 space-y-3">
            <Feather className="w-6 h-6 text-[#511D24]" />
            <h3 className="text-base font-semibold text-[#111111]">
              {language === 'ar' ? 'أقمشة نبيطة' : 'Noble Textiles'}
            </h3>
            <p className="text-xs text-[#242220]/70 leading-relaxed font-light">
              {language === 'ar'
                ? 'ألياف طبيعية خالية من الاصطناع توفر نعومة فائقة وتهوية مثالية طوال العام.'
                : 'Pure breathable fibers engineered for enduring comfort, fluid movement, and supreme resilience against seasonal wear.'}
            </p>
          </div>

          <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 space-y-3">
            <Sparkles className="w-6 h-6 text-[#511D24]" />
            <h3 className="text-base font-semibold text-[#111111]">
              {language === 'ar' ? 'حرفية المحترف' : 'Atelier Craft'}
            </h3>
            <p className="text-xs text-[#242220]/70 leading-relaxed font-light">
              {language === 'ar'
                ? 'خياطة دقيقة بدرزات فرنسية مخفية وتطريز زري يدوي خافت للمناسبات الكبرى.'
                : 'Hand-finished internal French seams and restrained matte zari embroidery meticulously tailored for momentous occasions.'}
            </p>
          </div>

          <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 space-y-3">
            <Shield className="w-6 h-6 text-[#511D24]" />
            <h3 className="text-base font-semibold text-[#111111]">
              {language === 'ar' ? 'ضيافة كونسيرج' : 'Saudi Hospitality'}
            </h3>
            <p className="text-xs text-[#242220]/70 leading-relaxed font-light">
              {language === 'ar'
                ? 'فريق متخصص في الرياض لتقديم المشورة في المقاسات وتنسيق الإطلالات الخاصة.'
                : 'Dedicated Riyadh styling desk providing bespoke fit guidance and private atelier appointments.'}
            </p>
          </div>
        </div>

        {/* Explore Collection Banner */}
        <div className="bg-[#111111] text-white p-8 sm:p-12 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B59A73] font-medium block">
            {language === 'ar' ? 'خزانة الموسم' : 'THE WARDROBE'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {language === 'ar' ? 'اكتشف إبداعات رِفْعة لموسم 2026' : 'Explore the 2026 Repertoire'}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto font-light leading-relaxed">
            {language === 'ar'
              ? 'مجموعة متكاملة تضم 36 قطعة مصممة بعناية للمرأة والرجل والطفل في المملكة.'
              : 'A complete assortment of 36 intentional silhouettes tailored for women, men, and children.'}
          </p>
          <div className="pt-2">
            <Link
              href="/new"
              className="inline-flex items-center gap-2 py-3 px-8 bg-white hover:bg-[#B59A73] text-[#111111] text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              <span>{language === 'ar' ? 'تصفح التشكيلة' : 'Explore Assortment'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
