import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "مجموعة المرأة | Women — رِفْعة RIFAA",
  description: "Premium women’s Saudi fashion ecommerce collection with abayas, tailoring, silk and accessories.",
  alternates: { canonical: "/women" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
