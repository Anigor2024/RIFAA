'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { language, t } = useLanguage();

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
              ? 'فريقنا المتخصص في الرياض متاح لمساعدتكم في اختيار المقاسات، تنسيق الإطلالات، ومتابعة الطلبات الخاصة.'
              : 'Our dedicated Riyadh concierge team is at your disposal for sizing guidance, bespoke styling advice, and order inquiries.'}
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
              +966 11 234 5678
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
              concierge@rifaa.sa
            </p>
          </div>

          <div className="bg-[#FFFDFC] p-6 border border-[#242220]/10 space-y-3">
            <MapPin className="w-5 h-5 text-[#511D24]" />
            <h3 className="text-base font-semibold text-[#111111]">
              {language === 'ar' ? 'صالات العرض' : 'Salons & Flagships'}
            </h3>
            <p className="text-xs text-[#242220]/60">
              {language === 'ar' ? 'حي العليا، الرياض، المملكة العربية السعودية' : 'Al Olaya District, Riyadh, Saudi Arabia'}
            </p>
            <p className="text-xs text-[#511D24] font-medium">
              {language === 'ar' ? 'الزيارات بالمواعيد المسبقة' : 'Private Appointments Available'}
            </p>
          </div>
        </div>

        {/* Policy Pillars */}
        <div className="bg-[#EAE4D9]/60 p-8 border border-[#242220]/10 space-y-4">
          <h2 className="text-lg font-semibold text-[#111111]">
            {language === 'ar' ? 'سياسات رِفْعة المعتمدة' : 'RIFAA Client Commitments'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#242220]/80 leading-relaxed">
            <p>
              {language === 'ar'
                ? '• التوصيل: شحن مجاني لكافة مناطق المملكة للطلبات فوق 500 ريال. مدة التوصيل 1-3 أيام عمل.'
                : '• Delivery: Complimentary across Saudi Arabia on orders over SAR 500. Expected delivery within 1-3 business days.'}
            </p>
            <p>
              {language === 'ar'
                ? '• الإرجاع والاستبدال: متاح مجاناً خلال 14 يوماً من استلام الشحنة بشرط بقاء القطعة في حالتها الأصلية مع بطاقات السعر.'
                : '• Returns & Exchanges: Complimentary within 14 days of receipt, provided items remain unworn with original tags attached.'}
            </p>
            <p>
              {language === 'ar'
                ? '• طرق الدفع: مدى، آبل باي، فيزا، ماستركارد، وخيارات الدفع المقسم عبر تابي وتمارا.'
                : '• Payment: Mada, Apple Pay, Visa, Mastercard, and interest-free installment options via Tabby and Tamara.'}
            </p>
            <p>
              {language === 'ar'
                ? '• التغليف: كل قطعة تُغلَف يدوياً بورق حريري وصندوق دار رِفْعة الصلب المميز برائحة العود الخفيفة.'
                : '• Packaging: Each creation is wrapped in archival tissue and presented in RIFAA’s signature scented presentation box.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
