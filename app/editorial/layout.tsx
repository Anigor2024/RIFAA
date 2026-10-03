import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "المجلة والإطلالات | Editorial — رِفْعة RIFAA",
  description: "RIFAA editorial stories exploring contemporary Saudi style, fabric, layering and occasion dressing.",
  alternates: { canonical: "/editorial" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
