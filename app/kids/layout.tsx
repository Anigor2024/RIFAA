import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "مجموعة الأطفال | Kids — رِفْعة RIFAA",
  description: "Premium children’s Saudi fashion collection with occasionwear, thobes, dresses and knitwear.",
  alternates: { canonical: "/kids" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
