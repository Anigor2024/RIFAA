'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Department } from '@/types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department;
  categoryKey?: string;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  department,
  categoryKey,
}: SizeGuideModalProps) {
  const { language, isRtl, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'thobe' | 'abaya' | 'standard' | 'kids'>(() => {
    if (categoryKey === 'thobes') return 'thobe';
    if (categoryKey === 'abayas') return 'abaya';
    if (department === 'kids') return 'kids';
    return 'standard';
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-[#F7F4EF] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#242220]/10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242220]/10">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#511D24] font-medium block">
              {language === 'ar' ? 'معايير رِفْعة للمقاسات' : 'RIFAA FIT & SIZING'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#111111] mt-0.5">
              {t.actions.sizeGuide}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#242220]/60 hover:text-[#111111] transition-colors cursor-pointer"
            aria-label={t.actions.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTab('thobe')}
            className={`py-2 px-3.5 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'thobe'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
            }`}
          >
            {language === 'ar' ? 'مقاسات الثوب السعودي' : 'Saudi Thobe Sizing'}
          </button>
          <button
            onClick={() => setActiveTab('abaya')}
            className={`py-2 px-3.5 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'abaya'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
            }`}
          >
            {language === 'ar' ? 'مقاسات العباية' : 'Abaya Sizing'}
          </button>
          <button
            onClick={() => setActiveTab('standard')}
            className={`py-2 px-3.5 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'standard'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
            }`}
          >
            {language === 'ar' ? 'المقاسات القياسية (XS - XXL)' : 'Standard (XS - XXL)'}
          </button>
          <button
            onClick={() => setActiveTab('kids')}
            className={`py-2 px-3.5 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'kids'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
            }`}
          >
            {language === 'ar' ? 'مقاسات الأطفال' : 'Kids Sizing'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-xs text-[#242220]/80 space-y-4">
          {activeTab === 'thobe' && (
            <div className="space-y-4">
              <p className="leading-relaxed">
                {language === 'ar'
                  ? 'يُقاس الثوب السعودي برقمين: الأول يمثل الطول الكامل بالبوصة (من أعلى الكتف حتى أسفل الكعب)، والرقم الثاني يمثل عرض الصدر بالبوصة.'
                  : 'The Saudi thobe is measured by two numbers: the first indicates total length in inches (shoulder to ankle hem), and the second indicates chest width.'}
              </p>
              <div className="overflow-x-auto border border-[#242220]/10 bg-white">
                <table className="w-full text-start divide-y divide-[#242220]/10">
                  <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-[#111111]">
                    <tr>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الطول الموصى به' : 'Height Range'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'عرض الصدر' : 'Chest Width'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'طول الكم' : 'Sleeve Length'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242220]/05 tabular-nums">
                    <tr><td className="py-2 px-3 font-medium">52 / 22</td><td className="py-2 px-3">158 - 163 سم</td><td className="py-2 px-3">22 إنش (56 سم)</td><td className="py-2 px-3">23 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">54 / 22</td><td className="py-2 px-3">164 - 169 سم</td><td className="py-2 px-3">22 إنش (56 سم)</td><td className="py-2 px-3">24 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">54 / 24</td><td className="py-2 px-3">164 - 169 سم</td><td className="py-2 px-3">24 إنش (61 سم)</td><td className="py-2 px-3">24 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">56 / 24</td><td className="py-2 px-3">170 - 175 سم</td><td className="py-2 px-3">24 إنش (61 سم)</td><td className="py-2 px-3">25 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">58 / 24</td><td className="py-2 px-3">176 - 181 سم</td><td className="py-2 px-3">24 إنش (61 سم)</td><td className="py-2 px-3">26 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">58 / 26</td><td className="py-2 px-3">176 - 181 سم</td><td className="py-2 px-3">26 إنش (66 سم)</td><td className="py-2 px-3">26 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">60 / 26</td><td className="py-2 px-3">182 - 188 سم</td><td className="py-2 px-3">26 إنش (66 سم)</td><td className="py-2 px-3">27 إنش</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'abaya' && (
            <div className="space-y-4">
              <p className="leading-relaxed">
                {language === 'ar'
                  ? 'مقاسات العباية تُحدد بالطول الكامل بالبوصة من أعلى نقطة في الكتف إلى الحافة السفلية. اختيار المقاس يعتمد على طول القامة وارتفاع الكعب المعتاد.'
                  : 'Abaya sizes correspond to the full length in inches from the highest shoulder point to the hemline.'}
              </p>
              <div className="overflow-x-auto border border-[#242220]/10 bg-white">
                <table className="w-full text-start divide-y divide-[#242220]/10">
                  <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-[#111111]">
                    <tr>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الطول الموصى به' : 'Recommended Height'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'طول الكم' : 'Sleeve Length'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'عرض الصدر' : 'Chest Width'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242220]/05 tabular-nums">
                    <tr><td className="py-2 px-3 font-medium">52</td><td className="py-2 px-3">150 - 155 سم</td><td className="py-2 px-3">26 إنش</td><td className="py-2 px-3">21 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">54</td><td className="py-2 px-3">156 - 162 سم</td><td className="py-2 px-3">27 إنش</td><td className="py-2 px-3">22 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">56</td><td className="py-2 px-3">163 - 168 سم</td><td className="py-2 px-3">28 إنش</td><td className="py-2 px-3">23 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">58</td><td className="py-2 px-3">169 - 174 سم</td><td className="py-2 px-3">29 إنش</td><td className="py-2 px-3">24 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">60</td><td className="py-2 px-3">175 - 180 سم</td><td className="py-2 px-3">30 إنش</td><td className="py-2 px-3">25 إنش</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'standard' && (
            <div className="space-y-4">
              <p className="leading-relaxed">
                {language === 'ar'
                  ? 'جدول المقاسات للبليزرات، القمصان، البناطيل والفساتين وفق المعايير العالمية المعاصرة.'
                  : 'Standard tailoring specifications for blazers, shirts, trousers, and dresses.'}
              </p>
              <div className="overflow-x-auto border border-[#242220]/10 bg-white">
                <table className="w-full text-start divide-y divide-[#242220]/10">
                  <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-[#111111]">
                    <tr>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'محيط الصدر' : 'Chest (cm)'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'محيط الخصر' : 'Waist (cm)'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'محيط الأرداف' : 'Hips (cm)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242220]/05 tabular-nums">
                    <tr><td className="py-2 px-3 font-medium">XS / 34</td><td className="py-2 px-3">82 - 86 سم</td><td className="py-2 px-3">64 - 68 سم</td><td className="py-2 px-3">88 - 92 سم</td></tr>
                    <tr><td className="py-2 px-3 font-medium">S / 36</td><td className="py-2 px-3">86 - 90 سم</td><td className="py-2 px-3">68 - 72 سم</td><td className="py-2 px-3">92 - 96 سم</td></tr>
                    <tr><td className="py-2 px-3 font-medium">M / 38</td><td className="py-2 px-3">90 - 95 سم</td><td className="py-2 px-3">72 - 77 سم</td><td className="py-2 px-3">96 - 101 سم</td></tr>
                    <tr><td className="py-2 px-3 font-medium">L / 40</td><td className="py-2 px-3">95 - 101 سم</td><td className="py-2 px-3">77 - 83 سم</td><td className="py-2 px-3">101 - 107 سم</td></tr>
                    <tr><td className="py-2 px-3 font-medium">XL / 42</td><td className="py-2 px-3">101 - 108 سم</td><td className="py-2 px-3">83 - 90 سم</td><td className="py-2 px-3">107 - 114 سم</td></tr>
                    <tr><td className="py-2 px-3 font-medium">XXL / 44</td><td className="py-2 px-3">108 - 116 سم</td><td className="py-2 px-3">90 - 98 سم</td><td className="py-2 px-3">114 - 122 سم</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'kids' && (
            <div className="space-y-4">
              <p className="leading-relaxed">
                {language === 'ar'
                  ? 'مقاسات الأطفال معتمدة حسب الفئة العمرية ومتوسط الطول، مع اتساع مدروس لراحة الحركة والنمو.'
                  : 'Children sizes structured by age bracket and height range, engineered for comfortable movement.'}
              </p>
              <div className="overflow-x-auto border border-[#242220]/10 bg-white">
                <table className="w-full text-start divide-y divide-[#242220]/10">
                  <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-[#111111]">
                    <tr>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'العمر / المقاس' : 'Age / Size'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'طول الطفل الموصى به' : 'Height (cm)'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'طول ثوب الأولاد' : 'Thobe Size'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242220]/05 tabular-nums">
                    <tr><td className="py-2 px-3 font-medium">2 - 3 سنوات</td><td className="py-2 px-3">92 - 98 سم</td><td className="py-2 px-3">32 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">4 - 5 سنوات</td><td className="py-2 px-3">104 - 110 سم</td><td className="py-2 px-3">36 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">6 - 7 سنوات</td><td className="py-2 px-3">116 - 122 سم</td><td className="py-2 px-3">40 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">8 - 9 سنوات</td><td className="py-2 px-3">128 - 134 سم</td><td className="py-2 px-3">44 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">10 - 11 سنة</td><td className="py-2 px-3">140 - 146 سم</td><td className="py-2 px-3">48 إنش</td></tr>
                    <tr><td className="py-2 px-3 font-medium">12 - 13 سنة</td><td className="py-2 px-3">152 - 158 سم</td><td className="py-2 px-3">50 إنش</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-[#242220]/10 flex items-center justify-between">
          <span className="text-[11px] text-[#242220]/60">
            {language === 'ar'
              ? 'هل تحتاج لمساعدة خاصة بالمقاسات؟ فريقنا في الرياض متاح لمساعدتكم.'
              : 'Need bespoke sizing advice? Our concierge team in Riyadh is at your service.'}
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 bg-[#111111] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#511D24] transition-colors cursor-pointer"
          >
            {t.actions.close}
          </button>
        </div>
      </div>
    </div>
  );
}
