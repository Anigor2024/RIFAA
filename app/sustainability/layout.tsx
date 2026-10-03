import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "الاستدامة | Sustainability Concept — رِفْعة RIFAA",
  description: "RIFAA sustainability and craft concept for a future production fashion brand.",
  alternates: { canonical: "/sustainability" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
