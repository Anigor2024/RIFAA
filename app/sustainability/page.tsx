'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, ShieldCheck, Feather, Recycle, HeartHandshake, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SaudiMotif } from '@/components/common/SaudiMotif';

export default function SustainabilityPage() {
  const { language, isRtl, t } = useLanguage();

  const pillars = [
    {
      id: 'fibers',
      icon: Feather,
      titleAr: 'أنسجة طبيعية نقية ونبيلة',
      titleEn: 'Noble Natural Fibers',
      descriptionAr: 'نختار حصرياً خيوط الكتان الطبيعي، والحرير التوتي، والصوف الصيفي الخفيف، والقطن العضوي طويل التيلة لضمان راحة الجسم ودوام النسيج.',
      descriptionEn: 'Prioritizing pure European flax linen, mulberry silk, cool wool, and extra-long staple organic cotton for supreme skin breathability and endurance.',
    },
    {
      id: 'cutting',
      icon: Recycle,
      titleAr: 'قص هندسي قليل الهدر',
      titleEn: 'Low-Waste Geometric Tailoring',
      descriptionAr: 'نستوحي من أساليب حياكة الثوب والعباية التاريخية قصّات قائمة على الزوايا المستقيمة والتخطيط الدقيق لتقليل هدر الأقمشة أثناء التفصيل.',
      descriptionEn: 'Drawing inspiration from historic Saudi rectilinear garment geometry to optimize layout efficiency and drastically reduce cutting room scraps.',
    },
    {
      id: 'slow-luxury',
      icon: Leaf,
      titleAr: 'فلسفة الأناقة الممتدة عبر الأجيال',
      titleEn: 'Heirloom Slow Luxury',
      descriptionAr: 'نرفض الإنتاج المتسارع السطحي؛ نصنع قطعاً محدودة ذات خياطة مدعومة وتشطيبات يدوية مصممة لتبقى وتورث عبر المواسم والأعياد.',
      descriptionEn: 'Opposing seasonal obsolescence; we craft limited editions with reinforced French seams and hand finishes designed to be worn across years and festive milestones.',
    },
    {
      id: 'artisan',
      icon: HeartHandshake,
      titleAr: 'تمكين الحرف والتراث المحلي',
      titleEn: 'Regional Craft & Cultural Continuity',
      descriptionAr: 'التعاون مع أمهر أصحاب حِرف التطريز والزري والتشطيب في المملكة والمنطقة للحفاظ على تراث التطريز اليدوي ودعمه في سوق الأزياء الحديث.',
      descriptionEn: 'Partnering with regional masters of zari, cord embroidery, and finishings to sustain Saudi heritage crafts in contemporary design markets.',
    },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#242220]/50 mb-8">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">
            {language === 'ar' ? 'الاستدامة والمسؤولية' : 'Sustainability'}
          </span>
        </nav>

        {/* Page Header */}
        <header className="pb-8 mb-10 border-b border-[#242220]/10 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#511D24] font-semibold">
            <Leaf className="w-4 h-4" />
            <span>{language === 'ar' ? 'المسؤولية والأصالة' : 'ETHICAL CRAFT & RESPONSIBILITY'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'التزام رِفْعة بالاستدامة والأصالة' : 'RIFAA’s Commitment to Sustainable Luxury'}
          </h1>
          <p className="text-xs sm:text-sm text-[#242220]/75 max-w-2xl font-light leading-relaxed">
            {language === 'ar'
              ? 'الرفاهية الحقيقية تنبع من احترام المادة والحرفة والبيئة. نتعامل مع كل قطعة كاستثمار جمالي طويل الأمد يحتفي بالطبيعة والتراث.'
              : 'True luxury arises from deep reverence for material, craft, and ecology. Every garment is conceived as an enduring sartorial investment.'}
          </p>
        </header>

        {/* Hero Visual Feature */}
        <div className="relative aspect-[16/9] w-full bg-[#EAE3D6] overflow-hidden mb-16 shadow-xs">
          <ImageWithFallback
            src="/images/editorial/feature_men_bisht.jpg"
            alt="Handcrafted Saudi Heritage & Sustainable Craft"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 space-y-4 shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-[#511D24]/10 text-[#511D24] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#111111]">
                  {language === 'ar' ? item.titleAr : item.titleEn}
                </h2>
                <p className="text-xs sm:text-sm text-[#242220]/75 font-light leading-relaxed">
                  {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Motif Divider */}
        <div className="flex justify-center my-12">
          <SaudiMotif className="w-8 h-8 text-[#B59A73]" />
        </div>

        {/* Archival Packaging Feature */}
        <div className="bg-[#FFFDFC] border border-[#242220]/10 p-8 sm:p-12 space-y-4 shadow-xs">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B59A73] font-semibold block">
            {language === 'ar' ? 'التغليف المسؤول' : 'ARCHIVAL & RECYCLABLE PACKAGING'}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#111111]">
            {language === 'ar' ? 'تغليف أرشيفي خالٍ من البلاستيك أحادي الاستخدام' : 'Single-Use Plastic-Free Presentation Packaging'}
          </h3>
          <p className="text-xs sm:text-sm text-[#242220]/80 font-light leading-relaxed">
            {language === 'ar'
              ? 'تصل إبداعات رِفْعة داخل صناديق صلبة مصنوعة من ورق مقوى معاد تدويره بنسبة 100٪، مع ورق حريري طبيعي خالٍ من الأحماض، وأكياس قماشية كتانية يمكن إعادة استخدامها لحفظ القطع لسنوات طويلة.'
              : 'RIFAA orders arrive in rigid presentation boxes crafted from 100% certified recycled board, acid-free archival tissue, and reusable linen garment covers designed for generational wardrobe care.'}
          </p>
        </div>
      </div>
    </div>
  );
}
