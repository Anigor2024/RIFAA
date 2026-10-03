'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { language } = useLanguage();
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

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
            {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
          </span>
        </nav>

        {/* Page Header */}
        <header className="pb-8 mb-8 border-b border-[#242220]/10 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-semibold block">
            {language === 'ar' ? 'الإطار القانوني والتنظيمي' : 'LEGAL FRAMEWORK'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'الشروط والأحكام العامة' : 'Terms & Conditions of Service'}
          </h1>
          <p className="text-xs sm:text-sm text-[#242220]/75 max-w-xl font-light leading-relaxed">
            {language === 'ar'
              ? 'هذه وثيقة شروط نموذجية لتجربة متجر إلكتروني، وليست بديلاً عن صياغة قانونية خاصة بالكيان التجاري الذي سيشغل المتجر فعلياً.'
              : 'These are model storefront terms and are not a substitute for merchant-specific legal terms reviewed for the business that will operate the store.'}
          </p>
        </header>

        {/* Portfolio Demo Notice */}
        <div className="p-4 bg-[#EAE3D6]/70 border-s-3 border-[#B59A73] text-xs text-[#242220]/80 leading-relaxed mb-12">
          <p className="font-semibold text-[#111111] mb-1">
            {language === 'ar' ? 'إشعار المنصة الاستعراضية:' : 'Demonstration Platform Context:'}
          </p>
          <p>
            {language === 'ar'
              ? 'تعتبر منصة رِفْعة الحالية بيئة عرض تجريبية لمحفظة الأزياء والتصميم المعماري. لا تنشأ عن استخدام هذه النسخة التزامات تعاقدية تجارية إلزامية لبيع أو تسليم قطع تجارية.'
              : 'This digital platform represents a portfolio demonstration of RIFAA’s architectural fashion house. No binding commercial purchase contracts are executed through this demonstration release.'}
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-[#242220]/85 font-light leading-relaxed shadow-xs">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '1. قبول الشروط العامة' : '1. Acceptance of Terms'}
            </h2>
            <p>
              {language === 'ar'
                ? 'في هذه النسخة الاستعراضية لا ينشأ عقد بيع أو التزام دفع. عند الإطلاق التجاري يجب تفعيل شروط ملزمة وموافقة واضحة قبل إنشاء الطلب.'
                : 'This showcase does not create a sale contract or payment obligation. Commercial launch requires merchant-approved binding terms and explicit checkout acceptance.'}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-[#242220]/10">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '2. الملكية الفكرية والعلامة التجارية' : '2. Intellectual Property Rights'}
            </h2>
            <p>
              {language === 'ar'
                ? 'يجب على المالك التجاري التأكد من حقوق استخدام العلامة والصور والنصوص والتصاميم قبل الإطلاق. مواد نموذج العرض لا تُعد تلقائياً إثباتاً لملكية حقوق تجارية مسجلة.'
                : 'The commercial operator must verify rights to all branding, imagery, copy, and product designs before launch. Showcase assets do not automatically establish registered commercial ownership.'}
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-[#242220]/10">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '3. مواصفات القطع والأسعار' : '3. Product Specifications & Pricing'}
            </h2>
            <p>
              {language === 'ar'
                ? 'المنتجات والأسعار والمواصفات الحالية بيانات عرض. قبل الإطلاق التجاري يجب ربطها بالمخزون الفعلي، الضرائب الصحيحة، وسياسة التسعير المعتمدة.'
                : 'Current products, pricing, and specifications are showcase data. Commercial launch requires real inventory, validated tax treatment, and approved pricing.'}
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-[#242220]/10">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '4. القانون المرجعي والنزاعات' : '4. Governing Principles & Inquiries'}
            </h2>
            <p>
              {language === 'ar'
                ? `يجب تحديد القانون المختص، بيانات التاجر، وسياسة النزاعات بعد مراجعة قانونية قبل الإطلاق. ${supportEmail ? `قناة التواصل الحالية: ${supportEmail}` : ''}`
                : `Governing law, merchant identity, and dispute procedures must be finalized through legal review before launch. ${supportEmail ? `Current contact: ${supportEmail}` : ''}`}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
