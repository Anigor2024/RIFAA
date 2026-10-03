import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Privacy — رِفْعة RIFAA",
  description: "Illustrative privacy and data-protection policy template for the RIFAA ecommerce showcase.",
  alternates: { canonical: "/privacy" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
