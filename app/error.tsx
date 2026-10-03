'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('RIFAA route error', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#F7F4EF] px-4 pt-32 pb-20">
      <div className="mx-auto max-w-2xl border border-[#242220]/10 bg-[#FFFDFC] p-8 text-center sm:p-12">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#511D24]">RIFAA · RECOVERY</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
          تعذر تحميل هذه التجربة
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#242220]/65">
          Something unexpected happened. Your local bag and wishlist remain on this device, so you can safely retry.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#511D24]"
          >
            إعادة المحاولة · Retry
          </button>
          <Link href="/" className="border border-[#242220]/20 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:border-[#111111]">
            الرئيسية · Home
          </Link>
        </div>
      </div>
    </div>
  );
}
