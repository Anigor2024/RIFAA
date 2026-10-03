import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "عن رِفْعة | About RIFAA",
  description: "About the RIFAA premium Saudi fashion ecommerce concept and its design language.",
  alternates: { canonical: "/about" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
