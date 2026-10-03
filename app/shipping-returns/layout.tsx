import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "الشحن والإرجاع | Shipping & Returns — رِفْعة RIFAA",
  description: "Illustrative RIFAA shipping and returns operating model for ecommerce implementation.",
  alternates: { canonical: "/shipping-returns" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
