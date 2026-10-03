'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FAQItem {
  id: string;
  category: 'orders' | 'sizing' | 'returns' | 'payment' | 'care' | 'demo';
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

const FAQ_DATA: FAQItem[] = [
  // Orders & Delivery
  {
    id: 'faq-1',
    category: 'orders',
    questionAr: 'كم تستغرق مدة توصيل الطلبات داخل المملكة العربية السعودية؟',
    questionEn: 'What is the estimated delivery timeframe across Saudi Arabia?',
    answerAr: 'تعرض النسخة الحالية إعدادات شحن توضيحية تشمل قياسياً وسريعاً وخياراً خاصاً بالرياض. عند الإطلاق الفعلي يجب ربط الأزمنة والمناطق بمزود الشحن الحقيقي ومستوى الخدمة المتفق عليه.',
    answerEn: 'The current showcase includes standard, express, and Riyadh-specific delivery configurations. Live launch must connect delivery windows and service areas to the actual carrier and agreed SLA.',
  },
  {
    id: 'faq-2',
    category: 'orders',
    questionAr: 'هل يتوفر شحن مجاني للطلبات؟',
    questionEn: 'Is complimentary shipping available?',
    answerAr: 'تستخدم النسخة الحالية حداً تجريبياً للشحن المجاني عند 500 ريال لتوضيح منطق المتجر. يمكن تغييره أو إلغاؤه حسب سياسة التشغيل الفعلية.',
    answerEn: 'The showcase uses SAR 500 as a demo free-shipping threshold to illustrate store logic. It can be changed or removed for the merchant’s real operating policy.',
  },

  // Sizing & Fit
  {
    id: 'faq-3',
    category: 'sizing',
    questionAr: 'كيف أحدد مقاس الثوب أو العباية المناسب لي بدقة؟',
    questionEn: 'How do I choose the correct size for a Saudi thobe or abaya?',
    answerAr: 'يعرض دليل المقاسات نموذجاً تفصيلياً لمقاسات الثياب والعبايات. قبل الاستخدام التجاري يجب اعتماد جداول القياس النهائية لكل منتج وربطها بمواصفات المورد أو المصمم.',
    answerEn: 'The Size Guide demonstrates a detailed sizing experience for thobes and abayas. Commercial use requires final product-specific measurements aligned with the real supplier or designer specifications.',
  },
  {
    id: 'faq-4',
    category: 'sizing',
    questionAr: 'هل مقاسات الأطفال مطابقة للفئات العمرية المعتادة؟',
    questionEn: 'Are children’s sizes true to standard age brackets?',
    answerAr: 'الفئات العمرية الحالية بيانات عرض توضيحية. يجب اعتماد جدول قياسات الأطفال الفعلي لكل منتج قبل البيع المباشر.',
    answerEn: 'Current children’s age brackets are showcase data. Live selling requires an approved size chart for each actual product.',
  },

  // Returns & Exchanges
  {
    id: 'faq-5',
    category: 'returns',
    questionAr: 'ما هي مهلة وسياسة استبدال أو إرجاع القطع؟',
    questionEn: 'What is the return and exchange window?',
    answerAr: 'تعرض النسخة الحالية نموذج نافذة إرجاع لمدة 14 يوماً. قبل الإطلاق يجب اعتماد سياسة الإرجاع الفعلية وربطها بإجراءات خدمة العملاء والشحن العكسي.',
    answerEn: 'The showcase models a 14-day return window. Live launch requires the merchant’s approved returns policy and reverse-logistics workflow.',
  },
  {
    id: 'faq-6',
    category: 'returns',
    questionAr: 'متى يتم استرداد المبلغ المدفوع بعد الإرجاع؟',
    questionEn: 'How soon are refunds processed after a return?',
    answerAr: 'في التشغيل الفعلي تعتمد مدة الاسترداد على مزود الدفع والبنك المصدر وحالة الإرجاع المعتمدة. النسخة الحالية لا تنفذ استرداداً مالياً حقيقياً.',
    answerEn: 'In live operation, refund timing depends on the payment provider, issuing bank, and approved return status. The current showcase does not execute real refunds.',
  },

  // Payments & Pricing
  {
    id: 'faq-7',
    category: 'payment',
    questionAr: 'ما هي طرق الدفع المعتمدة لدى دار رِفْعة؟',
    questionEn: 'Which payment methods are accepted by RIFAA?',
    answerAr: 'واجهة الدفع تعرض مدى والبطاقات وآبل باي كتجربة تصميمية. تفعيل أي طريقة فعلياً يتطلب مزود دفع معتمداً وإعداداً ضريبياً صحيحاً.',
    answerEn: 'The checkout UI demonstrates Mada, card, and Apple Pay options. Activating any method requires an approved payment provider and correct tax configuration.',
  },

  // Care
  {
    id: 'faq-8',
    category: 'care',
    questionAr: 'كيف أعتني بأقمشة الكريب والكتان والحرير الطبيعي؟',
    questionEn: 'How should I care for Japanese crepe, linen, and silk pieces?',
    answerAr: 'تعليمات العناية الحالية أمثلة مرتبطة ببيانات المنتجات التجريبية. يجب استبدالها بتعليمات المورد أو المصمم الفعلية قبل البيع.',
    answerEn: 'Current care guidance is illustrative and tied to showcase product data. Replace it with the real supplier or designer care instructions before sale.',
  },

  // Demo Platform Clarification
  {
    id: 'faq-9',
    category: 'demo',
    questionAr: 'هل يتم خصم أي مبالغ مالية حقيقية عند تجربة إتمام الطلب؟',
    questionEn: 'Are real payments processed during checkout on this website?',
    answerAr: 'كلا، هذا الموقع هو منصة استعراض رقمية تمهيدية لمحفظة أعمال دار رِفْعة. جميع عمليات الشراء وتأكيدات الدفع هي محاكاة تفاعلية واقعية لتجربة المستخدم، ولن يتم سحب أي مبالغ من بطاقتك البنكية.',
    answerEn: 'No. This platform is a digital portfolio demonstration for the RIFAA brand. All order placements and payment confirmations are realistic front-end simulations; no real funds will ever be charged.',
  },
];

