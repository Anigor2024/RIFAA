'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, Package, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ShippingReturnsPage() {
  const { language, isRtl, t } = useLanguage();

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
            {language === 'ar' ? 'الشحن والإرجاع' : 'Shipping & Returns'}
          </span>
        </nav>

        {/* Page Header */}
        <header className="pb-8 mb-10 border-b border-[#242220]/10 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-semibold block">
            {language === 'ar' ? 'التزامات الخدمة' : 'CLIENT COMMITMENTS'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'سياسة الشحن والإرجاع' : 'Shipping & Return Policies'}
          </h1>
          <p className="text-xs sm:text-sm text-[#242220]/75 max-w-xl font-light leading-relaxed">
            {language === 'ar'
              ? 'نهدف في دار رِفْعة إلى تقديم تجربة لوجستية رفيعة المستوى تليق بخصوصية قطعنا وقيمة وقت عملائنا في المملكة العربية السعودية.'
              : 'RIFAA is committed to providing a seamless, discreet logistics and care experience tailored for our clients across the Kingdom of Saudi Arabia.'}
          </p>
        </header>

        {/* Demo Disclaimer Banner */}
        <div className="p-4 bg-[#EAE3D6]/70 border-s-3 border-[#B59A73] text-xs text-[#242220]/80 leading-relaxed mb-12">
          <p className="font-semibold text-[#111111] mb-1">
            {language === 'ar' ? 'توضيح العرض التمهيدي للمنصة:' : 'Demonstration Platform Disclosure:'}
          </p>
          <p>
            {language === 'ar'
              ? 'السياسات والجداول الزمنية الموضحة هنا تعكس معايير التشغيل المعتمدة للمنصة، وتُقدَم حالياً كجزء من استعراض محفظة الأعمال الرقمية لدار رِفْعة.'
              : 'The logistics timelines and policies articulated below represent the operational model of RIFAA and are presented here as part of this digital ecommerce portfolio showcase.'}
          </p>
        </div>

        {/* 1. Shipping Pillars */}
        <section className="space-y-6 mb-16">
          <div className="flex items-center gap-3 pb-3 border-b border-[#242220]/10">
            <Truck className="w-5 h-5 text-[#511D24]" />
            <h2 className="text-xl font-bold text-[#111111]">
              {language === 'ar' ? 'الشحن والتوصيل داخل المملكة' : 'Domestic Shipping & Delivery'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFFDFC] border border-[#242220]/10 p-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#511D24]">
                {language === 'ar' ? 'التوصيل القياسي' : 'Standard Delivery'}
              </span>
              <p className="text-xs text-[#242220]/70 leading-relaxed font-light">
                {language === 'ar'
                  ? 'مجاني للطلبات فوق 500 ر.س (أو 35 ر.س للطلبات الأقل). مدة التوصيل 2-4 أيام عمل لكافة مناطق المملكة.'
                  : 'Complimentary on orders exceeding SAR 500 (or SAR 35 below). Delivery in 2-4 business days across all regions.'}
              </p>
            </div>

            <div className="bg-[#FFFDFC] border border-[#242220]/10 p-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#511D24]">
                {language === 'ar' ? 'الشحن السريع' : 'Express Delivery'}
              </span>
              <p className="text-xs text-[#242220]/70 leading-relaxed font-light">
                {language === 'ar'
                  ? 'رسوم ثابتة 65 ر.س. أولوية تجهيز فورية وتوصيل خلال 1-2 يوم عمل في المدن الرئيسية.'
                  : 'Flat SAR 65 fee. Priority fulfillment with delivery within 1-2 business days to major metropolitan hubs.'}
              </p>
            </div>

            <div className="bg-[#FFFDFC] border border-[#242220]/10 p-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#511D24]">
                {language === 'ar' ? 'كونسيرج الرياض اليومي' : 'Riyadh Same-Day'}
              </span>
              <p className="text-xs text-[#242220]/70 leading-relaxed font-light">
                {language === 'ar'
                  ? 'خيار تجريبي برسوم 90 ر.س للطلبات المسجلة قبل الساعة 2 ظهراً بتوقيت الرياض.'
                  : 'Demonstration tier at SAR 90 for conceptual orders confirmed before 2:00 PM AST within Riyadh city.'}
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 space-y-3 text-xs text-[#242220]/80">
            <h3 className="font-semibold text-[#111111]">
              {language === 'ar' ? 'معايير التغليف وحماية القطع' : 'Archival Packaging Standards'}
            </h3>
            <p className="font-light leading-relaxed">
              {language === 'ar'
                ? 'كل قطعة من أزياء رِفْعة تُغلَف يدوياً بورق حريري خالٍ من الأحماض، وتُوضع في صندوق الدار الصلب المميز بلمسات مخملية ورائحة دهن العود الخفيفة لحماية النسيج وضمان وصوله في أبهى حلة.'
                : 'Every creation is wrapped in archival tissue, preserved in our signature rigid presentation box infused with gentle natural oud, and secured inside a protective outer shipper.'}
            </p>
          </div>
        </section>

        {/* 2. Returns & Exchanges */}
        <section className="space-y-6 mb-16">
          <div className="flex items-center gap-3 pb-3 border-b border-[#242220]/10">
            <RotateCcw className="w-5 h-5 text-[#511D24]" />
            <h2 className="text-xl font-bold text-[#111111]">
              {language === 'ar' ? 'الإرجاع والاستبدال المجاني' : 'Complimentary Returns & Exchanges'}
            </h2>
          </div>

          <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 space-y-6 text-xs text-[#242220]/85">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#111111]">
                {language === 'ar' ? 'مهلة الإرجاع المعتمدة: 14 يوماً' : '14-Day Consideration Window'}
              </h3>
              <p className="font-light leading-relaxed">
                {language === 'ar'
                  ? 'يسرنا منحكم مهلة 14 يوماً من تاريخ استلام الشحنة لطلب استبدال المقاس أو إرجاع القطعة واسترداد قيمتها، وذلك مجاناً بالكامل دون أي رسوم إضافية على العميل داخل المملكة.'
                  : 'We offer a complimentary 14-day window from the date of physical receipt to request a complimentary size exchange or return for a full refund.'}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#111111]">
                {language === 'ar' ? 'شروط قبول القطع المرتجعة' : 'Return Eligibility Criteria'}
              </h3>
              <ul className="space-y-1.5 list-disc list-inside font-light leading-relaxed text-[#242220]/80">
                <li>
                  {language === 'ar'
                    ? 'أن تكون القطعة في حالتها الأصلية تماماً، غير ملبوسة، غير مغسولة، وخالية من أي روائح عطور أو علامات استخدام.'
                    : 'Items must remain unworn, unwashed, unaltered, and free from perfume, makeup, or signs of wear.'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'بقاء كافة البطاقات السعرية وبطاقات المصمم الأصلية مثبتة في مكانها دون إزالة.'
                    : 'All original designer tags, seals, and care labels must remain intact and attached.'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'إعادة القطعة داخل صندوق رِفْعة الصلب وكيس القماش الواقي المرفقين مع الطلب.'
                    : 'Items must be returned inside their original presentation box and protective garment bag.'}
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#111111]">
                {language === 'ar' ? 'آلية معالجة واسترداد المبالغ' : 'Refund Processing'}
              </h3>
              <p className="font-light leading-relaxed">
                {language === 'ar'
                  ? 'بمجرد استلام الشحنة وفحصها في محترفنا بالرياض، تتم معالجة استرداد المبلغ إلى بطاقة الدفع الأصلية (مدى، فيزا، أو ماستركارد) خلال 3 إلى 5 أيام عمل وفق سياسات البنك المصدر.'
                  : 'Following quality inspection at our Riyadh atelier, funds are reversed to the original payment method within 3 to 5 business days, subject to the cardholder’s issuing bank.'}
              </p>
            </div>
          </div>
        </section>

        {/* Support Contact Prompt */}
        <div className="bg-[#EAE4D9]/60 border border-[#242220]/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#511D24] shrink-0" />
            <p className="text-[#242220]/80 leading-relaxed font-light">
              {language === 'ar'
                ? 'هل ترغب في تنسيق طلب إرجاع أو لديك استفسار لوجستي خاص؟'
                : 'Need assistance coordinating a return or have a specialized delivery request?'}
            </p>
          </div>
          <Link
            href="/contact"
            className="py-2.5 px-6 bg-[#111111] hover:bg-[#511D24] text-white font-medium uppercase tracking-wider transition-colors shrink-0"
          >
            {language === 'ar' ? 'تواصل مع الكونسيرج' : 'Contact Concierge'}
          </Link>
        </div>
      </div>
    </div>
  );
}
