import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { DEMO_PRODUCTS } from '@/data/products';
import { ProductDetailClient } from './ProductDetailClient';
import { getPairingRecommendations } from '@/lib/pairing';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return DEMO_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = DEMO_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'القطعة غير متوفرة | رِفْعة RIFAA',
    };
  }

  return {
    title: `${product.nameAr} | ${product.nameEn} — رِفْعة RIFAA`,
    alternates: { canonical: `/products/${product.slug}` },
    description: `${product.descriptionAr} ${product.descriptionEn}`,
    openGraph: {
      type: 'website',
      url: `/products/${product.slug}`,
      title: `${product.nameAr} | رِفْعة`,
      description: product.descriptionAr,
      images: [
        {
          url: product.image,
          alt: product.nameAr,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = DEMO_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Related products from SAME department, prioritizing same category or collection
  const relatedProducts = DEMO_PRODUCTS.filter(
    (p) => p.id !== product.id && p.department === product.department
  ).sort((a, b) => {
    // Priority 1: same categoryKey
    const aCat = a.categoryKey === product.categoryKey ? 2 : 0;
    const bCat = b.categoryKey === product.categoryKey ? 2 : 0;
    // Priority 2: same collectionKey
    const aCol = a.collectionKey === product.collectionKey ? 1 : 0;
    const bCol = b.collectionKey === product.collectionKey ? 1 : 0;
    return (bCat + bCol) - (aCat + aCol);
  }).slice(0, 4);

  const pairingRecommendations = getPairingRecommendations(product, 3);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      pairingRecommendations={pairingRecommendations}
    />
  );
}
