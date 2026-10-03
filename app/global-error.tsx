'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, background: '#F7F4EF', color: '#111111', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
          <section style={{ maxWidth: 640, width: '100%', background: '#FFFDFC', border: '1px solid rgba(36,34,32,.12)', padding: 40, textAlign: 'center' }}>
            <div style={{ letterSpacing: '.2em', fontSize: 12, fontWeight: 700, color: '#511D24' }}>RIFAA · RECOVERY</div>
            <h1 style={{ margin: '16px 0 8px', fontSize: 30 }}>تعذر تحميل المتجر</h1>
            <p style={{ margin: '0 auto 24px', maxWidth: 480, lineHeight: 1.7, color: '#5a5652', fontSize: 14 }}>
              حدث خطأ غير متوقع. يمكنك إعادة المحاولة بأمان دون إعادة إدخال بيانات دفع.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{ border: 0, background: '#111111', color: '#fff', padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}
            >
              إعادة المحاولة · Retry
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
