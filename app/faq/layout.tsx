import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | FAQ — رِفْعة RIFAA",
  description: "RIFAA storefront FAQ covering showcase delivery, sizing, returns, payment and care flows.",
  alternates: { canonical: "/faq" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
