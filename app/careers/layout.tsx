import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "المسارات المهنية | Careers Concept — رِفْعة RIFAA",
  description: "Conceptual RIFAA team and creative-collaboration experience.",
  alternates: { canonical: "/careers" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
