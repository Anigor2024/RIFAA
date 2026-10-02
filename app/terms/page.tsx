'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, FileCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { language, isRtl } = useLanguage();

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
              ? 'تحدد هذه الوثيقة الضوابط المنظمة لاستخدام منصة دار رِفْعة الرقمية والخدمات التابعة لها في المملكة العربية السعودية.'
              : 'These terms articulate the operating principles and guidelines governing access to the RIFAA digital platform and affiliated services in Saudi Arabia.'}
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
                ? 'يُعد تصفحك لمنصة رِفْعة أو تجربة خدماتها بمثابة موافقة صريحة على الالتزام بهذه الشروط والأحكام، وكافة السياسات الملحقة بها كسياسة الخصوصية والشحن والإرجاع.'
                : 'Accessing or utilizing the RIFAA digital storefront constitutes agreement to be bound by these Terms of Service, along with related Shipping, Return, and Privacy policies.'}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-[#242220]/10">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '2. الملكية الفكرية والعلامة التجارية' : '2. Intellectual Property Rights'}
            </h2>
            <p>
              {language === 'ar'
                ? 'كافة المواد المعروضة على المنصة، بما يشمل التصاميم، الصور التحريرية، النصوص الوصفية، والزخارف المعمارية المستوحاة من هوية المملكة، هي ملكية فكرية حصرية لدار رِفْعة ومحمية بموجب أنظمة حماية حقوق المؤلف والعلامات التجارية.'
                : 'All visual assets, editorial photography, garment designs, narrative prose, and architectural emblems featured on this platform are proprietary assets of RIFAA and protected under regional copyright and intellectual property conventions.'}
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-[#242220]/10">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '3. مواصفات القطع والأسعار' : '3. Product Specifications & Pricing'}
            </h2>
            <p>
              {language === 'ar'
                ? 'نحرص على دقة عرض مواصفات الأقمشة (الكريب، الكتان، الحرير، الصوف) والتطريز. كافة الأسعار معلنة بالريال السعودي (SAR) وتشمل ضريبة القيمة المضافة. قد يطرأ تعديل على الأسعار أو توفر المجموعات الموسمية وفق جدول الإصدارات التحريرية للدار.'
                : 'We endeavor to portray textile compositions, tailoring dimensions, and hues with photographic fidelity. All prices are published in Saudi Riyals (SAR) inclusive of VAT. Availability is subject to seasonal curation release schedules.'}
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-[#242220]/10">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '4. القانون المرجعي والنزاعات' : '4. Governing Principles & Inquiries'}
            </h2>
            <p>
              {language === 'ar'
                ? 'تخضع هذه الشروط وتُفسر وفق الأنظمة واللوائح المعمول بها في المملكة العربية السعودية. في حال وجود أي استفسار حول هذه البنود، يرجى التواصل مع فريق الشؤون المؤسسية عبر concierge@rifaa.sa.'
                : 'These terms are governed in accordance with the regulatory framework of the Kingdom of Saudi Arabia. For institutional inquiries, kindly address correspondence to concierge@rifaa.sa.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
