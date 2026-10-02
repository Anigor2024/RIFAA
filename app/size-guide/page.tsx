'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ruler, Sparkles, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SizeGuidePage() {
  const { language, isRtl, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'thobe' | 'abaya' | 'standard' | 'kids'>('thobe');

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#242220]/50 mb-8">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">
            {language === 'ar' ? 'دليل المقاسات' : 'Size Guide'}
          </span>
        </nav>

        {/* Page Header */}
        <header className="pb-8 mb-8 border-b border-[#242220]/10 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-semibold block">
            {language === 'ar' ? 'معايير دار رِفْعة للمقاسات' : 'RIFAA FIT & SIZING STANDARDS'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'دليل القياسات والملاءمة' : 'Sizing & Tailoring Guide'}
          </h1>
          <p className="text-xs sm:text-sm text-[#242220]/75 max-w-xl font-light leading-relaxed">
            {language === 'ar'
              ? 'صُممت قطع رِفْعة بقصّات هندسية توازن بين الراحة التامة والهيبة البصرية. استعن بهذا الدليل لتحديد المقاس الأمثل لك.'
              : 'Engineered with architectural proportions that harmonize effortless comfort with dignified poise. Consult our precise sizing tables below.'}
          </p>
        </header>

        {/* Interactive Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 text-xs">
          <button
            onClick={() => setActiveTab('thobe')}
            className={`py-2 px-4 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'thobe'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
            }`}
          >
            {language === 'ar' ? 'مقاسات الثوب السعودي' : 'Saudi Thobe Sizing'}
          </button>
          <button
            onClick={() => setActiveTab('abaya')}
            className={`py-2 px-4 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'abaya'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
            }`}
          >
            {language === 'ar' ? 'مقاسات العباية' : 'Abaya Sizing'}
          </button>
          <button
            onClick={() => setActiveTab('standard')}
            className={`py-2 px-4 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'standard'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
            }`}
          >
            {language === 'ar' ? 'المقاسات القياسية (XS - XXL)' : 'Standard (XS - XXL)'}
          </button>
          <button
            onClick={() => setActiveTab('kids')}
            className={`py-2 px-4 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'kids'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
            }`}
          >
            {language === 'ar' ? 'مقاسات الأطفال' : 'Kids Sizing'}
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-10 space-y-8 shadow-xs mb-12">
          {/* 1. Saudi Thobe Sizing */}
          {activeTab === 'thobe' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-[#111111]">
                  {language === 'ar' ? 'جدول قياسات الثوب السعودي الرجالي' : 'Bespoke Saudi Thobe Sizing'}
                </h2>
                <p className="text-xs sm:text-sm text-[#242220]/75 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'يُقاس الثوب السعودي برقمين: الرقم الأول يشير إلى الطول الكامل من أعلى الكتف إلى أسفل الكعب بالبوصة، والرقم الثاني يمثل عرض الصدر بالبوصة.'
                    : 'The Saudi thobe is measured by two primary numbers: the first represents full garment length in inches (from top shoulder to ankle hem), and the second represents chest width.'}
                </p>
              </div>

              <div className="overflow-x-auto border border-[#242220]/10 bg-white">
                <table className="w-full text-start divide-y divide-[#242220]/10 text-xs sm:text-sm">
                  <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-[#111111]">
                    <tr>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'المقاس (طول / صدر)' : 'Size (Length / Chest)'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'الطول الموصى به' : 'Height Range'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'عرض الصدر' : 'Chest Width'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'طول الكم' : 'Sleeve Length'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242220]/05 tabular-nums text-[#242220]/90">
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">52 / 22</td><td className="py-2.5 px-4">158 - 163 سم</td><td className="py-2.5 px-4">22 إنش (56 سم)</td><td className="py-2.5 px-4">23 إنش</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">54 / 22</td><td className="py-2.5 px-4">164 - 169 سم</td><td className="py-2.5 px-4">22 إنش (56 سم)</td><td className="py-2.5 px-4">24 إنش</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">54 / 24</td><td className="py-2.5 px-4">164 - 169 سم</td><td className="py-2.5 px-4">24 إنش (61 سم)</td><td className="py-2.5 px-4">24 إنش</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">56 / 24</td><td className="py-2.5 px-4">170 - 175 سم</td><td className="py-2.5 px-4">24 إنش (61 سم)</td><td className="py-2.5 px-4">25 إنش</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">58 / 24</td><td className="py-2.5 px-4">176 - 181 سم</td><td className="py-2.5 px-4">24 إنش (61 سم)</td><td className="py-2.5 px-4">26 إنش</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">58 / 26</td><td className="py-2.5 px-4">176 - 181 سم</td><td className="py-2.5 px-4">26 إنش (66 سم)</td><td className="py-2.5 px-4">26 إنش</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">60 / 26</td><td className="py-2.5 px-4">182 - 188 سم</td><td className="py-2.5 px-4">26 إنش (66 سم)</td><td className="py-2.5 px-4">27 إنش</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Abaya Sizing */}
          {activeTab === 'abaya' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-[#111111]">
                  {language === 'ar' ? 'جدول مقاسات العبايات النسائية' : 'Abaya Tailoring Sizing'}
                </h2>
                <p className="text-xs sm:text-sm text-[#242220]/75 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'تُحدد مقاسات العباية بطول القامة من أعلى نقطة في الكتف إلى الحافة السفلية بالبوصة. يرجى أخذ ارتفاع الكعب المعتاد في الحسبان.'
                    : 'Abaya sizes correlate to total vertical length from the shoulder seam to the hemline in inches. Take customary heel height into account.'}
                </p>
              </div>

              <div className="overflow-x-auto border border-[#242220]/10 bg-white">
                <table className="w-full text-start divide-y divide-[#242220]/10 text-xs sm:text-sm">
                  <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-[#111111]">
                    <tr>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'الطول الموصى به' : 'Recommended Height'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'طول الكم' : 'Sleeve Length'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'عرض الصدر' : 'Chest Width'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242220]/05 tabular-nums text-[#242220]/90">
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">52</td><td className="py-2.5 px-4">150 - 155 سم</td><td className="py-2.5 px-4">26 إنش (66 سم)</td><td className="py-2.5 px-4">21 إنش (53 سم)</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">54</td><td className="py-2.5 px-4">156 - 162 سم</td><td className="py-2.5 px-4">27 إنش (68 سم)</td><td className="py-2.5 px-4">22 إنش (56 سم)</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">56</td><td className="py-2.5 px-4">163 - 168 سم</td><td className="py-2.5 px-4">28 إنش (71 سم)</td><td className="py-2.5 px-4">23 إنش (58 سم)</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">58</td><td className="py-2.5 px-4">169 - 174 سم</td><td className="py-2.5 px-4">29 إنش (74 سم)</td><td className="py-2.5 px-4">24 إنش (61 سم)</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">60</td><td className="py-2.5 px-4">175 - 180 سم</td><td className="py-2.5 px-4">30 إنش (76 سم)</td><td className="py-2.5 px-4">25 إنش (63 سم)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Standard Sizing */}
          {activeTab === 'standard' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-[#111111]">
                  {language === 'ar' ? 'المقاسات القياسية للبليزرات والقمصان والبناطيل' : 'Standard Sizing (Blazers, Shirts, Trousers)'}
                </h2>
                <p className="text-xs sm:text-sm text-[#242220]/75 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'جدول القياسات الدقيقة بالسنتيمتر للبليزرات الصوفية، القمصان الكتان، والأطقم الرسمية.'
                    : 'Centimeter measurements for tailored wool blazers, linen stand-collar shirts, and trousers.'}
                </p>
              </div>

              <div className="overflow-x-auto border border-[#242220]/10 bg-white">
                <table className="w-full text-start divide-y divide-[#242220]/10 text-xs sm:text-sm">
                  <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-[#111111]">
                    <tr>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'محيط الصدر' : 'Chest (cm)'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'محيط الخصر' : 'Waist (cm)'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'محيط الأرداف' : 'Hips (cm)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242220]/05 tabular-nums text-[#242220]/90">
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">XS / 34</td><td className="py-2.5 px-4">82 - 86 سم</td><td className="py-2.5 px-4">64 - 68 سم</td><td className="py-2.5 px-4">88 - 92 سم</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">S / 36</td><td className="py-2.5 px-4">86 - 90 سم</td><td className="py-2.5 px-4">68 - 72 سم</td><td className="py-2.5 px-4">92 - 96 سم</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">M / 38</td><td className="py-2.5 px-4">90 - 95 سم</td><td className="py-2.5 px-4">72 - 77 سم</td><td className="py-2.5 px-4">96 - 101 سم</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">L / 40</td><td className="py-2.5 px-4">95 - 101 سم</td><td className="py-2.5 px-4">77 - 83 سم</td><td className="py-2.5 px-4">101 - 107 سم</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">XL / 42</td><td className="py-2.5 px-4">101 - 108 سم</td><td className="py-2.5 px-4">83 - 90 سم</td><td className="py-2.5 px-4">107 - 114 سم</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">XXL / 44</td><td className="py-2.5 px-4">108 - 116 سم</td><td className="py-2.5 px-4">90 - 98 سم</td><td className="py-2.5 px-4">114 - 122 سم</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Kids Sizing */}
          {activeTab === 'kids' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-[#111111]">
                  {language === 'ar' ? 'مقاسات الأطفال (الأولاد والبنات)' : 'Kids Sizing (Boys & Girls)'}
                </h2>
                <p className="text-xs sm:text-sm text-[#242220]/75 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'جدول مقاسات أزياء الأطفال حسب الفئة العمرية ومتوسط الطول، مصممة بحجم مريح يتيح حرية الحركة والنمو.'
                    : 'Children sizing structured by age brackets and height ranges, cut with gentle proportions for easy movement.'}
                </p>
              </div>

              <div className="overflow-x-auto border border-[#242220]/10 bg-white">
                <table className="w-full text-start divide-y divide-[#242220]/10 text-xs sm:text-sm">
                  <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-[#111111]">
                    <tr>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'العمر' : 'Age Bracket'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'طول الطفل الموصى به' : 'Height Range'}</th>
                      <th className="py-3 px-4 text-start">{language === 'ar' ? 'طول ثوب الأولاد' : 'Boys Thobe Length'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242220]/05 tabular-nums text-[#242220]/90">
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">2 - 3 سنوات</td><td className="py-2.5 px-4">92 - 98 سم</td><td className="py-2.5 px-4">32 إنش (81 سم)</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">4 - 5 سنوات</td><td className="py-2.5 px-4">104 - 110 سم</td><td className="py-2.5 px-4">36 إنش (91 سم)</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">6 - 7 سنوات</td><td className="py-2.5 px-4">116 - 122 سم</td><td className="py-2.5 px-4">40 إنش (101 سم)</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">8 - 9 سنوات</td><td className="py-2.5 px-4">128 - 134 سم</td><td className="py-2.5 px-4">44 إنش (111 سم)</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">10 - 11 سنة</td><td className="py-2.5 px-4">140 - 146 سم</td><td className="py-2.5 px-4">48 إنش (121 سم)</td></tr>
                    <tr><td className="py-2.5 px-4 font-semibold text-[#111111]">12 - 13 سنة</td><td className="py-2.5 px-4">152 - 158 سم</td><td className="py-2.5 px-4">50 إنش (127 سم)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Bespoke Fit Concierge Callout */}
        <div className="bg-[#FAF7F2] border border-[#B59A73]/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center sm:text-start">
            <span className="text-xs uppercase tracking-widest text-[#511D24] font-semibold block">
              {language === 'ar' ? 'خدمة التفصيل والمشورة الخاصة' : 'BESPOKE TAILORING ADVICE'}
            </span>
            <h3 className="text-base font-bold text-[#111111]">
              {language === 'ar' ? 'هل تود استشارة مستشار أناقة رِفْعة؟' : 'Need personalized styling or fit guidance?'}
            </h3>
            <p className="text-xs text-[#242220]/70 font-light">
              {language === 'ar'
                ? 'فريق كونسيرج رِفْعة متاح لمساعدتكم في أخذ القياسات والتأكد من مطابقة القطعة لقوامكم.'
                : 'Our concierge desk in Riyadh provides personalized tailoring consultation before you finalize your order.'}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 py-3 px-6 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-semibold tracking-wider uppercase transition-colors shrink-0"
          >
            <span>{language === 'ar' ? 'تواصل مع الكونسيرج' : 'Contact Concierge'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </div>
  );
}
