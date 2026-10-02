'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
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
              ? 'تلتزم دار رِفْعة بحماية خصوصية عملائها وزوار منصتها وفق أعلى المعايير الأخلاقية والمبادئ العامة لحماية البيانات الشخصية في المملكة العربية السعودية.'
              : 'RIFAA is committed to upholding rigorous standards of confidentiality and client privacy in alignment with applicable Saudi Personal Data Protection principles.'}
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
                ? 'عند استخدام المنصة أو تجربة إتمام الطلب، قد نقوم بجمع البيانات الضرورية لتقديم الخدمة، مثل: الاسم الكامل، عنوان البريد الإلكتروني، رقم الجوال للتوصيل، العنوان الجغرافي داخل المملكة، وتفضيلات المقاسات واللغة.'
                : 'When interacting with our platform or test checkout, we process information necessary to fulfill service requests, including: client name, email address, courier delivery phone number, delivery address in Saudi Arabia, and sizing/language preferences.'}
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
                ? 'تُستخدم البيانات المجمعة للأغراض التالية فقط:'
                : 'Collected client details are utilized strictly for the following purposes:'}
            </p>
            <ul className="list-disc list-inside space-y-1.5 ps-2 text-[#242220]/80">
              <li>{language === 'ar' ? 'معالجة وتوثيق الطلبات وتنسيق تسليم الشحنات مع الكونسيرج.' : 'Processing and logging orders and coordinating delivery with couriers.'}</li>
              <li>{language === 'ar' ? 'تقديم المساعدة الشخصية في اختيار المقاسات والاستفسارات.' : 'Providing bespoke fit and styling consultations via our Riyadh concierge.'}</li>
              <li>{language === 'ar' ? 'حفظ تفضيلات اللغة (العربية / الإنجليزية) وحقيبة التسوق في متصفحك.' : 'Retaining local language (Arabic / English) and shopping bag states.'}</li>
              <li>{language === 'ar' ? 'إرسال تحديثات المجموعات الموسمية في حال اشتراكك الاختياري في النشرة.' : 'Sending seasonal collection updates upon voluntary newsletter opt-in.'}</li>
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
                ? 'يحق لكل عميل طلب الاطلاع على بياناته أو تعديلها أو حذفها من سجلاتنا في أي وقت. لأي استفسار يتعلق بالخصوصية، يمكنكم التواصل مع مسؤول حماية البيانات عبر concierge@rifaa.sa.'
                : 'Clients hold the right to access, rectify, or request the erasure of their records at any time. For privacy inquiries, please contact our data stewardship desk at concierge@rifaa.sa.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
