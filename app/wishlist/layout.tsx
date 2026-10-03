import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قائمة الرغبات | Wishlist — رِفْعة RIFAA',
  robots: { index: false, follow: false },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
