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
    answerAr: 'يستغرق التوصيل القياسي من يومين إلى 4 أيام عمل لكافة مناطق ومحافظات المملكة. كما يتوفر خيار الشحن السريع (1-2 يوم عمل)، وخيار كونسيرج الرياض للتسليم في نفس اليوم للطلبات المسجلة قبل الساعة 2 ظهراً.',
    answerEn: 'Standard shipping takes 2 to 4 business days nationwide. Priority express takes 1 to 2 business days, and our Riyadh Same-Day Concierge courier delivers the same day for orders placed before 2:00 PM AST.',
  },
  {
    id: 'faq-2',
    category: 'orders',
    questionAr: 'هل يتوفر شحن مجاني للطلبات؟',
    questionEn: 'Is complimentary shipping available?',
    answerAr: 'نعم، تمنح دار رِفْعة شحناً قياسياً مجانياً لكافة مناطق المملكة للطلبات التي تبلغ قيمتها 500 ريال سعودي فأكثر.',
    answerEn: 'Yes, RIFAA provides complimentary standard domestic shipping across all Saudi regions on all orders of SAR 500 or more.',
  },

  // Sizing & Fit
  {
    id: 'faq-3',
    category: 'sizing',
    questionAr: 'كيف أحدد مقاس الثوب أو العباية المناسب لي بدقة؟',
    questionEn: 'How do I choose the correct size for a Saudi thobe or abaya?',
    answerAr: 'تعتمد مقاسات الثياب والعبايات في رِفْعة على الطول الكامل بالبوصة (مثال: مقاس 54 يناسب القامات بين 156-162 سم). يمكنك مراجعة صفحة "دليل المقاسات" التفصيلية أو التواصل مع كونسيرج رِفْعة لمساعدتك في قياس الصدر والكم بدقة.',
    answerEn: 'Thobe and abaya sizes at RIFAA correspond to the total length in inches (e.g. size 54 fits heights between 156–162 cm). You can review our dedicated Size Guide page or connect with our concierge desk for personalized tailoring recommendations.',
  },
  {
    id: 'faq-4',
    category: 'sizing',
    questionAr: 'هل مقاسات الأطفال مطابقة للفئات العمرية المعتادة؟',
    questionEn: 'Are children’s sizes true to standard age brackets?',
    answerAr: 'نعم، صُممت مقاسات الأطفال لتلائم الفئات العمرية من سنتين وحتى 13 سنة، مع مراعاة اتساع مريح يتيح حرية الحركة واللعب والنمو الطبيعي.',
    answerEn: 'Yes, our children’s assortment is engineered to fit age groups from 2 to 13 years, cut with gentle proportions allowing unrestricted joyful movement.',
  },

  // Returns & Exchanges
  {
    id: 'faq-5',
    category: 'returns',
    questionAr: 'ما هي مهلة وسياسة استبدال أو إرجاع القطع؟',
    questionEn: 'What is the return and exchange window?',
    answerAr: 'يحق لعملائنا طلب استبدال المقاس أو الإرجاع مجاناً خلال 14 يوماً من تاريخ استلام الشحنة، شريطة بقاء القطعة في حالتها الأصلية غير ملبوسة ومع بطاقاتها السعرية وصندوقها التغليفي.',
    answerEn: 'Clients may request a complimentary exchange or return within 14 days of physical delivery, provided items remain unworn with original tags and presentation packaging intact.',
  },
  {
    id: 'faq-6',
    category: 'returns',
    questionAr: 'متى يتم استرداد المبلغ المدفوع بعد الإرجاع؟',
    questionEn: 'How soon are refunds processed after a return?',
    answerAr: 'تتم معالجة استرداد المبلغ إلى بطاقتك البنكية الأصلية خلال 3 إلى 5 أيام عمل من تاريخ وصول القطعة وفحص جودتها في محترفنا بالرياض.',
    answerEn: 'Refunds are reversed to the original card within 3 to 5 business days following receipt and quality inspection at our Riyadh atelier.',
  },

  // Payments & Pricing
  {
    id: 'faq-7',
    category: 'payment',
    questionAr: 'ما هي طرق الدفع المعتمدة لدى دار رِفْعة؟',
    questionEn: 'Which payment methods are accepted by RIFAA?',
    answerAr: 'نقبل بطاقات مدى البنكية السعودية، البطاقات الائتمانية (فيزا وماستركارد)، وخدمة آبل باي (Apple Pay). كافة الأسعار المعروضة هي بالريال السعودي (SAR) وشاملة لضريبة القيمة المضافة.',
    answerEn: 'We support Mada debit cards, major credit cards (Visa and Mastercard), and Apple Pay. All prices are denominated in Saudi Riyals (SAR) and include applicable VAT.',
  },

  // Care
  {
    id: 'faq-8',
    category: 'care',
    questionAr: 'كيف أعتني بأقمشة الكريب والكتان والحرير الطبيعي؟',
    questionEn: 'How should I care for Japanese crepe, linen, and silk pieces?',
    answerAr: 'نوصي دائماً بالتنظيف الجاف المعتمد للعبايات الكريب والبليزرات الصوفية والبشوت للحفاظ على هيكل القصّة وألياف الزري. أما أقمشة الكتان الخالص وأطقم الأطفال فيمكن غسلها يدوياً بماء بارد ومسحوق لطيف.',
    answerEn: 'We recommend professional delicate dry cleaning for crepe abayas, wool blazers, and ceremonial bishts to preserve their structural drape. Pure linen pieces and children’s organic cotton coordinates may be gently hand-washed in cold water.',
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
              ? 'إجابات وافية حول سياسات الشحن، اختيار المقاسات، طرق الدفع، وخدمات دار رِفْعة لعملائنا في المملكة.'
              : 'Detailed answers concerning shipping timelines, fit recommendations, payment methods, and client services.'}
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
                ? 'فريق كونسيرج رِفْعة بالرياض يسعد بخدمتكم هاتفياً أو عبر البريد الإلكتروني.'
                : 'Our Riyadh client services desk is available daily to assist you.'}
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
