export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-[#F7F4EF] px-4 pt-32 pb-20" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-3 w-24 bg-[#D9D0C4]" />
        <div className="mt-4 h-10 w-2/3 max-w-md bg-[#D9D0C4]/80" />
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-[3/4] bg-[#EAE4D9]" />
              <div className="h-3 w-3/4 bg-[#D9D0C4]" />
              <div className="h-3 w-1/3 bg-[#D9D0C4]/70" />
            </div>
          ))}
        </div>
        <span className="sr-only">جاري التحميل · Loading RIFAA</span>
      </div>
    </div>
  );
}
