import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "المتاجر | Stores Concept — رِفْعة RIFAA",
  description: "Concept retail and private-client store experience for the RIFAA portfolio showcase.",
  alternates: { canonical: "/stores" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
