'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
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
            {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </span>
        </nav>

        {/* Page Header */}
        <header className="pb-8 mb-8 border-b border-[#242220]/10 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-semibold block">
            {language === 'ar' ? 'الشفافية وحماية البيانات' : 'TRANSPARENCY & DATA PROTECTION'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'سياسة الخصوصية وسرية المعلومات' : 'Privacy & Data Protection Policy'}
          </h1>
          <p className="text-xs sm:text-sm text-[#242220]/75 max-w-xl font-light leading-relaxed">
            {language === 'ar'
              ? 'تعرض هذه الصفحة نموذجاً لسياسة خصوصية متجر إلكتروني. يجب مراجعتها قانونياً وتحديثها بحسب الكيان التجاري ومزودي الخدمة الفعليين قبل الإطلاق.'
              : 'This page is a model ecommerce privacy policy. It must be legally reviewed and updated for the actual merchant, processors, and launch jurisdiction before commercial use.'}
          </p>
        </header>

        {/* Portfolio Demo Notice */}
        <div className="p-4 bg-[#EAE3D6]/70 border-s-3 border-[#B59A73] text-xs text-[#242220]/80 leading-relaxed mb-12">
          <p className="font-semibold text-[#111111] mb-1">
            {language === 'ar' ? 'إشعار المنصة التوضيحي:' : 'Demonstration Platform Notice:'}
          </p>
          <p>
            {language === 'ar'
              ? 'تُعرض هذه الوثيقة كنموذج استعراضي لمعايير الخصوصية الرقمية لدار رِفْعة ضمن محفظة أعمال التصميم والبرمجة، وليست وثيقة محررة لأغراض التداول التجاري المباشر.'
              : 'This document serves as an illustrative portfolio representation of RIFAA’s digital data handling commitments and is not intended as formal statutory legal counsel.'}
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-[#242220]/85 font-light leading-relaxed shadow-xs">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '1. البيانات التي يتم جمعها' : '1. Information We Collect'}
            </h2>
            <p>
              {language === 'ar'
                ? 'في نسخة العرض الحالية، تُحفظ بيانات الحساب والعناوين والحقيبة والتفضيلات محلياً في متصفح المستخدم. عند تفعيل Backend فعلي، يجب تحديث هذه السياسة لتحديد البيانات التي تُجمع وأغراضها وفترات الاحتفاظ بها.'
                : 'In the current showcase, account, address, bag, and preference data are stored locally in the user’s browser. Once a real backend is enabled, this policy must identify collected data, purposes, processors, and retention periods.'}
            </p>
            <p>
              {language === 'ar'
                ? 'ملاحظة هامة: لا يتم حفظ أو تخزين أي أرقام بطاقات ائتمانية حساسة على خوادمنا.'
                : 'Critical Notice: Sensitive card verification codes and full card credentials are never stored on our persistent servers.'}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-[#242220]/10">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '2. أوجه استخدام البيانات الشخصية' : '2. How Information is Utilized'}
            </h2>
            <p>
              {language === 'ar'
                ? 'في التشغيل الفعلي يمكن أن تُستخدم البيانات المصرح بها للأغراض التالية بعد توثيق الأساس النظامي والموافقة المناسبة:'
                : 'In live operation, authorized data may be used for the following purposes once the lawful basis and required consent are documented:'}
            </p>
            <ul className="list-disc list-inside space-y-1.5 ps-2 text-[#242220]/80">
              <li>{language === 'ar' ? 'معالجة الطلبات وربطها بمزود دفع وشحن فعلي عند تفعيلهما.' : 'Processing orders through configured payment and delivery providers once enabled.'}</li>
              <li>{language === 'ar' ? 'تقديم دعم العملاء والمقاسات عند تفعيل قناة دعم تشغيلية.' : 'Providing client and sizing support when a live support channel is configured.'}</li>
              <li>{language === 'ar' ? 'حفظ تفضيلات اللغة (العربية / الإنجليزية) وحقيبة التسوق في متصفحك.' : 'Retaining local language (Arabic / English) and shopping bag states.'}</li>
              <li>{language === 'ar' ? 'إرسال رسائل تسويقية فقط بعد ربط مزود بريد وتسجيل موافقة المستخدم.' : 'Sending marketing messages only after an email provider and valid opt-in are configured.'}</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-[#242220]/10">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '3. ملفات تعريف الارتباط والتخزين المحلي' : '3. Local Storage & Session State'}
            </h2>
            <p>
              {language === 'ar'
                ? 'نستخدم التخزين المحلي للمتصفح (localStorage و sessionStorage) لحفظ محتويات حقيبة التسوق، قائمة الرغبات، واللغة المفضلة لديك محلياً على جهازك دون إرسالها لجهات تتبع إعلانية خارجية.'
                : 'Our platform utilizes browser-level state persistence (localStorage and sessionStorage) exclusively to preserve shopping bag contents, wishlist selections, and language direction locally without sharing telemetry with third-party advertising brokers.'}
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-[#242220]/10">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              {language === 'ar' ? '4. حقوق العميل' : '4. Client Rights & Contact'}
            </h2>
            <p>
              {language === 'ar'
                ? `في وضع العرض الحالي يمكن للمستخدم مسح بيانات الحساب المحلية من مساحة العميل. عند الإطلاق التجاري يجب إضافة قناة خصوصية فعلية وإجراءات للوصول والتصحيح والحذف. ${supportEmail ? `للتواصل: ${supportEmail}` : ''}`
                : `In showcase mode, users can clear local account data from Client Space. Commercial launch requires a real privacy contact and procedures for access, correction, and deletion. ${supportEmail ? `Contact: ${supportEmail}` : ''}`}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
