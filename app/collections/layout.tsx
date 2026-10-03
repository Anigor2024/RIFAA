import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "التشكيلات | Collections — رِفْعة RIFAA",
  description: "Seasonal RIFAA fashion collections and curated edits.",
  alternates: { canonical: "/collections" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
