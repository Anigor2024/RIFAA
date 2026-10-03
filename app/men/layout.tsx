import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "مجموعة الرجل | Men — رِفْعة RIFAA",
  description: "Contemporary Saudi menswear ecommerce collection with thobes, bishts, tailoring and accessories.",
  alternates: { canonical: "/men" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
