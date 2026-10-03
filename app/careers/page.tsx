'use client';

import Link from 'next/link';
import { Briefcase, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SaudiMotif } from '@/components/common/SaudiMotif';

export default function CareersPage() {
  const { language, isRtl } = useLanguage();

  const departments = [
    {
      id: 'textiles',
      titleAr: 'هندسة النسيج والتطريز النبيل',
      titleEn: 'Textile Engineering & Archival Embroidery',
      descriptionAr: 'اختيار الأنسجة الطبيعية فائقة النقاء، ضبط أوزان الحرير والكتان والصوف الصيفي، وتطوير أنماط التطريز التراثية بلغة معاصرة.',
      descriptionEn: 'Sourcing natural noble fibers, calibrating fabric weight and drape, and reinterpreting heritage stitchwork through contemporary precision.',
    },
    {
      id: 'digital',
      titleAr: 'التجارة الرقمية وتجربة العميل الفاخرة',
      titleEn: 'Digital Commerce & Luxury UX',
      descriptionAr: 'تصميم وبناء واجهات تسوق رفيعة المستوى تحتفي باللغة العربية وتوفر أداءً برمجياً فورياً يتفوق على المعايير العالمية.',
      descriptionEn: 'Designing and engineering editorial ecommerce touchpoints celebrating Arabic typography with sub-second performance.',
    },
    {
      id: 'styling',
      titleAr: 'الكونسيرج وتنسيق الإطلالات الخاصة',
      titleEn: 'Client Styling & Private Concierge',
      descriptionAr: 'تقديم استشارات خاصة للعملاء في مناسبات الأعياد والمواسم وحفلات المساء، وضبط المقاسات بدقة عالية.',
      descriptionEn: 'Providing confidential styling counsel for festive occasions, evening gala ensembles, and precise sizing curation.',
    },
    {
      id: 'spatial',
      titleAr: 'العمارة المكانية والهوية البصرية',
      titleEn: 'Spatial Architecture & Visual Identity',
      descriptionAr: 'صياغة اللغة البصرية، التحرير الفوتوغرافي، وتصميم الفضاءات المكانية التي تجسد الهيبة السعودية في أرقى صورها.',
      descriptionEn: 'Crafting brand visual identity, editorial photography, and spatial concepts embodying Saudi dignity.',
    },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#242220]/50 mb-8">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">
            {language === 'ar' ? 'المسيرة المهنية' : 'Careers'}
          </span>
        </nav>

        {/* Page Header */}
        <header className="pb-8 mb-10 border-b border-[#242220]/10 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#511D24] font-semibold">
            <Briefcase className="w-4 h-4" />
            <span>{language === 'ar' ? 'المواهب والإبداع' : 'TALENT & ATELIER'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
            {language === 'ar' ? 'المسيرة المهنية في دار رِفْعة' : 'Careers at RIFAA Atelier'}
          </h1>
          <p className="text-xs sm:text-sm text-[#242220]/75 max-w-2xl font-light leading-relaxed">
            {language === 'ar'
              ? 'تستعرض الصفحة تصوراً تنظيمياً يجمع الحرفة والتصميم والتجارة الرقمية داخل علامة أزياء سعودية معاصرة مفاهيمية.'
              : 'This page presents a conceptual organization blending craft, design, and digital commerce inside a contemporary Saudi fashion-house showcase.'}
          </p>
        </header>

        {/* Portfolio Notice */}
        <div className="p-4 bg-[#EAE3D6]/80 border-s-3 border-[#B59A73] text-xs text-[#242220]/80 leading-relaxed mb-12 shadow-2xs">
          <p className="font-semibold text-[#111111] mb-1">
            {language === 'ar' ? 'إشعار توضيحي لاستعراض محفظة الأعمال:' : 'Portfolio Demonstration Disclosure:'}
          </p>
          <p>
            {language === 'ar'
              ? 'دار رِفْعة هي مشروع استعراض محفظة تصميم وبرمجة رقمية. التخصصات الموضحة أدناه تُمثل أقسام الهيكل الإبداعي المفاهيمي لدار الأزياء ولا تمثل فرص توظيف حقيقية معلنة للتقديم حالياً.'
              : 'RIFAA is a digital design & engineering portfolio showcase. The discipline areas articulated below illustrate the creative structure of the fashion house and do not represent active commercial recruitment.'}
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 space-y-3 shadow-xs hover:border-[#242220]/30 transition-colors"
            >
              <span className="text-[10px] uppercase tracking-widest text-[#B59A73] font-semibold block">
                {language === 'ar' ? 'المجال الإبداعي' : 'Creative Domain'}
              </span>
              <h2 className="text-lg font-bold text-[#111111]">
                {language === 'ar' ? dept.titleAr : dept.titleEn}
              </h2>
              <p className="text-xs text-[#242220]/75 font-light leading-relaxed">
                {language === 'ar' ? dept.descriptionAr : dept.descriptionEn}
              </p>
            </div>
          ))}
        </div>

        {/* Motif Divider */}
        <div className="flex justify-center my-12">
          <SaudiMotif className="w-8 h-8 text-[#B59A73]" />
        </div>

        {/* General Inquiry CTA */}
        <div className="bg-[#FFFDFC] border border-[#242220]/10 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <Users className="w-8 h-8 text-[#511D24] mx-auto" />
          <h3 className="text-xl sm:text-2xl font-bold text-[#111111]">
            {language === 'ar' ? 'التعاون الإبداعي والشراكات' : 'Creative Collaborations & Inquiries'}
          </h3>
          <p className="text-xs sm:text-sm text-[#242220]/70 max-w-lg mx-auto font-light leading-relaxed">
            {language === 'ar'
              ? 'يعرض هذا القسم مثالاً على نقطة تواصل يمكن استخدامها للتعاون الإبداعي في نسخة إنتاجية مستقبلية، ولا يمثل دعوة توظيف أو شراكة تجارية نشطة.'
              : 'This section demonstrates how a future production brand could present a creative-collaboration inquiry touchpoint; it is not an active hiring or commercial partnership invitation.'}
          </p>
          <div className="pt-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 py-3 px-8 bg-[#111111] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#511D24] transition-colors"
            >
              <span>{language === 'ar' ? 'استكشف نموذج التواصل' : 'Explore Inquiry Experience'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
