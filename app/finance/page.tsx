import type { Metadata } from 'next';
import { FinanceWorkspace } from '@/components/atheeldar/FinanceWorkspace';
import { getProperty } from '@/lib/atheeldar-data';
import { getFinancePropertyPrefill } from '@/lib/finance-model';

export const metadata: Metadata = {
  title: 'حاسبة التمويل ومقارنة الخطط',
  description: 'اختبر الدفعة الأولى والقسط ومدة التمويل، وقارن خطتين بجدول سداد سنوي واضح ومدخلات تختارها بنفسك.',
};

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ property?: string | string[] }> }) {
  const params = await searchParams;
  const slug = typeof params.property === 'string' ? params.property : undefined;
  const candidate = slug ? getProperty(slug) : undefined;
  const property = candidate && getFinancePropertyPrefill(candidate) ? candidate : undefined;
  const propertyNotice = slug && !property
    ? candidate?.purpose === 'للإيجار'
      ? 'العقار المحدد للإيجار؛ هذه الحاسبة مخصصة للشراء. أدخل سعر شراء مستقلًا لبدء خطتك.'
      : 'لم نعثر على عقار بيع بهذا الرابط. يمكنك استخدام الحاسبة بأرقامك الخاصة.'
    : undefined;
  return <FinanceWorkspace key={property?.slug ?? 'standalone'} property={property} propertyNotice={propertyNotice}/>;
}
