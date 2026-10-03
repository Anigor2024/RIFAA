'use client';

import Link from 'next/link';
import { Truck, RotateCcw, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ShippingReturnsPage() {
  const { language } = useLanguage();

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
            {language === 'ar' ? 'نموذج تجربة الخدمة' : 'SERVICE EXPERIENCE CONCEPT'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'سياسة الشحن والإرجاع' : 'Shipping & Return Policies'}
          </h1>
          <p className="text-xs sm:text-sm text-[#242220]/75 max-w-xl font-light leading-relaxed">
            {language === 'ar'
              ? 'تستعرض هذه الصفحة تصور دار رِفْعة لتجربة لوجستية فاخرة يمكن تطبيقها في متجر إنتاجي داخل المملكة العربية السعودية.'
              : 'This page presents RIFAA’s concept for a discreet luxury logistics experience that could be implemented in a production store across Saudi Arabia.'}
          </p>
        </header>

        {/* Demo Disclaimer Banner */}
        <div className="p-4 bg-[#EAE3D6]/70 border-s-3 border-[#B59A73] text-xs text-[#242220]/80 leading-relaxed mb-12">
          <p className="font-semibold text-[#111111] mb-1">
            {language === 'ar' ? 'توضيح العرض التمهيدي للمنصة:' : 'Demonstration Platform Disclosure:'}
          </p>
          <p>
            {language === 'ar'
              ? 'السياسات والجداول الزمنية أدناه أمثلة تشغيلية توضيحية ضمن نموذج محفظة الأعمال، وليست التزامات شحن أو إرجاع أو استرداد فعلية حالياً.'
              : 'The timelines and policies below are illustrative operating examples for this portfolio demonstration and are not current real-world shipping, returns, or refund commitments.'}
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
                  ? 'إعداد تجريبي: شحن قياسي مجاني للطلبات فوق 500 ر.س، أو 35 ر.س للطلبات الأقل، مع نافذة توصيل توضيحية من 2 إلى 4 أيام عمل.'
                  : 'Demo setting: standard delivery is free above SAR 500 or SAR 35 below, with an illustrative 2–4 business-day delivery window.'}
              </p>
            </div>

            <div className="bg-[#FFFDFC] border border-[#242220]/10 p-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#511D24]">
                {language === 'ar' ? 'الشحن السريع' : 'Express Delivery'}
              </span>
              <p className="text-xs text-[#242220]/70 leading-relaxed font-light">
                {language === 'ar'
                  ? 'إعداد تجريبي برسوم 65 ر.س يوضح مسار الشحن ذي الأولوية، مع نافذة وصول نموذجية من 1 إلى 2 يوم عمل في المدن الرئيسية.'
                  : 'Demo setting: SAR 65 illustrates a priority-delivery tier with a sample 1–2 business-day arrival window in major cities.'}
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
                ? 'يقترح معيار الشحن التجريبي تغليف القطع بورق حريري أرشيفي وصندوق عرض صلب وغطاء واقٍ، كمثال على تجربة تسليم فاخرة يمكن تنفيذها في بيئة إنتاجية.'
                : 'The demonstration fulfillment standard envisions archival tissue, a rigid presentation box, and protective outer packaging as an example of a premium production delivery experience.'}
            </p>
          </div>
        </section>

        {/* 2. Returns & Exchanges */}
        <section className="space-y-6 mb-16">
          <div className="flex items-center gap-3 pb-3 border-b border-[#242220]/10">
            <RotateCcw className="w-5 h-5 text-[#511D24]" />
            <h2 className="text-xl font-bold text-[#111111]">
              {language === 'ar' ? 'نموذج الإرجاع والاستبدال' : 'Returns & Exchanges Concept'}
            </h2>
          </div>

          <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 space-y-6 text-xs text-[#242220]/85">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#111111]">
                {language === 'ar' ? 'نافذة إرجاع تجريبية: 14 يوماً' : 'Demo 14-Day Consideration Window'}
              </h3>
              <p className="font-light leading-relaxed">
                {language === 'ar'
                  ? 'يستعرض النموذج سياسة مقترحة تمنح العميل نافذة 14 يوماً من الاستلام لطلب استبدال المقاس أو الإرجاع ضمن تجربة متجر إنتاجي مستقبلية.'
                  : 'The demonstration policy models a 14-day window from receipt for a size exchange or return request in a future production implementation.'}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#111111]">
                {language === 'ar' ? 'شروط قبول القطع المرتجعة' : 'Return Eligibility Criteria'}
              </h3>
              <ul className="space-y-1.5 list-disc list-inside font-light leading-relaxed text-[#242220]/80">
                <li>
                  {language === 'ar'
                    ? 'في النموذج المقترح، تبقى القطعة بحالتها الأصلية دون ارتداء أو غسل أو تعديل، وخالية من علامات الاستخدام.'
                    : 'In the proposed policy, items would remain unworn, unwashed, unaltered, and free from signs of use.'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'في التطبيق الإنتاجي المقترح، تُحفظ البطاقات والعلامات الأصلية مثبتة في مكانها عند طلب الإرجاع.'
                    : 'In the proposed production policy, original tags, seals, and care labels would remain intact for return eligibility.'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'يتصور النموذج إعادة القطعة داخل عبوة العرض وغطاء الحماية الأصليين عند توفرهما.'
                    : 'The concept envisions returning items in their original presentation packaging and protective cover when provided.'}
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#111111]">
                {language === 'ar' ? 'آلية معالجة واسترداد المبالغ' : 'Refund Processing'}
              </h3>
              <p className="font-light leading-relaxed">
                {language === 'ar'
                  ? 'في تطبيق إنتاجي، يمكن أن تمر المرتجعات المقبولة بمرحلة فحص ثم معالجة الاسترداد عبر مزود الدفع المختار والبنك المصدر وفق الجداول الفعلية لكل خدمة.'
                  : 'In a production implementation, an approved return could proceed through inspection and refund processing according to the configured payment provider and issuing bank timelines.'}
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
                ? 'هل ترغب في استكشاف كيفية تصميم رحلة دعم لوجستية أو إرجاع ضمن تجربة المتجر؟'
                : 'Explore how a premium returns and delivery-support journey could be designed for a production store.'}
            </p>
          </div>
          <Link
            href="/contact"
            className="py-2.5 px-6 bg-[#111111] hover:bg-[#511D24] text-white font-medium uppercase tracking-wider transition-colors shrink-0"
          >
            {language === 'ar' ? 'استكشف تجربة الدعم' : 'Explore Support Experience'}
          </Link>
        </div>
      </div>
    </div>
  );
}
