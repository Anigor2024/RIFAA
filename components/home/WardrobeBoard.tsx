'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Cloud,
  Eye,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAccount } from '@/context/AccountContext';
import { useAuth } from '@/context/AuthContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';

export function WardrobeBoard() {
  const { language, isRtl } = useLanguage();
  const { wishlistItems, wishlistCount } = useWishlist();
  const { recentlyViewedIds, cloudSyncState } = useAccount();
  const { user } = useAuth();

  const board = useMemo(() => {
    const recentlyViewed = recentlyViewedIds
      .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
      .filter((product): product is (typeof DEMO_PRODUCTS)[number] => Boolean(product));

    const fallback = DEMO_PRODUCTS.filter(
      (product) => product.inStock && (product.isBestSeller || product.isFeatured)
    );

    const unique = new Map(
      [...wishlistItems, ...recentlyViewed, ...fallback].map((product) => [product.id, product])
    );

    return Array.from(unique.values()).slice(0, 4);
  }, [recentlyViewedIds, wishlistItems]);

  const hasPersonalSignals = wishlistCount > 0 || recentlyViewedIds.length > 0;

  return (
    <section className="bg-[#F7F4EF] py-18 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 border-b border-[#242220]/10 pb-7 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">
                {language === 'ar' ? 'لوحة خزانة رِفْعة' : 'RIFAA WARDROBE BOARD'}
              </span>
            </div>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl lg:text-5xl">
              {hasPersonalSignals
                ? language === 'ar'
                  ? 'القطع التي لفتت انتباهك، مجمّعة في مكان واحد.'
                  : 'The pieces that caught your eye, gathered in one place.'
                : language === 'ar'
                  ? 'بداية ذكية لخزانتك قبل أن تحفظ أول قطعة.'
                  : 'A considered starting point before you save your first piece.'}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2 lg:justify-self-end">
            <div className="border border-[#242220]/10 bg-[#FFFDFC] p-3">
              <Heart className="h-4 w-4 text-[#511D24]" />
              <span className="mt-2 block text-lg font-bold text-[#111111]">{wishlistCount}</span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-[#242220]/45">
                {language === 'ar' ? 'محفوظة' : 'Saved'}
              </span>
            </div>
            <div className="border border-[#242220]/10 bg-[#FFFDFC] p-3">
              <Eye className="h-4 w-4 text-[#511D24]" />
              <span className="mt-2 block text-lg font-bold text-[#111111]">{recentlyViewedIds.length}</span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-[#242220]/45">
                {language === 'ar' ? 'شوهدت' : 'Viewed'}
              </span>
            </div>
            <div className="border border-[#242220]/10 bg-[#FFFDFC] p-3">
              <Cloud className="h-4 w-4 text-[#511D24]" />
              <span className="mt-2 block text-[11px] font-bold text-[#111111]">
                {user && cloudSyncState === 'synced'
                  ? language === 'ar'
                    ? 'متزامن'
                    : 'Synced'
                  : language === 'ar'
                    ? 'محلي'
                    : 'Local'}
              </span>
              <span className="mt-2 block text-[9px] uppercase tracking-[0.12em] text-[#242220]/45">
                {language === 'ar' ? 'الحساب' : 'Account'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {board.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-9 flex flex-col justify-between gap-4 border-t border-[#242220]/10 pt-6 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-xs leading-6 text-[#242220]/55">
            {user
              ? language === 'ar'
                ? 'عند تسجيل الدخول، المفضلة والمشاهدة الأخيرة تنتقل مع حسابك السحابي وتساعدك على العودة للقطع بسرعة.'
                : 'When signed in, saved and recently viewed pieces travel with your cloud account for a faster return journey.'
              : language === 'ar'
                ? 'ابدأ بالحفظ أو التصفح، ثم سجّل الدخول لاحقاً لمزامنة خزانة رِفْعة عبر حسابك.'
                : 'Start saving or browsing now, then sign in later to sync your RIFAA wardrobe across your account.'}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/wishlist"
              className="group inline-flex items-center gap-2 border border-[#111111] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#111111] transition-colors hover:bg-[#111111] hover:text-white"
            >
              <Heart className="h-3.5 w-3.5" />
              <span>{language === 'ar' ? 'قائمة الرغبات' : 'Wishlist'}</span>
            </Link>
            <Link
              href="/account"
              className="group inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#511D24]"
            >
              <span>{language === 'ar' ? 'مساحة العميل' : 'Client Space'}</span>
              {isRtl ? (
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
