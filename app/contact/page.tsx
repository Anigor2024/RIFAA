'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { language } = useLanguage();
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
  const storeLocation = process.env.NEXT_PUBLIC_STORE_LOCATION;
  const liveContactConfigured = Boolean(supportEmail || supportPhone || storeLocation);

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#242220]/50 mb-6">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">
            {language === 'ar' ? 'خدمة العملاء والاستفسارات' : 'Customer Care & Inquiries'}
          </span>
        </div>

        {/* Page Header */}
        <div className="pb-8 mb-10 border-b border-[#242220]/10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block mb-1">
            {language === 'ar' ? 'في خدمتكم' : 'AT YOUR SERVICE'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'خدمة عملاء رِفْعة' : 'RIFAA Client Services'}
          </h1>
          <p className="text-sm text-[#242220]/70 max-w-xl font-light leading-relaxed mt-2">
            {language === 'ar'
              ? 'هذه الصفحة تعرض نموذج تجربة خدمة عملاء راقية. عند تشغيل المتجر فعلياً يمكن ربطها ببيانات التواصل الحقيقية، نظام التذاكر، وواتساب الأعمال.'
              : 'This page demonstrates a premium client-care experience. A live store can connect real contact details, ticketing, and WhatsApp Business.'}
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#FFFDFC] p-6 border border-[#242220]/10 space-y-3">
            <Phone className="w-5 h-5 text-[#511D24]" />
            <h3 className="text-base font-semibold text-[#111111]">
              {language === 'ar' ? 'الاتصال المباشر والواتساب' : 'Direct Telephone & WhatsApp'}
            </h3>
            <p className="text-xs text-[#242220]/60">
              {language === 'ar' ? 'يومياً من 9 صباحاً حتى 10 مساءً' : 'Daily 9:00 AM – 10:00 PM (AST)'}
            </p>
            <p className="text-sm font-medium text-[#111111] tabular-nums" dir="ltr">
              {supportPhone || (language === 'ar' ? 'يُضبط عند الإطلاق الفعلي' : 'Configure for live launch')}
            </p>
          </div>

          <div className="bg-[#FFFDFC] p-6 border border-[#242220]/10 space-y-3">
            <Mail className="w-5 h-5 text-[#511D24]" />
            <h3 className="text-base font-semibold text-[#111111]">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Electronic Mail'}
            </h3>
            <p className="text-xs text-[#242220]/60">
              {language === 'ar' ? 'نرد خلال ساعتين خلال أوقات العمل' : 'Response within 2 hours during business hours'}
            </p>
            <p className="text-sm font-medium text-[#111111]">
              {supportEmail || (language === 'ar' ? 'يُضبط عند الإطلاق الفعلي' : 'Configure for live launch')}
            </p>
          </div>

          <div className="bg-[#FFFDFC] p-6 border border-[#242220]/10 space-y-3">
            <MapPin className="w-5 h-5 text-[#511D24]" />
            <h3 className="text-base font-semibold text-[#111111]">
              {language === 'ar' ? 'صالات العرض' : 'Salons & Flagships'}
            </h3>
            <p className="text-xs text-[#242220]/60">
              {storeLocation || (language === 'ar' ? 'موقع العرض يُضبط عند الإطلاق الفعلي' : 'Store location is configured for live launch')}
            </p>
            <p className="text-xs text-[#511D24] font-medium">
              {liveContactConfigured ? (language === 'ar' ? 'بيانات التواصل التشغيلية مفعلة' : 'Live contact configuration enabled') : (language === 'ar' ? 'وضع العرض التجريبي' : 'Showcase mode')}
            </p>
          </div>
        </div>

        {/* Policy Pillars */}
        <div className="bg-[#EAE4D9]/60 p-8 border border-[#242220]/10 space-y-4">
          <h2 className="text-lg font-semibold text-[#111111]">
            {language === 'ar' ? 'معايير التشغيل المقترحة' : 'PROPOSED OPERATING STANDARDS'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#242220]/80 leading-relaxed">
            <p>
              {language === 'ar'
                ? '• التوصيل: نموذج تسعير وشحن قابل للربط بمزود لوجستي حقيقي ومناطق الخدمة الفعلية.'
                : '• Delivery: configurable pricing and service-zone model ready for a real logistics provider.'}
            </p>
            <p>
              {language === 'ar'
                ? '• الإرجاع والاستبدال: تجربة واجهة جاهزة لربط سياسة الإرجاع الفعلية وموافقات خدمة العملاء.'
                : '• Returns & Exchanges: interface flow ready to connect to the store’s real policy and support approvals.'}
            </p>
            <p>
              {language === 'ar'
                ? '• الدفع: بنية الواجهة جاهزة لمزود دفع حقيقي؛ لا يتم تحصيل أي مبلغ في وضع العرض الحالي.'
                : '• Payment: the UI is ready for a real payment provider; showcase mode does not capture funds.'}
            </p>
            <p>
              {language === 'ar'
                ? '• التغليف: تصور فاخر قابل للتحويل إلى معيار تشغيل حقيقي حسب تجهيزات العلامة وسلسلة التوريد.'
                : '• Packaging: premium concept ready to become a real fulfillment standard when brand operations are configured.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