export default function FAQPage() {
  const { language, isRtl, t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'orders' | 'sizing' | 'returns' | 'payment' | 'care'>('all');

  const filteredFaqs = selectedFilter === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter((item) => item.category === selectedFilter);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

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
            {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </span>
        </nav>

        {/* Header */}
        <header className="pb-8 mb-8 border-b border-[#242220]/10 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-semibold block">
            {language === 'ar' ? 'مركز المساعدة والاستفسارات' : 'CLIENT CARE & INQUIRIES'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-xs sm:text-sm text-[#242220]/75 max-w-xl font-light leading-relaxed">
            {language === 'ar'
              ? 'إجابات توضيحية عن تجربة الشحن والمقاسات والدفع والعناية، مع فصل واضح بين نموذج العرض والإعداد التشغيلي الفعلي.'
              : 'Illustrative answers covering delivery, sizing, payment, and care, with a clear distinction between showcase behavior and live operations.'}
          </p>
        </header>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 text-xs">
          {(
            [
              { id: 'all', labelAr: 'جميع الأسئلة', labelEn: 'All Questions' },
              { id: 'orders', labelAr: 'الطلبات والشحن', labelEn: 'Orders & Shipping' },
              { id: 'sizing', labelAr: 'المقاسات', labelEn: 'Sizing & Fit' },
              { id: 'returns', labelAr: 'الإرجاع والاستبدال', labelEn: 'Returns' },
              { id: 'payment', labelAr: 'طرق الدفع', labelEn: 'Payment' },
              { id: 'care', labelAr: 'العناية بالقطع', labelEn: 'Fabric Care' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`py-2 px-3.5 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
              }`}
            >
              {language === 'ar' ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3 mb-16">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const question = language === 'ar' ? faq.questionAr : faq.questionEn;
            const answer = language === 'ar' ? faq.answerAr : faq.answerEn;
            const buttonId = `faq-btn-${faq.id}`;
            const panelId = `faq-panel-${faq.id}`;

            return (
              <div
                key={faq.id}
                className="bg-[#FFFDFC] border border-[#242220]/10 transition-colors"
              >
                <button
                  id={buttonId}
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full py-4 px-6 flex items-center justify-between text-start cursor-pointer gap-4"
                >
                  <span className="text-sm font-semibold text-[#111111] leading-snug">
                    {question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#511D24] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#242220]/80 font-light leading-relaxed border-t border-[#242220]/05"
                  >
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Inquiries Banner */}
        <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-base font-bold text-[#111111]">
              {language === 'ar' ? 'هل لديك سؤال لم تجد إجابته هنا؟' : 'Have a question not listed here?'}
            </h3>
            <p className="text-xs text-[#242220]/70 font-light">
              {language === 'ar'
                ? 'صفحة التواصل تعرض قناة الدعم ويمكن ربطها ببيانات خدمة العملاء الحقيقية عند الإطلاق.'
                : 'The contact page is ready to connect to the merchant’s real client-support channels at launch.'}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 py-3 px-6 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-semibold tracking-wider uppercase transition-colors shrink-0"
          >
            <span>{language === 'ar' ? 'التواصل مع خدمة العملاء' : 'Contact Support'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </div>
  );
}
