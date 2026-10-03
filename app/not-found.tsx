import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#F7F4EF] px-4 pt-32 pb-20">
      <div className="mx-auto max-w-2xl border border-[#242220]/10 bg-[#FFFDFC] p-8 text-center sm:p-12">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#511D24]">404 · RIFAA</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
          الصفحة غير متوفرة
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#242220]/65">
          Page not found. The link may have changed, or the requested piece may no longer be available.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#511D24]">
            العودة للرئيسية · Home
          </Link>
          <Link href="/new" className="border border-[#242220]/20 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:border-[#111111]">
            تصفح الجديد · New In
          </Link>
        </div>
      </div>
    </div>
  );
}
