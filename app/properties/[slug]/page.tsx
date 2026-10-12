import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getNeighborhood, getProperty, properties } from '@/lib/atheeldar-data';
import { PropertyDetailExperience } from '@/components/atheeldar/PropertyDetailExperience';
import { PropertyCard } from '@/components/atheeldar/PropertyCard';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  return property ? {
    title: property.title,
    description: property.description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: { title: `${property.title} | أثيلدار`, description: property.description, url: `/properties/${property.slug}`, images: [{ url: property.image, alt: property.title }] },
  } : { title: 'عقار غير موجود' };
}

export function generateStaticParams() { return properties.map(property => ({ slug: property.slug })); }

export default async function PropertyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();
  const residential = !['مكتب', 'أرض'].includes(property.type);
  const related = properties.filter(item => item.slug !== property.slug && item.purpose === property.purpose
    && (residential ? !['مكتب', 'أرض'].includes(item.type) : item.type === property.type))
    .sort((a, b) => Number(b.city === property.city) - Number(a.city === property.city)
      || Number(b.type === property.type) - Number(a.type === property.type))
    .slice(0, 3);
  return <>
    <PropertyDetailExperience key={property.slug} property={property} neighborhood={getNeighborhood(property.neighborhoodSlug)}/>
    {related.length > 0 && <section className="shell at-pd-related"><div className="at-section-heading"><div><p className="at-pd-eyebrow">وسّع دائرة الاختيار</p><h2>عقارات تستحق المقارنة.</h2><p>خيارات أخرى {property.purpose} من الكتالوج التوضيحي، مع أولوية لمدينة العقار ونوعه.</p></div><Link href={`/properties?purpose=${encodeURIComponent(property.purpose)}`} className="at-text-link">كل الخيارات <ArrowLeft size={17}/></Link></div><div className="propertyGrid">{related.map(item => <PropertyCard key={item.slug} p={item}/>)}</div></section>}
  </>;
}
